"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

// Birthday-drop banner on the homepage: live countdown to July 27 + live PAID founding
// spots (from /api/founding-count) + the join buttons.
//
// The old $96/12mo seat is RETIRED (2026-07-21) — its Square links and catalog item were
// permanently deleted, so a $96 button here would send buyers to a dead checkout. Founding
// is now $227/yr or $27/mo, both shown regardless of the paid count; the count only drives
// the "spots left" urgency text, never which price is offered.
export default function BirthdayBanner() {
  const target = new Date("2026-07-27T23:59:59-04:00").getTime();
  const [left, setLeft] = useState<number>(target - Date.now());
  const [spots, setSpots] = useState<number | null>(null);
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const t = setInterval(tick, 1000);
    fetch("/api/founding-count")
      .then((r) => r.json())
      .then((j) => {
        if (j && typeof j.count === "number") {
          const s = typeof j.spotsLeft === "number" ? j.spotsLeft : Math.max(0, 100 - j.count);
          setSpots(s);
          setSoldOut(!!j.soldOut || s <= 0);
        }
      })
      .catch(() => {});
    return () => clearInterval(t);
  }, [target]);

  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const cd = left <= 0 ? "It's the 27th 🎂" : `${d}d ${h}h ${m}m ${s}s`;
  const btn = "inline-block px-4 py-2 rounded-lg font-bold text-sm";

  return (
    <div className="mb-6 rounded-xl border border-orange-500/40 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-5 py-4">
      <div className="text-orange-400 font-bold text-xs tracking-widest uppercase">🎂 Bo&apos;s 30th Birthday Drop · ends July 27</div>
      <div className="text-white text-2xl md:text-3xl font-black mt-1 tabular-nums">
        {cd}
        {spots !== null && !soldOut && (
          <span className="text-gray-400 text-base font-semibold"> · {spots} founding spots left</span>
        )}
        {soldOut && left > 0 && <span className="text-gray-400 text-base font-semibold"> · founding full (new pricing after July 27)</span>}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {/* $227/yr — durable quick_pay link (reusable), always the annual founding rate. */}
        <a href={LINKS.foundingYearly} className={btn + " bg-white text-black hover:opacity-90"}>Founding — $227 / year</a>
        {/* $27/mo monthly subscription (through July 27, then $40/mo). Shows once a durable
            REUSABLE link is set in lib/links.ts (foundingMonthly); blank = no button so a
            dead link can't appear. */}
        {LINKS.foundingMonthly && (
          <a href={LINKS.foundingMonthly} className={btn + " bg-white text-black hover:opacity-90"}>Founding — $27 / mo</a>
        )}
        <a href="/resources/rot-july-2026-offers.html" className={btn + " border border-white/30 text-white hover:bg-white/10"}>See the full deal →</a>
      </div>
    </div>
  );
}
