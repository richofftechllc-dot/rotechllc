import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CRM settings (Firestore `crmConfig/settings`). Currently: referralPayout ($ per paid referral).
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const doc = await coll("crmConfig").doc("settings").get();
    const d = (doc.exists ? doc.data() : {}) as { referralPayout?: number };
    return NextResponse.json({ ok: true, referralPayout: typeof d.referralPayout === "number" ? d.referralPayout : 20 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { referralPayout?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  try {
    const referralPayout = Math.max(0, Math.min(100000, Number(body.referralPayout) || 0));
    await coll("crmConfig").doc("settings").set({ referralPayout, updatedBy: admin.name, updatedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true, referralPayout });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
