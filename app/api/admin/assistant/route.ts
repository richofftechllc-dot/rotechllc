import { getAuthedAdmin } from "@/lib/admin";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

// Coach-invoice services (mirror coachinvoice.SERVICES in the bot). Bo maps a plain
// request ("invoice X for CSA Essential") onto one of these keys; the bot enforces the
// $300 coach discount cap + attribution.
const COACH_SERVICES = [
  { key: "sec-essential", label: "CompTIA Security+ — Essential", amount: 150000 },
  { key: "sec-accelerated", label: "CompTIA Security+ — Accelerated", amount: 240000 },
  { key: "csa-essential", label: "ServiceNow CSA — Essential", amount: 160000 },
  { key: "csa-accelerated", label: "ServiceNow CSA — Accelerated", amount: 280000 },
  { key: "aws", label: "AWS Cloud Practitioner", amount: 100000 },
];

// POST /api/admin/assistant — "Bo Tech" inside the CRM.
// Coaches ask about members / ops; Bo answers from the roster AND can now SEND an invoice
// on request (tool-call → queues the same `invoice` botCommand the button uses).
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return new Response("forbidden", { status: 403 });

  let body: { messages?: Msg[]; roster?: string; focus?: unknown };
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const messages = (body.messages || []).filter((m) => m?.content?.trim()).slice(-12);
  if (!messages.length) return new Response("no messages", { status: 400 });

  const isOwner = admin.discordId === (process.env.RANDY_DISCORD_ID || "").trim();
  const serviceList = COACH_SERVICES.map((s) => `${s.key} = ${s.label} ($${(s.amount / 100).toFixed(0)})`).join("; ");
  const system = [
    "You are Bo Tech, the AI assistant inside the Rich Off Tech coaching CRM.",
    `You're helping ${admin.name}, a ROT coach${isOwner ? " (the owner, Randy)" : ""}.`,
    "Rich Off Tech is a tech-career company: cleared IT, cybersecurity (Security+), ServiceNow CSA, AWS AI Practitioner, resume help, and 1-on-1 coaching.",
    "You help coaches manage members and DRAFT outreach in a real, grounded, hype-but-not-corny voice.",
    "You CAN also SEND a Square invoice yourself via the send_invoice tool when the coach clearly asks (e.g. 'invoice Detron for CSA Essential, $200 off'). Use the member's EMAIL from the roster. Coaches can discount up to $300; more is refused (Randy only). If the member, service, or amount is unclear, ASK — don't guess an email or a price.",
    `INVOICE SERVICES (key = label ($price)): ${serviceList}. Pass the matching key.`,
    "You CAN see each member's tier, payment status, days left, cert TRACKS, and quiz PROGRESS in the roster below. Use it to answer 'who's behind'.",
    "Be concise and practical. Don't invent member details.",
    body.focus ? `MEMBER THE COACH IS LOOKING AT:\n${JSON.stringify(body.focus).slice(0, 4000)}` : "",
    body.roster ? `ROSTER (name | email | tier | payment | days left | tracks | quiz progress):\n${String(body.roster).slice(0, 9000)}` : "",
  ].filter(Boolean).join("\n\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("(Bo is in local test mode — ANTHROPIC_API_KEY isn't set.)", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const tools = [{
    name: "send_invoice",
    description: "Send a Square invoice to a member. The member is emailed a real invoice. Coach discounts are capped at $300.",
    input_schema: {
      type: "object",
      properties: {
        memberEmail: { type: "string", description: "the member's email address, taken from the roster" },
        memberName: { type: "string", description: "the member's name" },
        service: { type: "string", enum: COACH_SERVICES.map((s) => s.key), description: "which cert service to invoice for" },
        discountDollars: { type: "number", description: "discount in whole dollars (0 if none). Coaches max 300." },
      },
      required: ["memberEmail", "service"],
    },
  }];

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      tools,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!upstream.ok) return new Response("Bo had trouble reaching the model. Try again.", { status: 502 });
  const data = await upstream.json() as { content?: Array<{ type: string; text?: string; name?: string; input?: Record<string, unknown> }> };
  const blocks = data.content || [];

  let text = blocks.filter((b) => b.type === "text").map((b) => b.text || "").join("").trim();

  // Execute any send_invoice tool call by queuing the SAME invoice botCommand the button
  // uses. The bot attributes it to this coach + enforces the $300 cap.
  for (const b of blocks) {
    if (b.type !== "tool_use" || b.name !== "send_invoice") continue;
    const inp = b.input || {};
    const svc = COACH_SERVICES.find((s) => s.key === inp.service);
    const email = String(inp.memberEmail || "").trim().toLowerCase();
    if (!svc || !email.includes("@")) { text += `\n\n⚠️ I couldn't send that invoice — I need a valid member email and a known service.`; continue; }
    const discountCents = Math.max(0, Math.round((Number(inp.discountDollars) || 0) * 100));
    if (discountCents > 30000 && !isOwner) { text += `\n\n⚠️ That discount is over $300 — Randy has to send that one.`; continue; }
    try {
      await coll("botCommands").add({
        type: "invoice",
        payload: { clientName: String(inp.memberName || email), clientEmail: email, service: svc.key, discountCents },
        status: "pending",
        requestedBy: admin.discordId,
        requestedByName: admin.name,
        createdAt: new Date().toISOString(),
      });
      const off = discountCents > 0 ? ` (−$${(discountCents / 100).toFixed(0)} off)` : "";
      text += `\n\n✅ Invoice queued: **${svc.label}**${off} → ${inp.memberName || email}. Square is emailing it now, and it'll show in your follow-ups for payment tracking.`;
    } catch {
      text += `\n\n⚠️ Something went wrong queuing that invoice — try the 🧾 Send invoice button on their card.`;
    }
  }

  return new Response(text || "(no reply)", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
