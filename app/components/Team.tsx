import Image from "next/image";
import CoordinatorCard from "./CoordinatorCard";

const DISCORD_INVITE = "https://discord.gg/7bjyPvTx4w";

export default function Team() {
  return (
    <section className="bg-gradient-to-br from-orange-500/10 to-black py-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">THE TEAM</div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">Meet the coordinators.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The humans behind the agents. After you qualify, these are the people you'll be working with.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">

          {/* TY — Cert */}
          <div className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full border border-yellow-500/30 overflow-hidden shrink-0">
                <Image src="/team/ty.jpg" alt="Ty" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-lg leading-tight">Ty</div>
                <div className="text-gray-400 text-sm mt-0.5">Certification Coordinator</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Cert</span>
            </div>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block w-full text-center px-4 py-2.5 border border-yellow-500/30 text-yellow-500 font-bold rounded-lg text-sm hover:bg-yellow-500/10"
            >
              Book a Consult →
            </a>
          </div>

          {/* D. KNIGHT — Career & Clearance */}
          <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-xl font-black text-green-500 shrink-0">DK</div>
              <div className="min-w-0">
                <div className="font-bold text-lg leading-tight">D. Knight</div>
                <div className="text-gray-400 text-sm mt-0.5">Career &amp; Clearance Coordinator</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs px-2 py-1 bg-white/5 text-gray-300 border border-white/10 rounded">Intro</span>
              <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Cert</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">Clearance</span>
            </div>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block w-full text-center px-4 py-2.5 border border-green-500/30 text-green-500 font-bold rounded-lg text-sm hover:bg-green-500/10"
            >
              Book a Consult →
            </a>
          </div>

          {/* BO — Founder */}
          <div className="bg-zinc-900 border border-orange-500/40 rounded-2xl p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full border border-orange-500/40 overflow-hidden shrink-0">
                <Image src="/about/knowledge-2026/k26-smile.jpg" alt="Bo" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-lg leading-tight">Bo <span className="text-gray-500 font-medium text-sm">(Randy Allen)</span></div>
                <div className="text-gray-400 text-sm mt-0.5">Founder · Developer &amp; AI Engineer</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs px-2 py-1 bg-white/5 text-gray-300 border border-white/10 rounded">Intro</span>
              <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Cert</span>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">Clearance</span>
              <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded">Project Intake</span>
            </div>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block w-full text-center px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm hover:opacity-90"
            >
              Book a Consult →
            </a>
          </div>

        </div>

        {/* COORDINATOR SPOTLIGHT — full-bleed marketing units. DK + Bo flyers TBD. */}
        <details className="mt-16 group">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-4 border-y border-white/10 hover:border-orange-500/40 transition">
            <div>
              <div className="text-orange-500 font-bold tracking-widest text-[11px] mb-1">COORDINATOR SPOTLIGHT</div>
              <div className="text-gray-400 text-sm">Full coordinator pages with deeper info</div>
            </div>
            <div className="text-orange-500 text-xl group-open:rotate-180 transition-transform">↓</div>
          </summary>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block rounded-2xl overflow-hidden border border-yellow-500/30 hover:border-yellow-500/60 transition aspect-[941/1672] bg-black"
            >
              <Image
                src="/team/ty-flyer.jpg"
                alt="Ty — Certification Coordinator (DMV)"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </a>
            <CoordinatorCard
              name="D. Knight"
              title="Career & Clearance Coordinator"
              accent="green"
              ctaHref={DISCORD_INVITE}
              handles={["Intro", "Cert", "Clearance"]}
            />
            <CoordinatorCard
              name="Bo"
              title="Founder · Developer & AI Engineer"
              accent="orange"
              photo="/about/knowledge-2026/k26-portrait-a.jpg"
              ctaHref={DISCORD_INVITE}
              handles={["Intro", "Cert", "Clearance", "Project Intake"]}
            />
          </div>
        </details>
      </div>
    </section>
  );
}
