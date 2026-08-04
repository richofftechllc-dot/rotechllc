import BoAvatarFlip from "./components/BoAvatarFlip";
import Reveal from "./components/Reveal";
import CommittedOrInterested from "./components/CommittedOrInterested";
// BirthdayBanner retired Aug 2 2026 — the drop ended Jul 27 and the countdown
// was stuck rendering "It's the 27th 🎂" on the live homepage. Component kept in
// the tree for the next drop; just not mounted.
// import BirthdayBanner from "./components/BirthdayBanner";
import FoundingSlot from "./components/FoundingSlot";
import Offers from "./components/Offers";
import ResultsWall from "./components/ResultsWall";
import WhoItsFor from "./components/WhoItsFor";

async function getMemberCount() {
  try {
    // Hit Discord directly. The old self-fetch to `${VERCEL_URL}/api/member-count`
    // failed behind Vercel deployment protection and silently fell back to 72.
    const res = await fetch(
      "https://discord.com/api/v10/guilds/1488597128329822369?with_counts=true",
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }, next: { revalidate: 120 } }
    );
    if (!res.ok) return 72;
    const data = await res.json();
    return data.approximate_member_count || 72;
  } catch {
    return 72;
  }
}

// HOME — six sections, in this order, and nothing more (Aug 4 2026 restructure).
// The page used to run ~13 sections deep and users never reached the bottom, so
// everything below "Pick your lane" now lives on its own route and is reachable
// from the nav: /certifications, /membership, /about, /help.
export default async function Home() {
  const memberCount = await getMemberCount();
  return (
    <>
      {/* 0 — THE FORK. Sits above the hero on purpose: the first decision is
          whether you're interested or committed, and everything below reads
          differently once you've picked. Interested is a real free offer, not a
          teaser — see the component. */}
      <Reveal><CommittedOrInterested /></Reveal>

      {/* 1 — BO TECH: the AI-powered career command center */}
      <main className="max-w-6xl mx-auto px-6 pt-16 md:pt-20 pb-24 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><div className="rot-kicker mb-8">Bo Tech · AI-powered career command center</div></Reveal>
            {/* <BirthdayBanner /> — retired, see import note */}
            <Reveal delay={60}><h1 className="text-5xl md:text-7xl font-semibold leading-[0.95] mb-6">
              Your AI-powered<br />
              <span className="text-rot-muted">career command center.</span>
            </h1></Reveal>
            <Reveal delay={120}><div className="text-rot-faint text-sm mb-8 tracking-wide">Tech · GovTech · Commercial Tech · AI</div></Reveal>
            <Reveal delay={160}><p className="text-rot-muted text-lg mb-10 max-w-md leading-relaxed">
              Self-paced and live-cohort certification tracks, an AI tutor that lives in your Discord, exam vouchers, clearance guidance, and real project work — the guided system Bo built for breaking into Tech, GovTech, Commercial Tech, and AI.
            </p></Reveal>
            <Reveal delay={210}><div className="flex flex-wrap gap-4">
              <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="rot-btn-accent px-6 py-3.5 text-sm">
                Join the Discord — Free
              </a>
              <a href="/help#agents" className="rot-btn-ghost px-6 py-3.5 text-sm">
                Talk to an AI agent
              </a>
              <a href="#founding" className="rot-btn-ghost px-6 py-3.5 text-sm">
                See membership →
              </a>
            </div>
            </Reveal>
            <p className="text-rot-faint text-sm mt-6">Free to join — or grab <a href="#founding" className="text-rot-fg underline underline-offset-4 decoration-rot-line-strong hover:decoration-rot-fg">full membership</a> below. 🤎</p>
          </div>
          <BoAvatarFlip />
        </div>
      </main>

      {/* 2 — BREAKING INTO TECH */}
      <Reveal>
      <section id="breaking-in" className="bg-rot-sunken py-24 md:py-32 border-t border-rot-line scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-semibold leading-[0.95] mb-6">
            Break into Tech.<br />
            <span className="text-rot-muted">No shortcuts.</span>
          </h2>
          <p className="text-rot-muted text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
            Not a video dump — a guided system. Self-paced or live-cohort cert tracks, a live AI tutor, your exam voucher, clearance guidance, and real project work. You move, Bo Tech moves with you.
          </p>
          <a href="/certifications" className="inline-block text-sm text-rot-fg underline underline-offset-4 decoration-rot-line-strong hover:decoration-rot-fg">See everything you get inside ROT →</a>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-rot-line border border-rot-line mt-20 text-center">
            <div className="bg-rot-bg py-8 px-4"><div className="text-3xl sm:text-5xl font-semibold tracking-tight">{memberCount}</div><div className="rot-kicker mt-3">Active members (live)</div></div>
            <div className="bg-rot-bg py-8 px-4"><div className="text-3xl sm:text-5xl font-semibold tracking-tight">200+</div><div className="rot-kicker mt-3">online certifications</div></div>
            <div className="bg-rot-bg py-8 px-4"><div className="text-3xl sm:text-5xl font-semibold tracking-tight">14+</div><div className="rot-kicker mt-3">States represented</div></div>
            <div className="bg-rot-bg py-8 px-4"><div className="text-3xl sm:text-5xl font-semibold tracking-tight">100%</div><div className="rot-kicker mt-3">Virtual &amp; flexible</div></div>
          </div>
        </div>
      </section>

      </Reveal>

      {/* 3 — RECEIPTS, NOT PROMISES */}
      <Reveal><ResultsWall /></Reveal>

      {/* 4 — OFFERS */}
      <Reveal><Offers /></Reveal>

      {/* 5 — FOUNDER FULL MEMBERSHIP */}
      <Reveal><FoundingSlot /></Reveal>

      {/* 6 — PICK YOUR LANE */}
      <Reveal><WhoItsFor /></Reveal>
    </>
  );
}
