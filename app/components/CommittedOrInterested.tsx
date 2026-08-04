import InterestedCapture from "./InterestedCapture";
import { PRICING, money } from "@/lib/pricing";

// THE FORK — the first thing on the home page, above the hero.
//
// Randy's framing: everybody is one of two things. INTERESTED people should get
// real value for free — join the Discord, read the site, take the guides — and
// nobody should be shamed for sitting there. COMMITTED is who he actually works
// with, and it costs money.
//
// Both sides are a genuine offer. The interested column is not a paywall teaser —
// the AWS AI plan, the FAQ and how-it-works are the real documents, not trailers.
// The two cert roadmaps are NOT here; they are paid product. The honesty is the
// conversion mechanism, which is exactly why the free things have to be real.
//
// COMMITTED IS MEMBERSHIP ONLY. Cert prices belong on /certifications and in the
// Offers section — one other place on the home page, not three.
//
// Prices come from lib/pricing.ts. Nothing is retyped here.

// The free docs. Linked, never duplicated.
//
// The Security+ and ServiceNow CSA study plans are NOT here and must not be added.
// Those are the paid product - a Sec+ or CSA buyer is paying for the voucher, the
// coaching AND that roadmap - so handing them out on the free side is giving the
// thing away. They stay coach-send-only via the CRM Resources tab, which sends them
// to clients who bought. The AWS AI plan is fair game: that track is included with
// membership rather than sold on its own.
const FREE_RESOURCES: Array<{ label: string; href: string }> = [
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
              and take the guides with you whether you ever pay us or not.
            </p>

            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">✓</span><span>The Discord, free — including the daily tech-intel channels</span></li>
              <li className="flex gap-2"><span className="text-gray-500 shrink-0">✓</span><span>The guides below — the AWS AI plan, the FAQ, how this works — no card</span></li>
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
              you want somebody in it with you until you get there. Membership is the
              door: get in, meet your coach, and they map the cert track around your
              life from there.
            </p>

            {/* Membership is the ONLY thing on this side. Committing means joining —
                a cert track is a separate decision a coach walks you through once
                you're in, so putting $1,500 next to $375 here just made the step
                look bigger than it is. Cert prices live on /certifications. */}
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>A coach who knows your name and what you&apos;re working toward</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>Bo Tech and the quiz engine — your AI tutor, in your Discord, at 3 AM</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>Resume rebuilt in ROT format, and the recruiter roster</span></li>
              <li className="flex gap-2"><span className="text-orange-400 shrink-0">✓</span><span>Weekly calls and job drops Mon/Wed/Fri</span></li>
            </ul>

            <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-end justify-center gap-2">
                <span className="text-4xl font-black leading-none">{money(PRICING.yearly)}</span>
                <span className="text-gray-400 mb-0.5">/year</span>
              </div>
              <div className="text-gray-400 text-sm text-center mt-1">or {money(PRICING.monthly)}/month — cancel anytime</div>
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
