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
    <section id="founding" className="bg-rot-sunken py-24 md:py-32 border-t border-rot-line scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="rot-kicker mb-6">
            {soldOut ? "Founding full" : "Founding slots open"}
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 leading-[0.98]">Founder Full Membership</h2>
          <p className="text-rot-muted text-lg leading-relaxed">
            One year of full access — the community, the AI tutors, the quiz/study engine
            (Security+, ServiceNow CSA, AWS AI), weekly calls, and job drops.
            {soldOut ? " Founding is closed for this cohort." : " Lock founding pricing before we close the cohort."}
          </p>
        </div>

        <div className="bg-rot-surface border border-rot-line p-10 md:p-14 text-center relative">
          {!soldOut && left !== null && left <= 1 && (
            <div className="absolute top-6 right-6 rot-kicker text-rot-accent">
              Final seat
            </div>
          )}

          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-6xl md:text-8xl font-semibold leading-none tracking-tight">$375</span>
            <span className="text-rot-muted text-xl mb-3">/year</span>
          </div>

          {/* Founding closed Jul 27 2026. Members who bought in keep their rate. */}
          <div className="text-rot-muted text-sm mb-8">
            Founding is closed. Everyone who got in <span className="font-bold text-rot-fg">keeps their rate</span>.
          </div>

          <a
            href={CHECKOUT.yearly || COACH_FALLBACK}
            className="rot-btn-accent w-full max-w-xs px-8 py-4 text-sm"
          >
            {CHECKOUT.yearly ? `Join — $${PRICING.yearly}/year →` : "Talk to a coach to join →"}
          </a>

          {/* $40/mo monthly. $27/mo is grandfathered only — never shown or sold. */}
          <div className="mt-6 text-rot-muted text-sm">or go month to month at <b className="text-rot-fg">$40/month</b> — cancel anytime</div>
          {CHECKOUT.monthly && (
            <a href={CHECKOUT.monthly} className="rot-btn-ghost w-full max-w-xs px-8 py-3.5 mt-3 text-sm">Start — ${PRICING.monthly} / month →</a>
          )}


          <div className="text-rot-muted text-sm mt-6">{seatLine}</div>
          {/* Founding closed Jul 27 2026 — existing members keep their rate for life. */}
          <div className="mt-4 inline-flex items-center gap-2 border border-rot-line text-rot-faint text-xs px-3 py-1.5">
            Founding closed — members who locked $227/yr or $27/mo keep it.
          </div>
          <div className="text-rot-faint text-xs mt-4">Secure checkout via Square · instant access</div>
        </div>
      </div>
    </section>
  );
}
