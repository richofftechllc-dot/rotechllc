import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Referral PAYOUT LEDGER (Firestore `referralPayouts`).
// Each doc = one recorded payout to a referrer: { referrer, amount (cents-free dollars),
// method: 'cash'|'credit', at, by }. The CRM Referrals rollup subtracts the sum of a
// referrer's payouts from what they're OWED, so the $500 cash cap is actually enforced
// (not just displayed) and a referrer is never paid twice for the same cleared referrals.

type Payout = { referrer: string; amount: number; method: "cash" | "credit"; at: string; by: string };

// GET → all payout records (the client groups + sums per referrer).
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("referralPayouts").get();
    const payouts = snap.docs.map((d) => {
      const x = d.data() as Partial<Payout>;
      return {
        id: d.id,
        referrer: String(x.referrer || ""),
        amount: typeof x.amount === "number" ? x.amount : 0,
        method: x.method === "credit" ? "credit" : "cash",
        at: String(x.at || ""),
        by: String(x.by || ""),
      };
    });
    return NextResponse.json({ ok: true, payouts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST { referrer, amount, method } → record a payout. amount is in whole dollars.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { referrer?: string; amount?: number; method?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const referrer = String(body.referrer || "").trim();
  const amount = Math.max(0, Math.min(100000, Number(body.amount) || 0));
  const method = body.method === "credit" ? "credit" : "cash";
  if (!referrer) return NextResponse.json({ ok: false, error: "referrer required" }, { status: 400 });
  if (!amount) return NextResponse.json({ ok: false, error: "amount required" }, { status: 400 });
  try {
    const ref = await coll("referralPayouts").add({
      referrer, amount, method, at: new Date().toISOString(), by: admin.name,
    });
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
