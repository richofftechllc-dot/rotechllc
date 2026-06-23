import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bo Tech resume engine — paste raw resume text in, get a sharp, ATS-ready rewrite back.
const SYS = `You are Bo Tech's resume engine for Rich Off Tech. Rewrite the user's resume to be sharp, ATS-friendly, and recruiter-ready for tech and cleared roles. Rules:
- Stay TRUTHFUL. Never invent employers, titles, dates, clearances, or certifications. Improve wording, structure, and impact only.
- Strong action verbs. Quantify impact where the source implies it — never fabricate numbers; if none exist, keep it qualitative.
- Clean sections in this order when the content exists: Summary, Skills, Experience (bullets), Certifications, Education, Clearance.
- Tight, scannable bullets: start with a verb, show the result. No pronouns, no fluff, no buzzword soup.
- If a target role is provided, mirror its keywords naturally (only where true).
Output ONLY the finished resume in clean Markdown. No preamble, no commentary, no "here's your resume".`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const resumeText = String(body?.resumeText || "").slice(0, 12000);
    const role = String(body?.role || "").slice(0, 200);
    if (resumeText.trim().length < 40) {
      return NextResponse.json({ error: "Paste your full resume text (at least a few lines)." }, { status: 400 });
    }
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 2000,
        system: SYS,
        messages: [{ role: "user", content: `${role ? `TARGET ROLE: ${role}\n\n` : ""}RESUME:\n${resumeText}` }],
      }),
    });
    const data = await res.json();
    const text = data?.content?.[0]?.text;
    if (!text) return NextResponse.json({ error: "Couldn't generate — model key not set (local test mode)." }, { status: 502 });
    return NextResponse.json({ resume: text });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
