import { NextResponse } from "next/server";
import { getAuthedCode } from "@/lib/session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// POST /api/resume/save
// Auth: rot_session cookie required (members-only).
// Body: { name?, resume }                — code is derived from session, NOT body.
// Forwards to Zapier Catch Hook (ZAPIER_RESUME_SAVE_HOOK) which writes to Firestore.
export async function POST(req: Request) {
  const code = await getAuthedCode(req);
  if (!code) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { name?: string; resume?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const hook = process.env.ZAPIER_RESUME_SAVE_HOOK;
  if (!hook) {
    return NextResponse.json({ ok: true, persisted: false, reason: "no_webhook_configured" });
  }

  try {
    const payload = {
      code, // authoritative — from session, not request body
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
