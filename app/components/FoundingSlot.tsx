"use client";
import { useEffect, useState } from "react";

// $227/yr founding checkout — the CURRENT annual rate.
// DURABLE quick_pay link (reusable — every buyer gets a fresh order, never dies).
// Do NOT swap this for an `order`-based square.link; those are single-use and bounce
// to /welcome after the first payment.
//
// The old $96/yr seat is RETIRED (2026-07-21): its Square payment links and catalog
// item were permanently deleted, so any $96 URL is now dead. Do not reintroduce a $96
// price here — there is nothing left in Square to charge against it.
const CHECKOUT_227 = "https://square.link/u/c8X7TC0z";
// $27/mo founding subscription — a monthly option available through July 27 (then $40/mo).
// Points at our own route that mints a FRESH Square subscription link per click; a raw
// square.link subscription link binds to its first buyer and freezes on that buyer's
// confirmation forever. See app/api/checkout/monthly/route.ts.
const CHECKOUT_27 = "/api/checkout/monthly";

type Count = { spotsLeft?: number; soldOut?: boolean };

export default function FoundingSlot() {
  const [data, setData] = useState<Count | null>(null);

  useEffect(() => {
    fetch("/api/founding-count")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const soldOut = !!data?.soldOut;
  const left = typeof data?.spotsLeft === "number" ? data.spotsLeft : null;
  // Founding is capped at 100 seats. The count still drives urgency copy, but it no
  // longer switches the PRICE — $227/yr is the founding rate either way.
  const seatLine = soldOut
    ? "Founding is full — join the waitlist for the next cohort."
    : left === null
    ? "Founding slots are open."
    : left <= 1
    ? "🔥 1 seat left — the very last founding member."
    : `🔥 Only ${left} founding seats left before we close.`;

  return (
    <section id="founding" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            {soldOut ? "Founding full" : "Founding slots open"}
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Founding Membership</h2>
          <p className="text-gray-400 text-lg">
            One year of full access — the community, the AI tutors, the quiz/study engine
            (Security+, ServiceNow CSA, AWS AI), weekly calls, and job drops.
            {soldOut ? " Founding is closed for this cohort." : " Lock founding pricing before we close the cohort."}
          </p>
        </div>

        <div className="bg-zinc-900 border-2 border-orange-500/40 rounded-3xl p-8 md:p-10 text-center relative">
          {!soldOut && (
            <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
              Final seat
            </div>
          )}

          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-6xl md:text-7xl font-black leading-none">$227</span>
            <span className="text-gray-400 text-xl mb-2">/year</span>
          </div>

          {/* $375/yr is the post-founding rate — the anchor that makes $227 the deal. */}
          <div className="text-gray-400 text-sm mb-6">
            Founding rate — <span className="font-bold text-white">$375/year</span> once founding closes.
          </div>

          <a
            href={CHECKOUT_227}
            className="inline-block w-full max-w-xs px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg rounded-xl hover:opacity-90 uppercase tracking-wide"
          >
            Join founding — $227/year →
          </a>

          {/* $27/mo — monthly option, available alongside the yearly through July 27. */}
          <div className="mt-4 text-gray-400 text-sm">or lock <b className="text-white">$27/month</b> — first 2 months for $27, then $27/mo while active</div>
          <a href={CHECKOUT_27} className="inline-block w-full max-w-xs px-8 py-3 mt-2 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl hover:bg-orange-500/10 uppercase tracking-wide">Lock $27 / month →</a>
          {/* Square's checkout shows an "ends Aug 15" note for the 2-for-$27 promo window —
              the membership actually renews at $27/mo after. Set expectations up front. */}
          <div className="mt-2 text-gray-500 text-xs max-w-xs mx-auto">Heads up: checkout shows an “ends” date — that’s just the 2-for-$27 promo window. Your membership renews at <b className="text-gray-300">$27/mo</b> after, cancel anytime.</div>

          <div className="text-orange-300/90 text-sm font-semibold mt-4">{seatLine}</div>
          {/* July 27 deadline — both the $227/yr and the $27/mo deal expire then; prices rise after. */}
          <div className="mt-3 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1.5 rounded-full">
            ⏳ $227/year &amp; the $27/mo deal are good only through July 27 — new pricing after.
          </div>
          <div className="text-gray-500 text-xs mt-2">Secure checkout via Square · instant access</div>
        </div>
      </div>
    </section>
  );
}
