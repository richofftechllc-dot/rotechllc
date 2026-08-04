import Image from "next/image";
import { CERTS, CERT_FROM_PRICE, money } from "@/lib/pricing";

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
// The two cert cards are METAL CARDS — platinum and black, styled in globals.css
// as .rot-metal / .rot-metal-platinum / .rot-metal-onyx. Randy's brief: "make them
// look like platinum amex cards or black cards but that say rich off tech". Each
// carries the RT mark, the issuer line, a chip and a tier badge, and a specular
// highlight travels across the metal on a loop, because a metal card only reads
// as metal when the light moves on it.

type Pkg = {
  name: string;
  blurb: string;
  system: string; // the track's quiz/lesson scope
  price: string;
  href: string;
  cta: string;
  tier: "Platinum" | "Onyx"; // which metal the card is milled from
};

// Prices and URLs both come from CERTS — nothing is retyped here, so a Square
// reprice is one edit in lib/pricing.ts and the whole site follows.
const PACKAGES: Pkg[] = [
  {
    name: CERTS.securityPlus.name,
    blurb: "The cert that opens cleared and commercial security roles.",
    system: "ROT quiz + lesson system (5 Sec+ domains)",
    price: money(CERTS.securityPlus.price),
    href: CERTS.securityPlus.url,
    cta: `Get Security+ — ${money(CERTS.securityPlus.price)} →`,
    tier: "Platinum",
  },
  {
    name: CERTS.csa.name,
    blurb: "The fastest lane into platform and admin work.",
    system: "ROT quiz + lesson system (8 CSA modules)",
    price: money(CERTS.csa.price),
    href: CERTS.csa.url,
    cta: `Get CSA — ${money(CERTS.csa.price)} →`,
    tier: "Onyx",
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
    <div className="bg-rot-surface border border-rot-line p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">{CERTS.discordAccess.name}</h3>
        <p className="text-rot-muted text-sm leading-relaxed">
          <span className="font-bold text-rot-fg">{money(CERTS.discordAccess.price)}</span> for
          12 months — the community, the AI tutors, weekly calls, and job drops. No exam
          voucher, no cert track.
        </p>
      </div>
      {/* Membership IS Discord access, so the $40/mo membership subscription is the
          monthly option — same provisioning ('founding' + General Access) on the bot
          side. Shown as a secondary line rather than a second button so the 12-month
          price stays the headline. */}
      <a
        href={CERTS.discordAccess.url}
        className="rot-btn-ghost shrink-0 px-6 py-3.5 text-sm"
      >
        Get Discord access — {money(CERTS.discordAccess.price)} →
      </a>
    </div>
  );
}

export default function Offers({ showDiscord = true }: { showDiscord?: boolean }) {
  return (
    <section id="offers" className="bg-rot-bg py-24 md:py-32 border-t border-rot-line scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="rot-kicker mb-6">Certifications · from {money(CERT_FROM_PRICE)}</div>
          <h2 className="text-4xl md:text-6xl font-semibold mb-6 leading-[0.98]">Certifications, coached.</h2>
          <p className="text-rot-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Coached packages start at {money(CERT_FROM_PRICE)} — voucher, quiz engine,
            study plan, resume rebuild, and a year in the Discord. We coach any cert you
            can sit online; these two are our best sellers and the two you can buy right
            now.
          </p>
        </div>

        {/* The two tracks as metal charge cards. The plain white cards these
            replaced described the same package but signalled nothing about the
            tier of the thing; a platinum and a black card say "this is the
            serious purchase" before a word is read.

            gap-8 rather than the old gap-px seam: these are objects sitting on
            the marble, not two halves of one table. */}
        <div className="grid md:grid-cols-2 gap-8">
          {PACKAGES.map((p) => {
            const onyx = p.tier === "Onyx";
            return (
              <div
                key={p.name}
                className={`rot-metal ${onyx ? "rot-metal-onyx" : "rot-metal-platinum"} p-8 md:p-10 flex flex-col`}
              >
                {/* Issuer row — the mark and the company, as embossed on a real
                    card. Ink mark on platinum, white on onyx. */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={onyx ? "/rot-mark.png" : "/rot-mark-ink.png"}
                      alt=""
                      width={26}
                      height={24}
                      className="w-[26px] h-auto"
                    />
                    <span className="rot-metal-issuer">Rich Off Tech</span>
                  </div>
                  <span className="rot-metal-tier">{p.tier}</span>
                </div>

                <div className="rot-metal-chip mb-8" aria-hidden />

                <h3 className="text-2xl md:text-3xl font-semibold mb-3">{p.name}</h3>
                <p className={`text-sm mb-8 leading-relaxed ${onyx ? "rot-onyx-muted" : "text-rot-muted"}`}>
                  {p.blurb}
                </p>

                <div
                  className={`flex items-end gap-3 mb-8 pb-8 border-b ${onyx ? "border-rot-onyx-line" : "border-rot-line"}`}
                >
                  <span className="text-5xl md:text-6xl font-semibold leading-none tracking-tight">{p.price}</span>
                </div>

                <ul className={`space-y-3 mb-10 text-sm ${onyx ? "rot-onyx-muted" : "text-rot-muted"}`}>
                  {included(p.system).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className={`shrink-0 ${onyx ? "text-rot-accent-2" : "text-rot-faint"}`}>—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* mt-auto keeps both buttons on the same baseline when the lists differ in height */}
                <a
                  href={p.href}
                  className="rot-btn-accent mt-auto w-full px-6 py-4 text-sm"
                >
                  {p.cta}
                </a>
              </div>
            );
          })}
        </div>

        {showDiscord && <div className="mt-px"><DiscordAccessCard /></div>}

        <p className="text-center mt-12">
          <a href="/certifications" className="text-sm text-rot-fg underline underline-offset-4 decoration-rot-line-strong hover:decoration-rot-fg">
            Network+, PMP, CASP+, CySA+, CISSP and the rest — see every cert we coach →
          </a>
        </p>
        <p className="text-rot-faint text-xs text-center mt-4">
          Afterpay available at checkout.
        </p>
      </div>
    </section>
  );
}
