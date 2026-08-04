import InterestedCapture from "./InterestedCapture";
import { CERTS, PRICING, money } from "@/lib/pricing";

// THE FORK — the first thing on the home page, above the hero.
//
// Randy's framing: everybody is one of two things. INTERESTED people should get
// real value for free — join the Discord, read the site, take the guides — and
// nobody should be shamed for sitting there. COMMITTED is who he actually works
// with, and it costs money.
//
// Both sides are a genuine offer. The interested column is not a paywall teaser
// with the value removed; those study plans and the FAQ are the same documents a
// paying member gets pointed at. The honesty is the conversion mechanism.
//
// Prices come from lib/pricing.ts. Nothing is retyped here.

// The free docs that already exist in public/resources. Linked, never duplicated.
const FREE_RESOURCES: Array<{ label: string; href: string }> = [
  { label: "Security+ study plan", href: "/resources/rot-secplus-study-plan.html" },
  { label: "ServiceNow CSA study plan", href: "/resources/rot-csa-study-plan.html" },
  { label: "AWS AI study plan", href: "/resources/rot-aws-ai-study-plan.html" },
  { label: "FAQ", href: "/resources/rot-faq.html" },
  { label: "How it works", href: "/resources/rot-how-it-works.html" },
];

export default function CommittedOrInterested() {
  return (
    <section id="start" className="bg-black border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">START HERE</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Are you <span className="text-gray-500">interested</span>,<br className="sm:hidden" />{" "}
            or are you <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">committed</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Both are fine. They just get different things. Pick the one that&apos;s
            actually true today — you can change your mind later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* ── INTERESTED ─────────────────────────────────────────────── */}
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 flex flex-col">
            <div className="text-gray-400 font-bold tracking-widest text-xs mb-3 uppercase">Interested</div>
            <h3 className="text-2xl md:text-3xl font-black mb-3">Look around. For real.</h3>
            <p className="text-gray-400 mb-6">
              You&apos;re curious, you&apos;re researching, you&apos;re not ready to spend
              money. Good — don&apos;t. Come in free, read everything, ask questions,
              and take the study plans with you whether you ever pay us or not.
            </p>

            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">✓</span><span>The Discord, free — including the daily tech-intel channels</span></li>
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">✓</span><span>Every study plan and guide below, no card</span></li>
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">✓</span><span>Read the whole site — real member results, the roster, what we charge</span></li>
            </ul>

            <div className="flex flex-wrap gap-2 mb-6">
              {FREE_RESOURCES.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  className="text-xs px-3 py-2 border border-white/15 rounded-lg text-gray-300 hover:border-white/40 hover:text-white transition"
                >
                  {r.label} ↗
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href="https://discord.gg/dtcYf8PTNa"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-white/25 rounded-lg font-bold hover:bg-white/5"
              >
                Join the Discord — Free
              </a>
              <a href="/about" className="px-5 py-3 border border-white/15 rounded-lg text-gray-300 hover:bg-white/5">
                Read our story
              </a>
              <a href="/certifications" className="px-5 py-3 border border-white/15 rounded-lg text-gray-300 hover:bg-white/5">
                See what we offer
              </a>
            </div>

            {/* mt-auto pins the capture to the bottom so both columns end level */}
            <div className="mt-auto">
              <InterestedCapture />
            </div>
          </div>

          {/* ── COMMITTED ──────────────────────────────────────────────── */}
          <div className="bg-zinc-900 border-2 border-orange-500/50 rounded-3xl p-8 flex flex-col relative">
            <div className="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full">
              Who Bo works with
            </div>
            <div className="text-orange-500 font-bold tracking-widest text-xs mb-3 uppercase">Committed</div>
            <h3 className="text-2xl md:text-3xl font-black mb-3">You&apos;re changing your life.</h3>
            <p className="text-gray-400 mb-6">
              You&apos;ve decided. You want the cert, the clearance path, the job — and
              you want somebody in it with you until you get there. This is the side
              that costs money, and it&apos;s the side we actually coach.
            </p>

            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>A coach who knows your name and your exam date</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>Your exam voucher and a 30/60/90-day plan built around your life</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>Resume rebuilt in ROT format, and the recruiter roster</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span><b className="text-white">Guaranteed pass</b> — we keep coaching you until you do</span></li>
            </ul>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between py-1"><span className="text-gray-400">Membership</span><span className="font-bold">{money(PRICING.yearly)}/yr · {money(PRICING.monthly)}/mo</span></div>
              <div className="flex justify-between py-1 border-t border-white/5"><span className="text-gray-400">{CERTS.securityPlus.name}</span><span className="font-bold">{money(CERTS.securityPlus.price)}</span></div>
              <div className="flex justify-between py-1 border-t border-white/5"><span className="text-gray-400">{CERTS.csa.name}</span><span className="font-bold">{money(CERTS.csa.price)}</span></div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <a
                href="/membership"
                className="block text-center px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:opacity-90 uppercase tracking-wide"
              >
                I&apos;m committed — start here →
              </a>
              <a href="/help#agents" className="block text-center px-6 py-3 border border-orange-500/40 text-orange-300 font-bold rounded-xl hover:bg-orange-500/10">
                Not sure which track? Talk to an agent — free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
