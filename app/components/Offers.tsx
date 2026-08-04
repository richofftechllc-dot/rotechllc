import { LINKS } from "@/lib/links";

// OFFERS — the paid cert tracks and the Discord-only add-on, at regular rates.
//
// This was BirthdayDrop.tsx. The July drop closed Jul 27 2026 and the Square catalog
// was repriced IN PLACE, so the same checkout links now charge the regular amounts:
// Security+ $1,500, ServiceNow CSA $1,600, Discord Access $375/12mo. Nothing here is
// framed as a discount any more — there is no struck-through anchor price and no
// deadline, because quoting a promo that has ended is how you get a chargeback.
//
// No longer a client component: the only reason it was one was the /api/deal fetch
// that drove the promo countdown, and there is no countdown to drive.
//
// Styling deliberately mirrors FoundingSlot (zinc-900 card, orange border, black
// section) so the offers read as part of the same stack.

type Pkg = {
  name: string;
  blurb: string;
  system: string; // the track's quiz/lesson scope
  price: string;
  href: string;
  cta: string;
};

const PACKAGES: Pkg[] = [
  {
    name: "CompTIA Security+",
    blurb: "The cert that opens cleared and commercial security roles.",
    system: "ROT quiz + lesson system (5 Sec+ domains)",
    price: "$1,500",
    href: LINKS.certSecPlus,
    cta: "Get Security+ — $1,500 →",
  },
  {
    name: "ServiceNow CSA",
    blurb: "The fastest lane into platform and admin work.",
    system: "ROT quiz + lesson system (8 CSA modules)",
    price: "$1,600",
    href: LINKS.certCsa,
    cta: "Get CSA — $1,600 →",
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

/** Discord-only add-on. Exported so /membership can show it next to the membership card. */
export function DiscordAccessCard() {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold mb-1">ROT Discord Access</h3>
        <p className="text-gray-400 text-sm">
          <span className="font-bold text-white">$375</span> for 12 months — the community,
          the AI tutors, weekly calls, and job drops. No exam voucher, no cert track.
        </p>
      </div>
      {/* A $40/mo Discord option is pending: no Square subscription plan exists for this
          product yet, so there is deliberately no monthly button here. Do not point one
          at CHECKOUT.monthly — that link is the MEMBERSHIP subscription, not this. */}
      <a
        href={LINKS.discordAccess}
        className="shrink-0 text-center px-6 py-3 border border-orange-500/50 text-orange-300 font-bold text-sm rounded-xl hover:bg-orange-500/10 uppercase tracking-wide"
      >
        Get Discord access — $375 →
      </a>
    </div>
  );
}

export default function Offers({ showDiscord = true }: { showDiscord?: boolean }) {
  return (
    <section id="offers" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">OFFERS</div>
          <h2 className="text-4xl md:text-5xl font-black mb-3">Pick your cert. We coach you till you pass.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Voucher, quiz engine, study plan, resume rebuild, and a year in the Discord —
            one price, no upsells.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className="bg-zinc-900 border-2 border-orange-500/40 rounded-3xl p-8 flex flex-col"
            >
              <h3 className="text-2xl font-black mb-2">{p.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{p.blurb}</p>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl md:text-6xl font-black leading-none">{p.price}</span>
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

        {showDiscord && <div className="mt-6"><DiscordAccessCard /></div>}

        <p className="text-gray-500 text-sm text-center mt-8">
          Afterpay available at checkout.
        </p>
      </div>
    </section>
  );
}
