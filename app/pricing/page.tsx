import EstimateBuilderTrigger from "../components/EstimateBuilderTrigger";

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

const DISCORD_LINK = "https://discord.gg/dtcYf8PTNa";

const benefits = [
  "Full Discord access", "The Roster (recruiter-visible)", "Weekly meetings with the community",
  "Full quiz system (Discord + web)", "Free 30-min 1-on-1 strategy call with Bo",
  "24/7 Bo Tech AI agent", "Cert roadmaps for 10+ certifications", "Clearance pathway guidance",
  "Real project portfolio guidance", "Resume rebuild intake", "Salary intel database", "Job drops + community wins",
];

const freePerks = [
  {
    icon: "📈",
    title: "#tech-news — daily auto-drop",
    desc: "Bo Tech web-searches every day for 4-5 of the most relevant stories for IT job seekers — cybersecurity, AI/ML, ServiceNow, cloud (AWS/Azure), government IT, hiring trends, certifications. Each one comes with a headline + a one-line summary + why it matters for your career.",
  },
  {
    icon: "💼",
    title: "#job-board — newest cleared roles, MWF",
    desc: "Bot auto-drops fresh cleared / aspiring-tech job postings every Monday, Wednesday, and Friday. Cleared-only roles get their own #cleared-jobs channel inside the paid tier.",
  },
];

export default async function Pricing() {
  const count = await getMemberCount();
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">Everything You Get<br /><span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Now $227 / Year.</span></h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
        The <b className="text-white">first-100 founding seats ($96) are gone.</b> Membership is now <b className="text-white">$227/year</b> — full access for 12 months, one payment, no recurring surprises. Locked at $227 <b className="text-white">through July 27</b>; $375/year after.
      </p>

      <div className="border-2 border-orange-500/30 rounded-2xl p-8 md:p-12 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold tracking-wider">VIP MEMBER ACCESS</div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ul className="space-y-3">
            {benefits.map(b => <li key={b} className="flex gap-3 text-gray-300"><span className="text-green-500">✓</span>{b}</li>)}
          </ul>
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 text-center">
            <div className="text-7xl font-black text-orange-500">$227</div>
            <div className="text-orange-400 text-xs font-bold tracking-widest uppercase mt-1">Per year · 12 months full access</div>
            <div className="text-gray-500 text-xs mt-1 mb-6">Founding ($96) sold out · one payment</div>
            <a href="https://square.link/u/c8X7TC0z" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg">Join — $227 / year</a>
            <div className="my-4 flex items-center gap-3 text-gray-600 text-xs"><span className="flex-1 h-px bg-white/10" />or lock monthly<span className="flex-1 h-px bg-white/10" /></div>
            <div className="text-3xl font-black text-white">$27<span className="text-base font-bold text-gray-400"> / month</span></div>
            <div className="text-gray-500 text-xs mt-1 mb-3">First 2 months for $27, then $27/mo while active</div>
            <a href="https://square.link/u/XlN3ZFcU" target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-orange-500/50 text-orange-400 font-bold rounded-lg hover:bg-orange-500/10">Lock $27 / month</a>
            <div className="text-gray-400 text-sm mt-4">🔒 Founding full — {Math.max(count, 100)} in the community</div>
            <div className="text-gray-500 text-xs mt-2 italic">Through July 27: <b className="text-gray-300">$227/yr or $27/mo</b> · after: $375/yr or $40/mo.</div>
          </div>
        </div>
      </div>

      {/* FREE TIER — Discord-only, no upfront ask */}
      <div className="mt-12 border border-white/10 rounded-2xl p-8 md:p-10 bg-zinc-950">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <div className="text-gray-400 font-bold tracking-widest text-xs mb-2">FREE TIER · DISCORD ONLY</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Just want the signal?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl">
              Join the Discord for free and you get the two channels Bo Tech auto-feeds every day. No card, no quiz access, no calls — just the daily intel pipe that powers the rest of the community.
            </p>

            <div className="space-y-4">
              {freePerks.map(p => (
                <div key={p.title} className="bg-zinc-900 border border-white/10 rounded-xl p-5">
                  <div className="font-bold text-base mb-1.5">{p.icon} {p.title}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-xs italic mt-5">When you&apos;re ready for cert prep, the live calls, Bo Tech 1-on-1, and the recruiter-facing roster — upgrade to VIP anytime. Same Discord, more channels unlocked.</p>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-7 text-center md:min-w-[260px]">
            <div className="text-5xl font-black text-gray-300">$0</div>
            <div className="text-gray-500 text-xs mb-5">forever</div>
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 text-sm">Join Discord (free)</a>
            <div className="text-gray-600 text-[11px] mt-3">Bot DMs you when you arrive — pick free or upgrade right there.</div>
          </div>
        </div>
      </div>

      {/* PROJECT BUILD — Build-an-estimate, separate funnel from the membership tiers */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-3">PROJECT BUILD</div>
          <h2 className="text-3xl md:text-4xl font-black">Need something built?</h2>
          <p className="text-gray-400 mt-3 max-w-xl mx-auto">
            Memberships above are for your career. If you&apos;re a business owner or operator and you want Bo to build/automate something for you, price it yourself here.
          </p>
        </div>
        <EstimateBuilderTrigger />
      </div>
    </main>
  );
}
