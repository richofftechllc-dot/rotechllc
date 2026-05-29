import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// POST /api/resume/save
// Body: { code, name, resume }
// Forwards to Zapier Catch Hook (ZAPIER_RESUME_SAVE_HOOK env var) which writes to Firestore.
// Returns ok regardless of webhook configuration — fire-and-forget for save.
export async function POST(req: Request) {
  let body: { code?: string; name?: string; resume?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  if (!body?.code?.trim()) {
    return NextResponse.json({ ok: false, error: "missing_code" }, { status: 400 });
  }

  const hook = process.env.ZAPIER_RESUME_SAVE_HOOK;
  if (!hook) {
    // Not configured yet — accept the save silently so the UI works smoothly.
    return NextResponse.json({ ok: true, persisted: false, reason: "no_webhook_configured" });
  }

  try {
    const payload = {
      code: body.code,
      name: body.name || "",
      resume_json: JSON.stringify(body.resume || {}),
      updated_at: new Date().toISOString(),
    };
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return NextResponse.json({ ok: r.ok, persisted: r.ok, status: r.status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, persisted: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
