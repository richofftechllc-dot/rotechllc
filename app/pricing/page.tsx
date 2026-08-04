import EstimateBuilderTrigger from "../components/EstimateBuilderTrigger";
import { CHECKOUT, COACH_FALLBACK } from "@/lib/pricing";

async function getMemberCount() {
  try {
    // Hit Discord directly. The old self-fetch to `${VERCEL_URL}/api/member-count`
    // failed behind Vercel deployment protection and silently fell back to 72.
    const res = await fetch(
      "https://discord.com/api/v10/guilds/1488597128329822369?with_counts=true",
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }, next: { revalidate: 120 } }
    );
    if (!res.ok) return 114;
    const data = await res.json();
    return data.approximate_member_count || 72;
  } catch {
    return 114;
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
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">Everything You Get<br /><span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Now $375 / Year.</span></h1>
      <p className="text-rot-muted text-center mb-16 max-w-2xl mx-auto">
        Founding is <b className="text-rot-fg">closed</b> — all 99 seats gone. Membership is <b className="text-rot-fg">$375/year</b> — full access for 12 months, one payment, no recurring surprises. Everyone who joined at a founding rate <b className="text-rot-fg">keeps it</b>.
      </p>

      <div className="border-2 border-rot-accent/30 rounded-2xl p-8 md:p-12 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold tracking-wider">VIP MEMBER ACCESS</div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ul className="space-y-3">
            {benefits.map(b => <li key={b} className="flex gap-3 text-rot-muted"><span className="text-emerald-600">✓</span>{b}</li>)}
          </ul>
          <div className="bg-rot-surface border border-rot-line rounded-xl p-8 text-center">
            <div className="text-7xl font-black text-rot-accent">$375</div>
            <div className="text-rot-accent text-xs font-bold tracking-widest uppercase mt-1">Per year · 12 months full access</div>
            <div className="text-rot-faint text-xs mt-1 mb-6">Founding closed · one payment · 12 months</div>
            <a href={CHECKOUT.yearly || COACH_FALLBACK} target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg">{CHECKOUT.yearly ? "Join — $375 / year" : "Talk to a coach to join"}</a>
            <div className="my-4 flex items-center gap-3 text-rot-faint text-xs"><span className="flex-1 h-px bg-rot-sunken" />or lock monthly<span className="flex-1 h-px bg-rot-sunken" /></div>
            <div className="text-3xl font-black text-rot-fg">$40<span className="text-base font-bold text-rot-muted"> / month</span></div>
            <div className="text-rot-faint text-xs mt-1 mb-3">$40/mo while active · cancel anytime</div>
            {CHECKOUT.monthly && (<a href={CHECKOUT.monthly} className="block w-full py-3 border border-rot-accent/30 text-rot-accent font-bold rounded-lg hover:bg-rot-accent/10">Start — $40 / month</a>)}
            
            <div className="text-rot-muted text-sm mt-4">🔒 Founding full — {Math.max(count, 100)} in the community</div>
            <div className="text-rot-faint text-xs mt-2 italic">Locked in at a founding rate? You keep it — <b className="text-rot-muted">$227/yr or $27/mo stays yours</b> for as long as you stay active.</div>
          </div>
        </div>
      </div>

      {/* FREE TIER — Discord-only, no upfront ask */}
      <div className="mt-12 border border-rot-line rounded-2xl p-8 md:p-10 bg-rot-sunken">
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <div className="text-rot-muted font-bold tracking-widest text-xs mb-2">FREE TIER · DISCORD ONLY</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Just want the signal?</h2>
            <p className="text-rot-muted mb-6 max-w-2xl">
              Join the Discord for free and you get the two channels Bo Tech auto-feeds every day. No card, no quiz access, no calls — just the daily intel pipe that powers the rest of the community.
            </p>

            <div className="space-y-4">
              {freePerks.map(p => (
                <div key={p.title} className="bg-rot-surface border border-rot-line rounded-xl p-5">
                  <div className="font-bold text-base mb-1.5">{p.icon} {p.title}</div>
                  <p className="text-rot-muted text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-rot-faint text-xs italic mt-5">When you&apos;re ready for cert prep, the live calls, Bo Tech 1-on-1, and the recruiter-facing roster — upgrade to VIP anytime. Same Discord, more channels unlocked.</p>
          </div>

          <div className="bg-rot-surface border border-rot-line rounded-xl p-7 text-center md:min-w-[260px]">
            <div className="text-5xl font-black text-rot-muted">$0</div>
            <div className="text-rot-faint text-xs mb-5">forever</div>
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="block w-full py-3 border border-rot-line-strong text-rot-fg font-bold rounded-lg hover:bg-rot-sunken text-sm">Join Discord (free)</a>
            <div className="text-rot-faint text-[11px] mt-3">Bot DMs you when you arrive — pick free or upgrade right there.</div>
          </div>
        </div>
      </div>

      {/* PROJECT BUILD — Build-an-estimate, separate funnel from the membership tiers.
          id="estimate" because /hub already deep-links to /pricing#estimate. */}
      <div id="estimate" className="mt-16 scroll-mt-20">
        <div className="text-center mb-8">
          <div className="text-rot-accent font-bold tracking-widest text-sm mb-3">PROJECT BUILD</div>
          <h2 className="text-3xl md:text-4xl font-black">Need something built?</h2>
          <p className="text-rot-muted mt-3 max-w-xl mx-auto">
            Memberships above are for your career. If you&apos;re a business owner or operator and you want Bo to build/automate something for you, price it yourself here.
          </p>
        </div>
        <EstimateBuilderTrigger />
      </div>
    </main>
  );
}
