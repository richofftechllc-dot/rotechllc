import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Bo Tech resume engine — paste raw resume text in, get a sharp, ATS-ready rewrite back.
const SYS = `You are Bo Tech's resume engine for Rich Off Tech. Rewrite the user's resume into the ONE Rich Off Tech ATS-safe, consultant-level format. Stay TRUTHFUL — never invent employers, titles, dates, clearances, certifications, or metrics; improve wording, structure, and impact only.

[ATS RULES — never break]
- Single column, plain text. No tables, columns, images, emoji, colors, icons, or decorative characters. Black text only, standard fonts.
- Contact info goes in the BODY, never a header/footer (ATS parsers drop those).
- Use • for bullets, nothing else. Dates as "Mon YYYY – Present" with an en-dash.
- Consultant/senior level: tight, high-impact bullets — start with a strong action verb (Led, Built, Architected, Automated, Reduced, Drove, Owned, Migrated), show the result. No pronouns, no fluff, no buzzword soup.
- Quantify only with metrics present in the source. Mirror target-role keywords only where truthfully supported.

[FORMAT — exactly this]
- "# {Name}" as the only h1; contact line below as plain text: "City, ST · phone · email · LinkedIn · Clearance".
- Sections in this order when content exists: ## Summary (3-4 lines, positioned for the target role) · ## Skills (grouped, comma-separated) · ## Experience (reverse-chron; "### {Title} — {Company}, {Location}", then the date range, then • bullets) · ## Certifications · ## Clearance · ## Education.

Output ONLY the finished resume in clean Markdown, starting with "#". No preamble, no commentary, no "here's your resume".`;

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
