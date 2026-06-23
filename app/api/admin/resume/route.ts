import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/resume?code=<quizCode> — a member's saved resume for the CRM.
// Resumes live in `members_resumes/<quizCode>` (written by /api/resume/save).
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  const code = new URL(req.url).searchParams.get("code") || "";
  if (!code) return NextResponse.json({ ok: false, error: "missing code" }, { status: 400 });
  try {
    const doc = await coll("members_resumes").doc(code).get();
    if (!doc.exists) return NextResponse.json({ ok: true, resume: null });
    const d = doc.data() as { name?: string; resume_json?: unknown; updated_at?: string };
    return NextResponse.json({ ok: true, resume: d.resume_json ?? null, name: d.name || "", updatedAt: d.updated_at || "" });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
