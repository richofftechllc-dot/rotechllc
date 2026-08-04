import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support — Rich Off Tech",
  description: "Talk to an AI agent, read the FAQ, book a call, or find us in Discord.",
};

// HELP — the support surface. The three qualification agents used to sit mid-way down
// the home page where most visitors never reached them; they are the primary
// conversion mechanism, so they get a route and a nav slot of their own.
//
// The FAQ and how-it-works links point at the existing client-facing docs in
// public/resources — deliberately not re-typed here, so there is one copy to update.
const RESOURCES: Array<{ title: string; desc: string; href: string; external?: boolean }> = [
  { title: "FAQ", desc: "The questions we get asked most — vouchers, timelines, refunds, access.", href: "/resources/rot-faq.html" },
  { title: "How it works", desc: "Start to certified: what happens after you buy, step by step.", href: "/resources/rot-how-it-works.html" },
  { title: "Book a 1-on-1 · members", desc: "Members: grab time with your coach. Not a member yet? The free qualifier agents above take anyone.", href: "/book" },
  { title: "Sunday calls", desc: "The weekly live call schedule and what each one covers.", href: "/calls" },
  { title: "Bot commands", desc: "Everything Bo Tech responds to in Discord.", href: "/commands" },
  { title: "Pricing", desc: "Membership tiers side by side, plus the project estimate builder.", href: "/pricing" },
];

const AGENTS: Array<{ name: string; sub: string; id: string; accent: string; emoji: string }> = [
  { name: "Clearance Qualifier", sub: "Federal clearance intake · ~5 min", id: "69e6d89a462191c47e54e17a", accent: "green", emoji: "🛡️" },
  { name: "Cert Qualifier", sub: "Certification track fit · ~5 min", id: "69e6dec6bfc9dd72bc6df449", accent: "yellow", emoji: "🎓" },
  { name: "Project Discovery", sub: "Custom project intake · ~5 min", id: "69e6e005462191c47e54e17b", accent: "blue", emoji: "💻" },
];

// Tailwind needs whole class names at build time, so the accent map is explicit
// rather than interpolated.
const ACCENT: Record<string, { border: string; chip: string }> = {
  green: { border: "border-emerald-600/25", chip: "bg-emerald-500/15" },
  yellow: { border: "border-yellow-500/20", chip: "bg-amber-500/15" },
  blue: { border: "border-blue-600/25", chip: "bg-blue-500/15" },
};

export default function Help() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-4 text-center">
        <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">HELP &amp; SUPPORT</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4">Get a straight answer.</h1>
        <p className="text-rot-muted text-lg max-w-2xl mx-auto">
          Talk to an agent, read the FAQ, or find a human. Nothing here costs anything.
        </p>
      </section>

      {/* TALK TO AGENTS — primary conversion mechanism */}
      <section id="agents" className="bg-gradient-to-br from-green-950/30 to-black py-24 border-t border-rot-line scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-emerald-600 font-bold tracking-widest text-sm mb-4">TALK TO THE AGENTS</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Talk to the AI agents live.</h2>
            <p className="text-rot-muted text-lg max-w-2xl mx-auto">
              Click any agent below to connect for a real qualification call. No phone number, no waiting — you talk to the agent directly in your browser.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {AGENTS.map((a) => (
              <div key={a.id} className={`bg-rot-surface border ${ACCENT[a.accent].border} rounded-2xl p-5`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${ACCENT[a.accent].chip} rounded-lg flex items-center justify-center text-xl`}>{a.emoji}</div>
                  <div>
                    <div className="font-bold">{a.name}</div>
                    <div className="text-rot-faint text-xs">{a.sub}</div>
                  </div>
                </div>
                <iframe
                  src={`https://agents.fireflies.ai/connect-to-agent?id=${a.id}`}
                  title={`ROT ${a.name}`}
                  className="w-full rounded-lg bg-rot-sunken"
                  height="500"
                  allow="microphone; autoplay"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELF-SERVE — the docs that already exist, linked not duplicated */}
      <section className="bg-rot-sunken py-24 border-t border-rot-line">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">READ IT YOURSELF</div>
            <h2 className="text-4xl md:text-5xl font-black">FAQ &amp; guides.</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {RESOURCES.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="block bg-rot-surface border border-rot-line rounded-2xl p-6 hover:border-rot-accent/30 transition"
              >
                <div className="font-bold text-lg mb-2">{r.title}</div>
                <p className="text-rot-muted text-sm">{r.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — value close, no price */}
      <section className="bg-gradient-to-br from-orange-500/10 to-red-500/10 py-24 border-t border-rot-line">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Still stuck? Come ask.</h2>
          <p className="text-rot-muted text-lg mb-8">Hop in the Discord — it&apos;s free. Bo Tech and the team map your cert track, exam voucher, clearance path, or AI build from there. No checkout here.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-lg hover:opacity-90">
              Join the Discord — Free
            </a>
            <a href="/membership" className="inline-block px-8 py-4 border border-rot-line-strong rounded-lg text-lg hover:bg-rot-sunken">
              Become a member
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
