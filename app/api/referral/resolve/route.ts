import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/referral/resolve?code=xxx — public. Returns the referrer's display name for
// the landing page ("Referred by ___"). Never exposes anything sensitive.
export async function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("code") || "").toLowerCase().trim();
  if (!code) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const snap = await coll("customers").where("referralCode", "==", code).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false, valid: false });
    const c = snap.docs[0].data() as { name?: string; firstName?: string };
    const name = (c.name || c.firstName || "a member").split(" ")[0];
    return NextResponse.json({ ok: true, valid: true, referrerName: name });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
