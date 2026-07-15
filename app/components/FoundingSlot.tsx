"use client";
import { useEffect, useState } from "react";

// $96/yr founding checkout (annual). The $227 shown underneath is the NEXT price —
// this is intentionally the last seat at $96; once founding closes it becomes $227.
// DURABLE quick_pay link (reusable — every buyer gets a fresh order, never dies).
// Do NOT swap this for an `order`-based square.link; those are single-use and bounce
// to /welcome after the first payment.
const CHECKOUT_96 = "https://square.link/u/7r9pO4c0";
// $227/yr durable quick_pay link — the price once founding ($96) is sold out.
const CHECKOUT_227 = "https://square.link/u/c8X7TC0z";
// $27/mo founding subscription (durable, reusable) — a monthly option available through
// July 27 (then $40/mo). Not tied to the first-100 seat, so it stays live after sellout.
const CHECKOUT_27 = "https://square.link/u/XlN3ZFcU";

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
  const seatLine = soldOut
    ? "The last $96 seat is gone — founding is now $227/year."
    : left === null
    ? "The final founding slot is open."
    : left <= 1
    ? "🔥 1 seat left — the very last founding member."
    : `🔥 Final slots — only ${left} left before founding closes.`;

  return (
    <section id="founding" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            {soldOut ? "Founding full — now $227/year" : "Last founding slot open"}
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Founding Membership</h2>
          <p className="text-gray-400 text-lg">
            One year of full access — the community, the AI tutors, the quiz/study engine
            (Security+, ServiceNow CSA, AWS AI), weekly calls, and job drops.
            {soldOut ? " The $96 founding seats are gone — this is the current rate." : " Lock founding pricing before the seat is gone."}
          </p>
        </div>

        <div className="bg-zinc-900 border-2 border-orange-500/40 rounded-3xl p-8 md:p-10 text-center relative">
          {!soldOut && (
            <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
              Final seat
            </div>
          )}

          {/* Sold out: keep the $96 VISIBLE (struck through, not clickable) so the anchor
              price is known, and make $227 the live rate. */}
          {soldOut && (
            <div className="text-gray-500 text-lg md:text-xl mb-1 select-none" aria-disabled="true">
              <span className="line-through">$96/year founding</span>{" "}
              <span className="text-red-400 font-bold uppercase text-xs tracking-wide align-middle">· Sold out</span>
            </div>
          )}
          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-6xl md:text-7xl font-black leading-none">{soldOut ? "$227" : "$96"}</span>
            <span className="text-gray-400 text-xl mb-2">/year</span>
          </div>

          {/* Not sold out: tease the $227 next price under the $96. Sold out: $96 is gone. */}
          <div className="text-gray-400 text-sm mb-6">
            {soldOut ? (
              <>The $96 founding seats are <span className="font-bold text-white">gone</span> — $227/year is the founding rate now.</>
            ) : (
              <>Going to <span className="font-bold text-white">$227/year</span> next — this is the last seat at $96.</>
            )}
          </div>

          <a
            href={soldOut ? CHECKOUT_227 : CHECKOUT_96}
            className="inline-block w-full max-w-xs px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-lg rounded-xl hover:opacity-90 uppercase tracking-wide"
          >
            {soldOut ? "Join founding — $227/year →" : "Claim the last slot — $96 →"}
          </a>

          {/* $27/mo — monthly option, available alongside the yearly through July 27. */}
          <div className="mt-4 text-gray-400 text-sm">or lock <b className="text-white">$27/month</b> — first 2 months for $27, then $27/mo while active</div>
          <a href={CHECKOUT_27} className="inline-block w-full max-w-xs px-8 py-3 mt-2 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl hover:bg-orange-500/10 uppercase tracking-wide">Lock $27 / month →</a>

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
