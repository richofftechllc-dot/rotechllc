"use client";
import { useEffect, useState } from "react";
import { LINKS } from "@/lib/links";
import { DEAL_WINDOW_LABEL } from "@/lib/deal";

// BIRTHDAY DROP — Bo's 30th, live July 26–27, 2026.
// $727 promo rate ($777.89 with Square's service fee) for a full cert package, plus a
// Discord-only add-on at $100/12mo. Checkout links live in lib/links.ts; the bot's
// squareProducts docs map the matching Square catalog ids so payment auto-provisions
// the track + 12 months of Discord and fires the birthday-drop welcome email.
//
// Styling deliberately mirrors FoundingSlot (zinc-900 card, orange border, black section)
// so the drop reads as part of the same offer stack.

type Pkg = {
  name: string;
  blurb: string;
  system: string; // the track's quiz/lesson scope
  regular: string; // the normal Essential-tier price, shown struck through
  href: string;
  cta: string;
};

// `regular` mirrors the "Regular" column on the July 2026 offer sheet
// (public/resources/rot-july-2026-offers.html) so the anchor price is the same
// number everywhere: Security+ Essential $1,500, CSA Essential $1,600. These
// birthday packages are the Essential tier (voucher + coaching + study plan).
const PACKAGES: Pkg[] = [
  {
    name: "CompTIA Security+",
    blurb: "The cert that opens cleared and commercial security roles.",
    system: "ROT quiz + lesson system (5 Sec+ domains)",
    regular: "$1,500",
    href: LINKS.bdaySecPlus,
    cta: "Get Security+ — $727 →",
  },
  {
    name: "ServiceNow CSA",
    blurb: "The fastest lane into platform and admin work.",
    system: "ROT quiz + lesson system (8 CSA modules)",
    regular: "$1,600",
    href: LINKS.bdayCsa,
    cta: "Get CSA — $727 →",
  },
];

// Shared across both cards — only the quiz/lesson line differs per track.
function included(system: string): string[] {
  return [
    "Exam voucher",
    system,
    "30/60/90-day study plan",
    "30-min 1-on-1",
    "Resume rebuild in ROT format",
    "12 months ROT Discord",
  ];
}

export default function BirthdayDrop() {
  // Window label follows the CRM-extendable deadline (GET /api/deal). Falls back to the
  // compiled-in label so the footer line is never blank.
  const [windowLabel, setWindowLabel] = useState(DEAL_WINDOW_LABEL);
  useEffect(() => {
    fetch("/api/deal")
      .then((r) => r.json())
      .then((j) => { if (j?.endLabel) setWindowLabel(`July 26\u2013${String(j.endLabel).replace(/^\w+ /, "")}, 2026`); })
      .catch(() => {});
  }, []);

  return (
    <section id="bday" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 text-orange-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide">
            Birthday drop
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            BIRTHDAY DROP — Bo turns 30. This week, you eat.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className="bg-zinc-900 border-2 border-orange-500/40 rounded-3xl p-8 flex flex-col"
            >
              <h3 className="text-2xl font-black mb-2">{p.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{p.blurb}</p>

              <div className="flex items-end gap-3 mb-1">
                <span className="text-5xl md:text-6xl font-black leading-none">$727</span>
                <span className="text-gray-500 text-2xl line-through mb-1">{p.regular}</span>
              </div>
              <div className="text-gray-400 text-sm mb-6">
                Promo rate — normally <span className="line-through">{p.regular}</span>.{" "}
                <span className="font-bold text-white">$777.89</span> total with service fee.
              </div>

              <ul className="space-y-2 mb-8 text-sm text-gray-300">
                {included(p.system).map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-orange-400 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* mt-auto keeps both buttons on the same baseline when the lists differ in height */}
              <a
                href={p.href}
                className="mt-auto block text-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:opacity-90 uppercase tracking-wide"
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Discord-only add-on — smaller card, no cert track attached. */}
        <div className="mt-6 bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold mb-1">ROT Discord Access</h3>
            <p className="text-gray-400 text-sm">
              <span className="font-bold text-white">$100</span> for 12 months{" "}
              <span className="line-through">$227</span> — the community, the AI tutors, weekly
              calls, and job drops.
            </p>
          </div>
          <a
            href={LINKS.bdayDiscord}
            className="shrink-0 text-center px-6 py-3 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl hover:bg-orange-500/10 uppercase tracking-wide"
          >
            Get Discord access — $100 →
          </a>
        </div>

        <p className="text-gray-500 text-sm text-center mt-8">
          Live {windowLabel}. Afterpay available at checkout.
        </p>
      </div>
    </section>
  );
}
