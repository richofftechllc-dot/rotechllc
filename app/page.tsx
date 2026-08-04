import BoAvatarFlip from "./components/BoAvatarFlip";
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
      {/* 1 — BO TECH: the AI-powered career command center */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">BO TECH · YOUR AI-POWERED CAREER COMMAND CENTER</div>
            {/* <BirthdayBanner /> — retired, see import note */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
              Your AI-powered<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">career command center.</span>
            </h1>
            <div className="text-gray-300 font-bold tracking-wide text-sm mb-6">Tech · GovTech · Commercial Tech · AI</div>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Self-paced and live-cohort certification tracks, an AI tutor that lives in your Discord, exam vouchers, clearance guidance, and real project work — the guided system Bo built for breaking into Tech, GovTech, Commercial Tech, and AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">
                Join the Discord — Free
              </a>
              <a href="/help#agents" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5">
                Talk to an AI agent
              </a>
              <a href="#membership" className="px-6 py-3 border border-orange-500/40 text-orange-400 rounded-lg hover:bg-orange-500/10 font-bold">
                See membership →
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-4">Free to join — or grab <a href="#membership" className="text-orange-400 underline underline-offset-2">full membership</a> below. 🤎</p>
          </div>
          <BoAvatarFlip />
        </div>
      </main>

      {/* 2 — BREAKING INTO TECH */}
      <section id="breaking-in" className="bg-zinc-950 py-20 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
            Break into Tech.<br />
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">No shortcuts.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
            Not a video dump — a guided system. Self-paced or live-cohort cert tracks, a live AI tutor, your exam voucher, clearance guidance, and real project work. You move, Bo Tech moves with you.
          </p>
          <a href="/certifications" className="inline-block text-orange-400 font-bold hover:text-orange-300">See everything you get inside ROT →</a>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 text-center">
            <div><div className="text-3xl sm:text-5xl font-black text-orange-500">{memberCount}</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Active members (live)</div></div>
            <div><div className="text-3xl sm:text-5xl font-black text-orange-500">200+</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">online certifications</div></div>
            <div><div className="text-3xl sm:text-5xl font-black text-orange-500">14+</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">States represented</div></div>
            <div><div className="text-3xl sm:text-5xl font-black text-orange-500">100%</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Virtual &amp; flexible</div></div>
          </div>
        </div>
      </section>

      {/* 3 — RECEIPTS, NOT PROMISES */}
      <ResultsWall />

      {/* 4 — OFFERS */}
      <Offers />

      {/* 5 — FOUNDER FULL MEMBERSHIP */}
      <FoundingSlot />

      {/* 6 — PICK YOUR LANE */}
      <WhoItsFor />
    </>
  );
}
