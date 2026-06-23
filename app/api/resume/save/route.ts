import { NextResponse } from "next/server";
import { getAuthedCode } from "@/lib/session";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/resume/save
// Auth: rot_session cookie required (members-only). Code is derived from the session, NOT the body.
// Body: { name?, resume }
//
// Writes directly to Firestore (members_resumes/<code>) via .set() — a true upsert, so re-saves
// OVERWRITE the member's existing resume instead of erroring. This replaces the old Zapier
// Catch-Hook path, whose Firestore "Create Document" action threw 409 "already exists" on every
// re-save. No webhook, no Zap, no 409.
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

  try {
    await coll("members_resumes").doc(code).set({
      code, // authoritative — from session, not request body
      name: body.name || "",
      resume_json: JSON.stringify(body.resume || {}),
      updated_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, persisted: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, persisted: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
