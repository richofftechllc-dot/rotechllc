import { NextResponse } from "next/server";
import { getAuthedCode } from "@/lib/session";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// POST /api/resume/load
// Auth: rot_session cookie required (members-only).
// Body: ignored.                   — code is derived from session, NOT body.
// Prevents anyone from pulling someone else's resume by guessing a code.
// Forwards to Zapier Catch Hook (ZAPIER_RESUME_LOAD_HOOK) which runs a Firestore query
// keyed by {code}. Expected response shape: { resume_json, updated_at } or empty.
export async function POST(req: Request) {
  const code = await getAuthedCode(req);
  if (!code) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const hook = process.env.ZAPIER_RESUME_LOAD_HOOK;
  if (!hook) {
    return NextResponse.json({ ok: true, found: false, reason: "no_webhook_configured" });
  }

  try {
    const r = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }), // authoritative — from session, not request body
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
