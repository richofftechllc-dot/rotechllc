import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// $127 referral-rate yearly. DURABLE quick_pay link (reusable — every buyer gets a
// fresh order, so it never dies). The old jSF7J4zp was `order`-based = single-use and
// would have bounced to /welcome after the first referral sale. Do not revert.
const CHECKOUT_URL = "https://square.link/u/bLYKQOxs";

// POST /api/referral/start  { code, email } — public.
// Records email → referrer so the payment webhook can auto-credit by email match
// (bulletproof — no typing at Square). Returns the checkout URL to forward to.
export async function POST(req: Request) {
  let body: { code?: string; email?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const code = (body.code || "").toLowerCase().trim();
  const email = (body.email || "").toLowerCase().trim();
  if (!code || !email || !email.includes("@")) return NextResponse.json({ ok: false, error: "need code + email" }, { status: 400 });
  try {
    const snap = await coll("customers").where("referralCode", "==", code).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false, error: "unknown_code" }, { status: 404 });
    const ref = snap.docs[0].data() as { name?: string; referralCode?: string; email?: string };
    // Don't let someone refer themselves.
    if ((ref.email || "").toLowerCase() === email) return NextResponse.json({ ok: true, checkoutUrl: CHECKOUT_URL });
    await coll("pendingReferrals").doc(email).set({
      referrerCode: code,
      referrerName: ref.name || code,
      email,
      at: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ ok: true, checkoutUrl: CHECKOUT_URL });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
