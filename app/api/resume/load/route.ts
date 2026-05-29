import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// POST /api/resume/load
// Body: { code }
// Forwards to Zapier Catch Hook (ZAPIER_RESUME_LOAD_HOOK env var) which runs a Firestore query.
// Expected Zapier response shape (configure the Zap accordingly):
//   { resume_json: "<stringified StructuredResume>", updated_at: "<iso>" }
// or null/empty when no row exists for this code.
export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  if (!body?.code?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
  }

  const hook = process.env.ZAPIER_RESUME_LOAD_HOOK;
  if (!hook) {
    return NextResponse.json({ ok: true, found: false, reason: "no_webhook_configured" });
  }

  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: body.code }),
    });
    if (!r.ok) {
      return NextResponse.json({ ok: false, found: false, status: r.status });
    }
    const data: { resume_json?: string; updated_at?: string } | null = await r.json().catch(() => null);
    if (!data?.resume_json) {
      return NextResponse.json({ ok: true, found: false });
    }
    let resume: unknown = null;
    try { resume = JSON.parse(data.resume_json); } catch { /* malformed */ }
    if (!resume) {
      return NextResponse.json({ ok: true, found: false });
    }
    return NextResponse.json({ ok: true, found: true, resume, updated_at: data.updated_at || null });
  } catch (e) {
    return NextResponse.json(
      { ok: false, found: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
