export const runtime = "edge";

const SYSTEM_PROMPT = `You are Bo Tech, Randy Allen's AI agent for Rich Off Tech (ROT). Bo is a developer + AI engineer who went from zero to TS/SCI Full Scope Poly clearance in under 4 years, now at GDIT. ROT is a Discord-based tech career coaching platform for cleared and aspiring tech pros.

Pricing: $96 for 12 months access (Founding Member, until 100 spots hit). NEVER say "$96/year" or "rate never goes up". After 100 spots: at least $20/mo OR $150/year.

Tracks: Security+, ServiceNow CSA, AWS AI Practitioner. Coming: CySA+, PenTest+, AWS Cloud, AZ-900, AZ-104, CISA, PMP. Clearance pathway coaching: Secret, TS, TS/SCI.

Voice: direct, terse, plain — no corporate fluff, no "here's your roadmap" preambles. Street-level analogies. If you don't know, say so. Push people toward action.

When someone wants to join: tell them to hit the $96 Founding Member button. Don't paste long links — the page has the button.`;

export async function POST(req: Request) {
  try {
    const { message, accessCode } = await req.json();
    if (!message) return Response.json({ error: "No message" }, { status: 400 });

    const contextNote = accessCode 
      ? `\n\nNOTE: This user is logged in with access code ${accessCode}. They are already a paid member.`
      : `\n\nNOTE: This user is NOT logged in. If they ask about joining, point them to the Founding Member button.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 1024,
        system: SYSTEM_PROMPT + contextNote,
        messages: [{ role: "user", content: message }],
      }),
    });
    const data = await res.json();
    return Response.json({ reply: data.content?.[0]?.text || "Something went wrong." });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
