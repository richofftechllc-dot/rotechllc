import InterestedCapture from "./InterestedCapture";
import { PRICING, YEARLY_SAVING, money } from "@/lib/pricing";

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
    <section id="start" className="bg-rot-bg border-b border-rot-line">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16">
          <div className="rot-kicker mb-6">Start here</div>
          <h2 className="text-5xl md:text-7xl font-semibold mb-6 leading-[0.95] max-w-4xl mx-auto">
            {/* Each word wears its own panel's material, so the headline and the
                two columns below are visibly the same decision. "interested" was
                muted/70 — it read as disabled text rather than as an option, and
                the whole question landed at half strength. */}
            Are you <span className="rot-word-silver">interested</span>,<br className="sm:hidden" />{" "}
            or are you <span className="rot-word-onyx italic">committed</span>?
          </h2>
          <p className="text-rot-muted text-lg max-w-xl mx-auto leading-relaxed">
            Both are fine. They just get different things. Pick the one that&apos;s
            actually true today — you can change your mind later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-rot-line border border-rot-line items-stretch">
          {/* ── INTERESTED ─────────────────────────────────────────────── */}
          {/* SILVER. White beside polished black read as an unfinished panel
              next to a finished one. This is the steel card to Committed's black
              card: same material build, different stone, so the two are a pair
              and the free side still can't be mistaken for the paid one.
              Ground is light, so type here is near-black, not white. */}
          <div className="rot-silver p-8 md:p-10 flex flex-col">
            <div className="rot-kicker mb-5">Interested</div>
            <h3 className="text-3xl md:text-4xl font-semibold mb-4 rot-silver-fg">Look around.</h3>
            <p className="rot-silver-muted mb-8 leading-relaxed">
              You&apos;re curious, you&apos;re researching, you&apos;re not ready to spend
              money. Good — don&apos;t. Come in free, read everything, ask questions,
              and take the guides with you whether you ever pay us or not.
            </p>

            {/* Mirrors the Committed column exactly — same bullet rhythm, same
                dash markers picking up the panel's own accent. */}
            <ul className="space-y-3 text-sm rot-silver-muted mb-8">
              <li className="flex gap-2"><span className="text-rot-warn shrink-0">—</span><span>The Discord, free — including the daily tech-intel channels</span></li>
              <li className="flex gap-2"><span className="text-rot-warn shrink-0">—</span><span>The guides below — the AWS AI plan, the FAQ, how this works — no card</span></li>
              <li className="flex gap-2"><span className="text-rot-warn shrink-0">—</span><span>Read the whole site — real member results, the roster, what we charge</span></li>
            </ul>

            <div className="flex flex-wrap gap-2 mb-8">
              {FREE_RESOURCES.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  className="text-xs px-3 py-2 border border-rot-silver-line rot-silver-muted hover:border-rot-fg hover:text-rot-fg transition"
                >
                  {r.label} ↗
                </a>
              ))}
            </div>

            {/* The free counterpart to Committed's price block, so the two
                columns hit the same beat at the same height instead of one
                having a feature the other doesn't. */}
            <div className="border-y border-rot-silver-line py-6 mb-8 text-center">
              <div className="text-5xl font-semibold leading-none tracking-tight rot-silver-fg">Free</div>
              <div className="rot-silver-muted text-sm mt-2">No card, no trial, no expiry</div>
              <div className="text-rot-warn text-xs font-semibold mt-2">Keep the guides whether you ever pay us or not</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <a
                href="https://discord.gg/dtcYf8PTNa"
                target="_blank"
                rel="noopener noreferrer"
                className="rot-btn-ghost-silver px-5 py-3 text-sm"
              >
                Join the Discord — Free
              </a>
              <a href="/about" className="rot-btn-ghost-silver px-5 py-3 text-sm">
                Read our story
              </a>
              <a href="/certifications" className="rot-btn-ghost-silver px-5 py-3 text-sm">
                See what we offer
              </a>
            </div>

            {/* mt-auto pins the capture to the bottom so both columns end level */}
            <div className="mt-auto">
              <InterestedCapture />
            </div>
          </div>

          {/* ── COMMITTED ──────────────────────────────────────────────── */}
          {/* ONYX. The paid side is the only dark surface on the site, and that
              is the whole point: on a page made of white marble, the one slab of
              polished black stone is unmistakably the expensive option. It does
              the persuading that a grey card was not doing.

              The black cert card in Offers is the same material on purpose —
              onyx marks the things that cost money. Keep it to those; ordinary
              sections going dark puts us back at the site Randy rejected. */}
          <div className="rot-onyx p-8 md:p-10 flex flex-col">
            <div className="absolute top-8 right-8 rot-kicker !text-rot-accent-2">
              Who Bo works with
            </div>
            <div className="rot-kicker mb-5 !text-rot-accent-2">Committed</div>
            <h3 className="text-3xl md:text-4xl font-semibold mb-4 rot-onyx-fg">You&apos;re changing your life.</h3>
            <p className="rot-onyx-muted mb-8 leading-relaxed">
              You&apos;ve decided. You want the cert, the clearance path, the job — and
              you want somebody in it with you until you get there. Membership is the
              door: get in, meet your coach, and they map the cert track around your
              life from there.
            </p>

            {/* Membership is the ONLY thing on this side. Committing means joining —
                a cert track is a separate decision a coach walks you through once
                you're in, so putting $1,500 next to $375 here just made the step
                look bigger than it is. Cert prices live on /certifications. */}
            {/* Dashes use accent-2 (#ff7a00), not accent (#e8451f). The darker
                brand red clears 4.5:1 on white but not on onyx; the brighter
                orange does, and at this size it is the difference between a
                legible list marker and a smudge. */}
            <ul className="space-y-3 text-sm rot-onyx-muted mb-8">
              <li className="flex gap-2"><span className="text-rot-accent-2 shrink-0">—</span><span>A coach who knows your name and what you&apos;re working toward</span></li>
              <li className="flex gap-2"><span className="text-rot-accent-2 shrink-0">—</span><span>Bo Tech and the quiz engine — your AI tutor, in your Discord, at 3 AM</span></li>
              <li className="flex gap-2"><span className="text-rot-accent-2 shrink-0">—</span><span>Resume rebuilt in ROT format, and the recruiter roster</span></li>
              <li className="flex gap-2"><span className="text-rot-accent-2 shrink-0">—</span><span>Weekly calls and job drops Mon/Wed/Fri</span></li>
            </ul>

            {/* Hairlines here must be the onyx pair — --rot-line is a dark ink
                wash that vanishes completely on black. */}
            <div className="border-y border-rot-onyx-line py-6 mb-8">
              <div className="flex items-end justify-center gap-2">
                <span className="text-5xl font-semibold leading-none tracking-tight rot-onyx-fg">{money(PRICING.yearly)}</span>
                <span className="rot-onyx-muted mb-1">/year</span>
              </div>
              <div className="rot-onyx-muted text-sm text-center mt-2">or {money(PRICING.monthly)}/month — cancel anytime</div>
              <div className="text-rot-accent-2 text-xs font-semibold text-center mt-2">Save {money(YEARLY_SAVING)} a year by paying yearly</div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <a
                href="/membership"
                className="rot-btn-accent w-full px-6 py-4 text-sm"
              >
                I&apos;m committed — start here →
              </a>
              <a href="/help#agents" className="rot-btn-ghost-onyx w-full px-6 py-3 text-sm">
                Not sure which track? Talk to an agent — free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
