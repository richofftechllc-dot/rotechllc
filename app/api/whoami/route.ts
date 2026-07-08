import { NextResponse } from "next/server";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/whoami — lightweight "is this person staff?" check for gating internal-only
// UI (e.g. the K-12 tutors on /bo). Returns { ok, isCoach }. Non-coaches/anon → isCoach:false.
export async function GET(req: Request) {
  try {
    const admin = await getAuthedAdmin(req);
    return NextResponse.json({ ok: true, isCoach: !!admin });
  } catch {
    return NextResponse.json({ ok: true, isCoach: false });
  }
}
