"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";

// Birthday-drop banner on the homepage: live countdown to July 27 + live PAID founding
// spots (from /api/founding-count) + the join buttons.
// RULE: $96/12mo and $27/mo (2-for-$27) are ONLY available while under 100 members.
// The instant the paid count hits 100 (soldOut), those buttons disappear and it flips
// to the yearly ($227) offer — so the front page can never show a closed deal.
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
        {soldOut && left > 0 && <span className="text-gray-400 text-base font-semibold"> · founding full — $227/yr now (new pricing after July 27)</span>}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {/* $96 founding closes at 100 members. DURABLE quick_pay link (reusable). */}
        {!soldOut && (
          <a href="https://square.link/u/7r9pO4c0" className={btn + " bg-white text-black hover:opacity-90"}>Founding — $96 / 12 months</a>
        )}
        {/* $96 sold out → the durable $227/yr link takes over. */}
        {soldOut && (
          <a href="https://square.link/u/c8X7TC0z" className={btn + " bg-white text-black hover:opacity-90"}>Founding — $227 / year</a>
        )}
        {/* $27/mo: shows ONLY once a durable REUSABLE subscription link is set in
            lib/links.ts (foundingMonthly). Blank = no button, so a dead link can't appear.
            Gated to !soldOut like the $96 button. */}
        {!soldOut && LINKS.foundingMonthly && (
          <a href={LINKS.foundingMonthly} className={btn + " bg-white text-black hover:opacity-90"}>Founding — $27 / mo</a>
        )}
        <a href="/resources/rot-july-2026-offers.html" className={btn + " border border-white/30 text-white hover:bg-white/10"}>See the full deal →</a>
      </div>
    </div>
  );
}
