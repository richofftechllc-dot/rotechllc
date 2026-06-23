import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

// POST /api/admin/assistant — "Bo Tech" inside the CRM.
// A coach asks about members / ops; Bo answers using the roster + the member they're
// looking at. It can DRAFT messages and tell the coach exactly which action button to
// use (Send Update / Add Track / Send Invoice) — the coach stays in control of sends.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return new Response("forbidden", { status: 403 });

  let body: { messages?: Msg[]; roster?: string; focus?: unknown };
  try { body = await req.json(); } catch { return new Response("bad json", { status: 400 }); }
  const messages = (body.messages || []).filter((m) => m?.content?.trim()).slice(-12);
  if (!messages.length) return new Response("no messages", { status: 400 });

  const isOwner = admin.discordId === (process.env.RANDY_DISCORD_ID || "").trim();
  const system = [
    "You are Bo Tech, the AI assistant inside the Rich Off Tech coaching CRM.",
    `You're helping ${admin.name}, a ROT coach${isOwner ? " (the owner, Randy — full access incl. invoices)" : ""}.`,
    "Rich Off Tech is a tech-career company: cleared IT, cybersecurity (Security+), ServiceNow CSA, AWS AI Practitioner, resume help, and 1-on-1 coaching.",
    "You help coaches manage members: who's expiring, who's behind, what to follow up on, and you DRAFT outreach (DMs, check-ins) in a real, grounded, hype-but-not-corny voice.",
    "When you draft a member message, keep it tight and human. After drafting, tell the coach: 'Use Send Update on their card to send it.'",
    "Actions available in the CRM: Send Update (DMs the member), Add Track (grants a cert track), Schedule Call, View Resume" + (isOwner ? ", Send Invoice (owner-only)." : " (Send Invoice is owner-only — you can't trigger it)."),
    "You CAN see each member's tier, payment status, days left, cert TRACKS, and quiz PROGRESS (quizzes done, average score, weak domains) — it's in the roster below. Use it to answer 'who's behind' (e.g. paid but no quiz activity, low averages, or weak domains) — don't claim you lack the data.",
    "Be concise and practical. If something genuinely isn't in the data, say so plainly — don't invent member details.",
    body.focus ? `MEMBER THE COACH IS LOOKING AT:\n${JSON.stringify(body.focus).slice(0, 4000)}` : "",
    body.roster ? `ROSTER (name | tier | payment | days left | tracks | quiz progress):\n${String(body.roster).slice(0, 9000)}` : "",
  ].filter(Boolean).join("\n\n");

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("(Bo is in local test mode — ANTHROPIC_API_KEY isn't set.)", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!upstream.ok) return new Response("Bo had trouble reaching the model. Try again.", { status: 502 });
  const data = await upstream.json() as { content?: { text?: string }[] };
  const text = (data.content || []).map((b) => b.text || "").join("").trim() || "(no reply)";
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
