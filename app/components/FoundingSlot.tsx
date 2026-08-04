"use client";
import { useEffect, useState } from "react";

// Checkout URLs come from lib/pricing.ts alongside the prices they charge.
// While one is blank we show the price and route buyers to a coach rather than
// render a button wired to the retired $227/$27 links — those still charge the
// OLD amounts, and a "$375" button that takes $227 is a chargeback waiting.
import { PRICING, CHECKOUT, COACH_FALLBACK } from "@/lib/pricing";

type Count = { spotsLeft?: number; soldOut?: boolean };

export default function FoundingSlot() {
  const [data, setData] = useState<Count | null>(null);

  useEffect(() => {
    fetch("/api/founding-count")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  // Founding closed Jul 27 2026 and sold out (99 cap, 109 paid). Default to CLOSED
  // rather than open: before this, a slow or failed /api/founding-count left the card
  // rendering "Founding slots open" and "Final seat" directly above body copy saying
  // founding is closed. Advertising seats that do not exist is the worse failure.
  const soldOut = data ? !!data.soldOut : true;
  const left = typeof data?.spotsLeft === "number" ? data.spotsLeft : null;
  const seatLine = soldOut
    ? "Founding is full — membership is open at the regular rate."
    : left !== null && left <= 1
    ? "🔥 1 seat left — the very last founding member."
    : left !== null
    ? `🔥 Only ${left} founding seats left before we close.`
    : "Founding slots are open.";

  return (
    <section id="founding" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            {soldOut ? "Founding full" : "Founding slots open"}
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Founder Full Membership</h2>
          <p className="text-gray-400 text-lg">
            One year of full access — the community, the AI tutors, the quiz/study engine
            (Security+, ServiceNow CSA, AWS AI), weekly calls, and job drops.
            {soldOut ? " Founding is closed for this cohort." : " Lock founding pricing before we close the cohort."}
          </p>
        </div>

        <div className="bg-zinc-900 border-2 border-orange-500/40 rounded-3xl p-8 md:p-10 text-center relative">
          {!soldOut && left !== null && left <= 1 && (
            <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
              Final seat
            </div>
          )}

          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-6xl md:text-7xl font-black leading-none">$375</span>
            <span className="text-gray-400 text-xl mb-2">/year</span>
          </div>

          {/* Founding closed Jul 27 2026. Members who bought in keep their rate. */}
          <div className="text-gray-400 text-sm mb-6">
            Founding is closed. Everyone who got in <span className="font-bold text-white">keeps their rate</span>.
          </div>

          <a
            href={CHECKOUT.yearly || COACH_FALLBACK}
            className="inline-block w-full max-w-xs px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg rounded-xl hover:opacity-90 uppercase tracking-wide"
          >
            {CHECKOUT.yearly ? `Join — $${PRICING.yearly}/year →` : "Talk to a coach to join →"}
          </a>

          {/* $40/mo monthly. $27/mo is grandfathered only — never shown or sold. */}
          <div className="mt-4 text-gray-400 text-sm">or go month to month at <b className="text-white">$40/month</b> — cancel anytime</div>
          {CHECKOUT.monthly && (
            <a href={CHECKOUT.monthly} className="inline-block w-full max-w-xs px-8 py-3 mt-2 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl hover:bg-orange-500/10 uppercase tracking-wide">Start — ${PRICING.monthly} / month →</a>
          )}


          <div className="text-orange-300/90 text-sm font-semibold mt-4">{seatLine}</div>
          {/* Founding closed Jul 27 2026 — existing members keep their rate for life. */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/5 border border-white/15 text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full">
            Founding closed — members who locked $227/yr or $27/mo keep it.
          </div>
          <div className="text-gray-500 text-xs mt-2">Secure checkout via Square · instant access</div>
        </div>
      </div>
    </section>
  );
}
