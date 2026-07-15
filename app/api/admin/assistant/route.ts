import { getAuthedAdmin } from "@/lib/admin";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

// Coach-invoice services (mirror coachinvoice.SERVICES in the bot). Bo maps a plain
// request ("invoice X for CSA Essential") onto one of these keys; the bot enforces the
// $300 coach discount cap + attribution. These are the FULL base prices — coaches apply
// a discount on top; the July promo numbers are the public self-serve links, not these.
const COACH_SERVICES = [
  { key: "sec-essential", label: "CompTIA Security+ — Essential", amount: 150000 },
  { key: "sec-accelerated", label: "CompTIA Security+ — Accelerated", amount: 240000 },
  { key: "csa-essential", label: "ServiceNow CSA — Essential", amount: 160000 },
  { key: "csa-accelerated", label: "ServiceNow CSA — Accelerated", amount: 280000 },
  { key: "aws", label: "AWS Cloud Practitioner", amount: 100000 },
];

// --- live member lookup -----------------------------------------------------
// The roster string handed in from the CRM is truncated and lossy — Bo kept telling
// coaches "I don't have their email/Discord" for members whose records are ON FILE.
// This tool reads `customers` directly so Bo can resolve ANY member the coach names
// (by name, email, quiz code, or Discord) to their real contact + status.
type MemberHit = {
  name: string; email: string; discordTag: string; discordId: string;
  quizCode: string; tier: string; tracks: string[]; plan: string;
  paymentStatus: string; daysLeft: number | null;
};

async function findMembers(query: string, limit = 8): Promise<MemberHit[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const snap = await coll("customers").limit(2000).get();
  const now = Date.now();
  const hits: { score: number; m: MemberHit }[] = [];
  for (const d of snap.docs) {
    const c = d.data() as Record<string, unknown>;
    const name = String(c.name || c.firstName || "");
    const email = String(c.email || "");
    const code = String(c.quizCode || "");
    const dtag = String(c.discordTag || "");
    const did = String(c.discordId || "");
    const hay = [name, email, code, dtag, did].join(" ").toLowerCase();
    if (!hay.includes(q)) continue;
    const nl = name.toLowerCase();
    let score = 1;
    if (nl === q || email.toLowerCase() === q || code.toLowerCase() === q) score = 100;
    else if (nl.startsWith(q)) score = 50;
    else if (nl.split(/\s+/).includes(q)) score = 40;
    const plan = String(c.billingCycle || c.plan || "annual");
    let accessEnd = String(c.accessEndDate || "");
    if (!accessEnd && c.purchaseDate) {
      const start = Date.parse(String(c.purchaseDate));
      if (!isNaN(start)) accessEnd = new Date(start + (plan === "monthly" ? 30 : 365) * 86400000).toISOString();
    }
    const endMs = accessEnd ? Date.parse(accessEnd) : NaN;
    const daysLeft = !isNaN(endMs) ? Math.round((endMs - now) / 86400000) : null;
    const tracks = (c.tracks as string[])?.length ? (c.tracks as string[])
      : c.track ? [String(c.track)] : [];
    hits.push({ score, m: {
      name, email, discordTag: dtag, discordId: did, quizCode: code,
      tier: String(c.productType || c.tier || ""), tracks, plan,
      paymentStatus: daysLeft !== null && daysLeft < 0 ? "expired" : "active",
      daysLeft,
    } });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit).map((h) => h.m);
}

// POST /api/admin/assistant — "Bo Tech" inside the CRM.
// Coaches ask about members / ops; Bo answers from the roster + a live member lookup,
// and can SEND an invoice on request (tool-call → queues the same `invoice` botCommand
// the button uses). Runs an agentic tool loop so a single ask can look a member up AND
// invoice them in one turn.
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
    "CRITICAL — you have a `lookup_member` tool that reads the live member database. When a coach names a member (even just a first name like 'Racee' or 'Justice'), CALL lookup_member FIRST to pull their email, Discord, quiz code, tier, tracks, and status. You almost ALWAYS already have them on file — do NOT tell a coach you don't have someone's email/Discord until lookup_member has come back empty, and do NOT ask the coach for an email you can look up yourself.",
    "You CAN also SEND a Square invoice via the send_invoice tool when the coach clearly asks (e.g. 'invoice Racee for CSA Essential, $200 off'). Resolve the member with lookup_member, use that email, then send. Coaches can discount up to $300; more is refused (owner only). If the SERVICE or discount is genuinely ambiguous, ask — but never ask for contact info you can look up.",
    `INVOICE SERVICES (key = label ($full price before discount)): ${serviceList}. Pass the matching key; the coach's discount comes off this.`,
    "The roster below is a quick summary (name | email | code | discord | tier | payment | days left | tracks | progress). It may be truncated — treat lookup_member as the source of truth for any specific member.",
    "Be concise and practical. Don't invent member details — look them up.",
    body.focus ? `MEMBER THE COACH IS LOOKING AT:\n${JSON.stringify(body.focus).slice(0, 4000)}` : "",
    body.roster ? `ROSTER SUMMARY:\n${String(body.roster).slice(0, 9000)}` : "",
  ].filter(Boolean).join("\n\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("(Bo is in local test mode — ANTHROPIC_API_KEY isn't set.)", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const tools = [
    {
      name: "lookup_member",
      description: "Look up a Rich Off Tech member by name, email, quiz code, or Discord handle. Returns matches with email, Discord, quiz code, tier, tracks, plan, and days left. Use this to resolve any member the coach names before asking them for details.",
      input_schema: {
        type: "object",
        properties: { query: { type: "string", description: "name, email, quiz code, or discord handle to search for (partial is fine)" } },
        required: ["query"],
      },
    },
    {
      name: "send_invoice",
      description: "Send a Square invoice to a member. The member is emailed a real invoice. Coach discounts are capped at $300.",
      input_schema: {
        type: "object",
        properties: {
          memberEmail: { type: "string", description: "the member's email address (from lookup_member or the roster)" },
          memberName: { type: "string", description: "the member's name" },
          service: { type: "string", enum: COACH_SERVICES.map((s) => s.key), description: "which cert service to invoice for" },
          discountDollars: { type: "number", description: "discount in whole dollars (0 if none). Coaches max 300." },
        },
        required: ["memberEmail", "service"],
      },
    },
    {
      name: "cancel_invoice",
      description: "Cancel/void a member's most recent UNPAID Square invoice (or a specific invoice number). Never cancels an already-PAID invoice. Use when a coach says 'cancel that invoice', 'void Justice's invoice', 'that was a test, cancel it', etc. Resolve the member with lookup_member first for their email.",
      input_schema: {
        type: "object",
        properties: {
          memberEmail: { type: "string", description: "the member's email (from lookup_member or the roster)" },
          memberName: { type: "string", description: "the member's name" },
          invoiceNumber: { type: "string", description: "optional specific Square invoice number, e.g. 000232. Omit to cancel their most recent unpaid invoice." },
        },
        required: ["memberEmail"],
      },
    },
  ];

  type Block = { type: string; text?: string; id?: string; name?: string; input?: Record<string, unknown> };
  const convo: Array<{ role: "user" | "assistant"; content: unknown }> = messages.map((m) => ({ role: m.role, content: m.content }));
  let finalText = "";
  let invoiceNote = "";

  for (let iter = 0; iter < 5; iter++) {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1024, system, tools, messages: convo }),
    });
    if (!upstream.ok) return new Response("Bo had trouble reaching the model. Try again.", { status: 502 });
    const data = await upstream.json() as { content?: Block[] };
    const blocks = data.content || [];
    const textPart = blocks.filter((b) => b.type === "text").map((b) => b.text || "").join("").trim();
    if (textPart) finalText += (finalText ? "\n\n" : "") + textPart;

    const toolUses = blocks.filter((b) => b.type === "tool_use");
    if (!toolUses.length) break;

    convo.push({ role: "assistant", content: blocks });
    const toolResults: Array<{ type: string; tool_use_id?: string; content: string }> = [];
    for (const tu of toolUses) {
      if (tu.name === "lookup_member") {
        const hits = await findMembers(String(tu.input?.query || ""));
        toolResults.push({
          type: "tool_result", tool_use_id: tu.id,
          content: hits.length ? JSON.stringify(hits) : "No member matched that. Try a different spelling or a partial name/email/code.",
        });
        continue;
      }
      if (tu.name === "send_invoice") {
        const inp = tu.input || {};
        const svc = COACH_SERVICES.find((s) => s.key === inp.service);
        const email = String(inp.memberEmail || "").trim().toLowerCase();
        if (!svc || !email.includes("@")) {
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Failed: need a valid member email and a known service key." });
          continue;
        }
        const discountCents = Math.max(0, Math.round((Number(inp.discountDollars) || 0) * 100));
        if (discountCents > 30000 && !isOwner) {
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Refused: discount over $300 — only Randy (owner) can send that." });
          continue;
        }
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
          invoiceNote = `✅ Invoice queued: ${svc.label}${off} → ${inp.memberName || email}. Square is emailing it now; it'll show in follow-ups for payment tracking.`;
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: invoiceNote });
        } catch {
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Failed to queue the invoice — tell the coach to use the 🧾 Send invoice button on the member card." });
        }
        continue;
      }
      if (tu.name === "cancel_invoice") {
        const inp = tu.input || {};
        const email = String(inp.memberEmail || "").trim().toLowerCase();
        if (!email.includes("@")) {
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Failed: need a valid member email to cancel an invoice." });
          continue;
        }
        const invoiceNumber = inp.invoiceNumber ? String(inp.invoiceNumber).trim() : "";
        try {
          await coll("botCommands").add({
            type: "cancelInvoice",
            payload: { clientName: String(inp.memberName || email), clientEmail: email, ...(invoiceNumber ? { invoiceNumber } : {}) },
            status: "pending",
            requestedBy: admin.discordId,
            requestedByName: admin.name,
            createdAt: new Date().toISOString(),
          });
          invoiceNote = `🚫 Cancel queued: ${invoiceNumber ? `invoice #${invoiceNumber}` : "the most recent unpaid invoice"} for ${inp.memberName || email}. It'll void in Square in a few seconds (paid invoices are never touched).`;
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: invoiceNote });
        } catch {
          toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Failed to queue the cancel — the coach can cancel it directly in Square." });
        }
        continue;
      }
      toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: "Unknown tool." });
    }
    convo.push({ role: "user", content: toolResults });
  }

  return new Response(finalText || invoiceNote || "(no reply)", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
