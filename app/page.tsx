import Image from "next/image";
import Link from "next/link";
import Team from "./components/Team";

async function getMemberCount() {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const res = await fetch(`${base}/api/member-count`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.count || 64;
  } catch {
    return 64;
  }
}

export default async function Home() {
  const memberCount = await getMemberCount();
  return (
    <>
      {/* HERO */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">BO TECH · YOUR AI-POWERED CAREER COMMAND CENTER</div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
              Cleared Tech.<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">No shortcuts.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Rich Off Tech is the community Bo built for cleared and aspiring tech professionals. Cert tracks. Career coaching. Real moves from people locked in on the same path.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://square.link/u/7P6knSUK" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">
                Become a Founding Member — $96
              </a>
              <Link href="/roster" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5">
                See the Community
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-full blur-3xl"></div>
            <Image src="/bo-avatar.png" alt="Bo" width={500} height={500} className="relative rounded-full" priority />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-24 text-center">
          <div><div className="text-5xl font-black text-orange-500">{memberCount}</div><div className="text-gray-500 text-sm mt-2">Active members</div></div>
          <div><div className="text-5xl font-black text-orange-500">14</div><div className="text-gray-500 text-sm mt-2">States represented</div></div>
          <div><div className="text-5xl font-black text-orange-500">4</div><div className="text-gray-500 text-sm mt-2">Years zero to seven figures</div></div>
        </div>
      </main>

      {/* ABOUT */}
      <section className="bg-zinc-950 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">ABOUT</div>
          <h2 className="text-5xl md:text-6xl font-black mb-12">Guided by Experience.<br />Powered by Purpose.</h2>
          <p className="text-gray-400 text-lg max-w-3xl mb-16">
            I'm Randy — a developer and AI engineer, founder of Rich Off Tech LLC. From zero to TS/SCI Full Scope Poly clearance in under 4 years, now at GDIT building the platforms cleared tech needs. I built this company to share what actually works — no fluff, no gatekeeping.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4+</div><div className="text-gray-400 text-sm mt-2">Years in IT & Federal Tech</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">TS/SCI</div><div className="text-gray-400 text-sm mt-2">Active Full Scope Poly</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4</div><div className="text-gray-400 text-sm mt-2">Consulting Services Offered</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">100%</div><div className="text-gray-400 text-sm mt-2">Virtual & Flexible Sessions</div></div>
          </div>
        </div>
      </section>

      {/* TALK TO AGENTS */}
      <section className="bg-gradient-to-br from-green-950/30 to-black py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-green-500 font-bold tracking-widest text-sm mb-4">TALK TO THE AGENTS</div>
            <h2 className="text-5xl md:text-6xl font-black mb-6">Talk to the AI agents live.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Click any agent below to connect for a real qualification call. No phone number, no waiting — you talk to the agent directly in your browser.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">🛡️</div>
                <div>
                  <div className="font-bold">Clearance Qualifier</div>
                  <div className="text-gray-500 text-xs">Federal clearance intake · ~5 min</div>
                </div>
              </div>
              <iframe src="https://agents.fireflies.ai/connect-to-agent?id=69e6d89a462191c47e54e17a" title="ROT Clearance Qualifier" className="w-full rounded-lg bg-zinc-950" height="500" allow="microphone; autoplay" />
            </div>
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center text-xl">🎓</div>
                <div>
                  <div className="font-bold">Cert Qualifier</div>
                  <div className="text-gray-500 text-xs">Certification track fit · ~5 min</div>
                </div>
              </div>
              <iframe src="https://agents.fireflies.ai/connect-to-agent?id=69e6dec6bfc9dd72bc6df449" title="ROT Cert Qualifier" className="w-full rounded-lg bg-zinc-950" height="500" allow="microphone; autoplay" />
            </div>
            <div className="bg-zinc-900 border border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">💻</div>
                <div>
                  <div className="font-bold">Project Discovery</div>
                  <div className="text-gray-500 text-xs">Custom project intake · ~5 min</div>
                </div>
              </div>
              <iframe src="https://agents.fireflies.ai/connect-to-agent?id=69e6e005462191c47e54e17b" title="ROT Project Discovery" className="w-full rounded-lg bg-zinc-950" height="500" allow="microphone; autoplay" />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <Team />

      {/* TESTIMONIALS */}
      <section className="bg-zinc-950 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-green-500 font-bold tracking-widest text-sm mb-4">WHAT CLIENTS SAY</div>
          <h2 className="text-5xl md:text-6xl font-black mb-12">Client Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="font-bold mb-1">D. Knight</div>
              <div className="text-gray-500 text-sm mb-4">200k+ a year — ROTech alum</div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/GJvsuIxpF4A" title="D. Knight testimonial" allowFullScreen />
              </div>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="font-bold mb-1">Ray Jack</div>
              <div className="text-gray-500 text-sm mb-4">Former Military — ISSO</div>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe className="w-full h-full" src="https://www.youtube.com/embed/n5BtWiWM5P4" title="Ray Jack testimonial" allowFullScreen />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-orange-500/10 to-red-500/10 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to lock in?</h2>
          <p className="text-gray-400 text-lg mb-8">$96 for 12 months. Founding rate. Until 100 spots fill.</p>
          <a href="https://square.link/u/7P6knSUK" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-lg hover:opacity-90">
            Become a Founding Member — $96
          </a>
        </div>
      </section>
    </>
  );
}
