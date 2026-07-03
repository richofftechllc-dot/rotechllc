"use client";
import { useEffect, useState } from "react";

// Birthday-drop banner: live countdown to July 27, 2026 (Bo's 30th) + live founding
// spots left (from /api/member-count). Links to the July offer sheet.
export default function BirthdayBanner() {
  const target = new Date("2026-07-27T23:59:59-04:00").getTime();
  const [left, setLeft] = useState<number>(target - Date.now());
  const [spots, setSpots] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const t = setInterval(tick, 1000);
    fetch("/api/founding-count")
      .then((r) => r.json())
      .then((j) => {
        if (j && typeof j.count === "number") {
          setSpots(typeof j.spotsLeft === "number" ? j.spotsLeft : Math.max(0, 100 - j.count));
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

  return (
    <a
      href="/resources/rot-july-2026-offers.html"
      className="block mb-6 rounded-xl border border-orange-500/40 bg-gradient-to-r from-orange-500/10 to-red-500/10 px-5 py-4 hover:border-orange-500/70 transition-colors"
    >
      <div className="text-orange-400 font-bold text-xs tracking-widest uppercase">🎂 Bo&apos;s 30th Birthday Drop · ends July 27</div>
      <div className="text-white text-2xl md:text-3xl font-black mt-1 tabular-nums">
        {cd}
        {spots !== null && (
          <span className="text-gray-400 text-base font-semibold"> · {spots} founding spots left</span>
        )}
      </div>
      <div className="text-gray-300 text-sm mt-1">$27 = your first 2 months → then $27/mo · certs up to $650 off · <span className="text-orange-400 font-semibold">tap to see the deal →</span></div>
    </a>
  );
}
