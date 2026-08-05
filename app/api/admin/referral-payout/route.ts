import { NextResponse } from "next/server";
import { coll, db } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Referral PAYOUT LEDGER (Firestore `referralPayouts`).
// Each doc = one recorded payout to a referrer: { referrer, amount (whole dollars),
// method: 'cash'|'credit', at, by }.
//
// THE CAP IS ENFORCED HERE, IN A TRANSACTION — and it genuinely was not before.
// This file used to claim in its own header that the $500 cash cap was "actually
// enforced (not just displayed)". It wasn't: POST clamped the amount to $100,000
// and wrote it. Nothing read the existing ledger, so recording $500 twice paid
// somebody $1,000, and recording cash after they'd already taken store credit
// paid them for a balance that was supposed to be closed. The Referrals tab
// subtracted payouts for DISPLAY, which is not enforcement — the display is
// exactly the layer an admin can fat-finger past.
//
// Enforcement has to be server-side and transactional because the failure mode is
// concurrent: two tabs open on the same referrer, both showing "$500 remaining",
// both recording. Reading the ledger inside the transaction makes the second one
// fail instead of double-paying a real person real money.

const CAP_PER_PERSON = 500; // cash cap; the alternative is $1,000 store credit

type Payout = { referrer: string; amount: number; method: "cash" | "credit"; at: string; by: string };

/** Tier rate, mirroring the CRM rollup and the bot's notifyReferrer().
 *  Tier 1 = the first 100 paid founders; Tier 2 = joined after 2026-07-06.
 *  These three places must agree — see the note in app/admin/page.tsx. */
const rateFor = (foundingTier: unknown) => (foundingTier === 2 ? 25 : 50);

/** What this referrer has actually earned: cleared referrals x their tier rate,
 *  capped. "Cleared" = active or comp — a refunded/churned referral flips status
 *  and drops out, so we never pay on money that was given back. */
function owedFor(referrer: string, customers: FirebaseFirestore.QueryDocumentSnapshot[]) {
  const key = referrer.trim().toLowerCase();
  const referrerDoc = customers.find(
    (d) => String(d.get("referralCode") || "").toLowerCase() === key,
  );
  const rate = rateFor(referrerDoc?.get("foundingTier"));
  const cleared = customers.filter((d) => {
    if (String(d.get("referredBy") || "").trim().toLowerCase() !== key) return false;
    const st = String(d.get("paymentStatus") || "");
    return st === "active" || st === "comp";
  }).length;
  const gross = cleared * rate;
  return { rate, cleared, gross, owed: Math.min(gross, CAP_PER_PERSON) };
}

// GET → all payout records (the client groups + sums per referrer).
export async function GET(req: Request) {
  const authed = await getAuthedAdmin(req);
  if (!authed) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
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

// POST { referrer, amount, method } → record a payout, in whole dollars.
// Rejects rather than silently clamping: if the number an admin typed is not the
// number that can be paid, they need to see that before they send the money, not
// discover a quietly reduced record afterwards.
export async function POST(req: Request) {
  const authed = await getAuthedAdmin(req);
  if (!authed) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { referrer?: string; amount?: number; method?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const referrer = String(body.referrer || "").trim();
  const amount = Math.round(Number(body.amount) || 0);
  const method = body.method === "credit" ? "credit" : "cash";
  if (!referrer) return NextResponse.json({ ok: false, error: "referrer required" }, { status: 400 });
  if (amount <= 0) return NextResponse.json({ ok: false, error: "amount required" }, { status: 400 });

  try {
    const result = await db.runTransaction(async (tx) => {
      // All reads first — Firestore requires it, and doing them inside the
      // transaction is what makes two concurrent recordings collide instead of
      // both succeeding.
      const [ledgerSnap, customerSnap] = await Promise.all([
        tx.get(coll("referralPayouts").where("referrer", "==", referrer)),
        tx.get(coll("customers")),
      ]);

      let cashPaid = 0;
      let creditTaken = false;
      ledgerSnap.docs.forEach((d) => {
        if (d.get("method") === "credit") creditTaken = true;
        else cashPaid += Number(d.get("amount")) || 0;
      });

      const { rate, cleared, owed } = owedFor(referrer, customerSnap.docs);

      // Store credit closes the whole balance. Anything after it is a double-pay.
      if (creditTaken) {
        return { blocked: "credit_settled" as const, owed, cashPaid, rate, cleared, remaining: 0 };
      }
      if (method === "credit") {
        // Credit settles a balance, so there has to BE one. Without this a
        // credit record could be written against a referrer who has cleared
        // nothing, permanently closing a balance they never earned.
        if (owed <= 0) {
          return { blocked: "nothing_owed" as const, owed, cashPaid, rate, cleared, remaining: 0 };
        }
        // One credit record settles the referrer; only allowed if cash hasn't
        // already been drawn against the same balance.
        if (cashPaid > 0) {
          return { blocked: "cash_already_paid" as const, owed, cashPaid, rate, cleared, remaining: Math.max(0, owed - cashPaid) };
        }
      } else {
        const remaining = Math.max(0, owed - cashPaid);
        if (remaining <= 0) {
          return { blocked: "nothing_owed" as const, owed, cashPaid, rate, cleared, remaining };
        }
        if (amount > remaining) {
          return { blocked: "over_remaining" as const, owed, cashPaid, rate, cleared, remaining };
        }
      }

      const ref = coll("referralPayouts").doc();
      tx.set(ref, {
        referrer,
        amount,
        method,
        at: new Date().toISOString(),
        by: authed.name,
        // Snapshot what the balance looked like when this was recorded, so a
        // later audit can tell whether a rate or a referral count changed after
        // the fact rather than having to guess.
        owedAtPayout: owed,
        rateAtPayout: rate,
        clearedAtPayout: cleared,
      });
      return { id: ref.id, owed, cashPaid: cashPaid + (method === "cash" ? amount : 0), rate, cleared, remaining: Math.max(0, owed - cashPaid - (method === "cash" ? amount : 0)) };
    });

    if ("blocked" in result && result.blocked) {
      const messages: Record<string, string> = {
        credit_settled: "Already settled with store credit — that balance is closed.",
        cash_already_paid: `Cash of $${result.cashPaid} was already paid against this balance. Store credit settles the whole balance, so it can't be combined.`,
        nothing_owed: `Nothing outstanding — $${result.cashPaid} already paid against $${result.owed} owed.`,
        over_remaining: `Only $${result.remaining} remaining ($${result.owed} owed, $${result.cashPaid} already paid). Record $${result.remaining} or less.`,
      };
      return NextResponse.json(
        { ok: false, error: messages[result.blocked], reason: result.blocked, ...result },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
