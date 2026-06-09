import Image from "next/image";
import Team from "./components/Team";
import AboutMontage from "./components/AboutMontage";
import BoAvatarFlip from "./components/BoAvatarFlip";
import EstimateBuilderTrigger from "./components/EstimateBuilderTrigger";
import WatchCarousel from "./components/WatchCarousel";

async function getMemberCount() {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const res = await fetch(`${base}/api/member-count`, { next: { revalidate: 300 } });
    const data = await res.json();
    return data.count || 72;
  } catch {
    return 72;
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
              Break into Tech.<br />
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">No shortcuts.</span>
            </h1>
            <div className="text-gray-300 font-bold tracking-wide text-sm mb-6">Tech · GovTech · Commercial Tech · AI</div>
            <p className="text-gray-400 text-lg mb-8 max-w-md">
              Self-paced and live-cohort certification tracks, an AI tutor that lives in your Discord, exam vouchers, clearance guidance, and real project work — the guided system Bo built for breaking into Tech, GovTech, Commercial Tech, and AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">
                Join the Discord — Free
              </a>
              <a href="#agents" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5">
                Talk to an AI agent
              </a>
              <a href="#inside" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5">
                What&apos;s inside →
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-4">Free to join. Everything else gets handled inside — no checkout here.</p>
          </div>
          <BoAvatarFlip />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-24 text-center">
          <div><div className="text-3xl sm:text-5xl font-black text-orange-500">{memberCount}</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Active members (live)</div></div>
          <div><div className="text-3xl sm:text-5xl font-black text-orange-500">200+</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">online certifications</div></div>
          <div><div className="text-3xl sm:text-5xl font-black text-orange-500">14+</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">States represented</div></div>
          <div><div className="text-3xl sm:text-5xl font-black text-orange-500">100%</div><div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Virtual &amp; flexible</div></div>
        </div>
      </main>

      {/* WHO IT'S FOR — audience paths (cleared / commercial / recruiters / businesses) */}
      <section id="who" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4 text-center">WHO IT&apos;S FOR</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">Pick your lane.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto text-center mb-12">Cleared, commercial, hiring, or building — ROT meets you where you are.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <a href="#inside" className="block bg-zinc-900 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/50 transition">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="font-bold text-lg mb-2">Cleared professionals</div>
              <p className="text-gray-400 text-sm">Already hold a clearance? Jump to cleared roles, cert upkeep, and the recruiter roster. We keep you moving on-site.</p>
            </a>
            <a href="#inside" className="block bg-zinc-900 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition">
              <div className="text-3xl mb-3">🚀</div>
              <div className="font-bold text-lg mb-2">Aspiring &amp; commercial pros</div>
              <p className="text-gray-400 text-sm">Breaking in or leveling up in commercial tech. Cert tracks (self-paced or live cohort), AI tutor, resume + interview prep — clearance optional.</p>
            </a>
            <a href="/roster" className="block bg-zinc-900 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/50 transition">
              <div className="text-3xl mb-3">🧭</div>
              <div className="font-bold text-lg mb-2">Recruiters &amp; hiring managers</div>
              <p className="text-gray-400 text-sm">Scan a vetted public roster of cleared and commercial talent ready to interview. Reach out direct.</p>
            </a>
            <a href="#ai" className="block bg-zinc-900 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition">
              <div className="text-3xl mb-3">🤝</div>
              <div className="font-bold text-lg mb-2">Businesses &amp; founders</div>
              <p className="text-gray-400 text-sm">CEOs and entrepreneurs: automate your processes, get a website or SaaS built, and deploy AI + 24/7 voice agents so you never miss a call.</p>
            </a>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — value-first explainer (no prices) */}
      <section id="inside" className="bg-zinc-950 py-24 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4 text-center">WHAT YOU GET INSIDE ROT</div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-center">Everything to break into tech.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto text-center mb-14">
            Not a video dump — a guided system. Self-paced or live-cohort cert tracks, a live AI tutor, your exam voucher, clearance guidance, and real project work. You move, Bo Tech moves with you.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <div className="font-bold text-lg mb-2">Cert Tracks — Self-Paced or Live Cohort</div>
              <p className="text-gray-400 text-sm leading-relaxed"><b className="text-white">CompTIA plus 200+ certs you can take online</b> (ServiceNow, AWS, Google, Microsoft &amp; more). Go <b className="text-white">self-paced</b> through the quiz-driven modules (pass 75% to unlock the next) or join a <b className="text-white">live cohort</b>. <b className="text-green-400">Guaranteed pass*</b> when you follow the track.</p>
              <p className="text-orange-400 text-xs font-bold mt-3">⚡ Need it fast? Accelerated sessions available.</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🤖</div>
              <div className="font-bold text-lg mb-2">Quiz System + Bo Tech Tutor</div>
              <p className="text-gray-400 text-sm leading-relaxed">Your access code unlocks the quiz engine at <span className="text-orange-400">rotechllc.com/learn</span>. <b className="text-white">Bo Tech</b> is your live AI instructor — explains every question, drafts your resume, and answers at 3 AM in Discord.</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🎟️</div>
              <div className="font-bold text-lg mb-2">Exam Voucher + Test-Day Setup</div>
              <p className="text-gray-400 text-sm leading-relaxed">We get you the official cert voucher and run your OnVUE / UltraViewer setup so you walk into exam day ready. You keep and test under your own account.</p>
            </div>
            <div className="bg-zinc-900 border border-green-500/20 rounded-2xl p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="font-bold text-lg mb-2">Clearance Guidance</div>
              <p className="text-gray-400 text-sm leading-relaxed">We map your path to a security clearance and help position you to get <b className="text-white">sponsored by a cleared employer</b> — guidance and positioning, not a guarantee, and we don&apos;t issue clearances. Start with the Clearance Qualifier call below.</p>
            </div>
            <div id="ai" className="bg-zinc-900 border border-purple-500/20 rounded-2xl p-6 scroll-mt-20">
              <div className="text-3xl mb-3">⚙️</div>
              <div className="font-bold text-lg mb-2">AI Builds &amp; Automation</div>
              <p className="text-gray-400 text-sm leading-relaxed">For businesses &amp; founders: AI integrations into your existing workflows, custom <b className="text-white">websites &amp; SaaS</b>, AI agents, and <b className="text-white">24/7 voice agents</b> so you never miss a call. Start with the Project Discovery call below.</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🌎</div>
              <div className="font-bold text-lg mb-2">Community + Recruiter Roster</div>
              <p className="text-gray-400 text-sm leading-relaxed">A locked-in Discord and a public roster recruiters actually scan. Weekly calls, interview prep, and job drops Mon/Wed/Fri.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="#agents" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">Start with a quick AI call →</a>
          </div>
          <p className="text-gray-600 text-xs text-center mt-6 max-w-2xl mx-auto">*Pass guarantee: complete your track and the coursework — if you don&apos;t pass, we keep coaching you (retake voucher included) until you do. Full terms shared at enrollment.</p>
        </div>
      </section>

      {/* TALK TO AGENTS — primary conversion mechanism */}
      <section id="agents" className="bg-gradient-to-br from-green-950/30 to-black py-24 border-t border-white/5 scroll-mt-20">
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
              <a href="#estimate" className="block mt-3 text-center text-xs text-blue-400 hover:text-blue-300 font-bold tracking-widest uppercase">Skip the call · Build an estimate ↓</a>
            </div>
          </div>
        </div>
      </section>

      {/* WATCH — Bo's playbook on YouTube Shorts */}
      <WatchCarousel />

      {/* TEAM — humans behind the AI */}
      <Team />

      {/* TESTIMONIALS — social proof */}
      <section className="bg-zinc-950 py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-green-500 font-bold tracking-widest text-sm mb-4">WHAT CLIENTS SAY</div>
          <h2 className="text-5xl md:text-6xl font-black mb-8">Client Testimonials</h2>

          {/* FEATURED: D. Knight's journey — full-width before the quick testimonials */}
          <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-6 mb-8">
            <div className="text-green-500 font-bold tracking-widest text-xs mb-2">FEATURED · D. KNIGHT&apos;S JOURNEY</div>
            <div className="font-bold text-xl mb-1">Just listen to the journey.</div>
            <div className="text-gray-500 text-sm mb-4">From the ground up — how D. Knight broke into cleared tech and crossed $200K/yr.</div>
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src="https://www.youtube.com/embed/TsHQOxsOZn0?rel=0"
                title="D. Knight — Just listen to the journey"
                className="w-full h-full"
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

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

      {/* ABOUT — Bo's story (after they care). K26 montage collapsed by default. */}
      <section id="about" className="bg-zinc-950 py-24 border-t border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">ABOUT · RICH OFF TECH LLC · EST. JANUARY 2025</div>
          <h2 className="text-5xl md:text-6xl font-black mb-12">Guided by Experience.<br />Powered by Purpose.</h2>
          <p className="text-gray-400 text-lg max-w-3xl mb-8">
            I&apos;m Randy — a developer and AI engineer, founder of Rich Off Tech LLC. From zero to TS/SCI Full Scope Poly clearance in under 4 years, now at GDIT building the platforms cleared tech needs. I built this company to share what actually works — no fluff, no gatekeeping.
          </p>

          {/* TWO PHOTOS + MISSION */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-start">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                <Image src="/about/knowledge-2026/k26-portrait-a.jpg" alt="Bo at Knowledge 2026 — Rich Off Tech jacket" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 mt-8">
                <Image src="/about/knowledge-2026/k26-oncam.jpg" alt="Bo on camera — instructor mode" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="text-orange-500 font-bold tracking-widest text-xs mb-3">THE MISSION</div>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                  When federal DEI programs got cancelled, a generation of cleared talent got left in the cold. I&apos;m building the alternative — a pipeline that puts people who look like me in the door, on merit, no quotas. All races, all genders, one rule: come ready to learn.
                </p>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                  Long term I&apos;m taking this curriculum into high schools and juvenile detention centers — specifically targeting recidivism in young Black men. Same skills that took me from zero to TS/SCI Full Scope Poly in under four years. The system says they can&apos;t be reached. I think it just hasn&apos;t tried.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-2 max-w-sm sm:max-w-none mx-auto sm:mx-0">
                  {["q7d0YmDx328", "SgsQpw0cbEM", "GcXTN3uVxOc"].map((id) => (
                    <div key={id} className="aspect-[9/16] rounded-lg overflow-hidden border border-white/10 bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${id}?rel=0`}
                        title="Juvenile justice / community video"
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-orange-500 font-bold tracking-widest text-xs mb-3">WHAT ROT IS</div>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                  Udemy, LinkedIn, and ClearanceJobs in one place. Quiz-driven cert tracks. A public roster recruiters scan. An AI agent — <b className="text-orange-400">Bo Tech</b> — that lives in our Discord and acts as your live AI instructor during self-guided sessions: walks you through every lesson, drafts your resume in ATS-safe format, and answers questions at 3 AM. He moves with you: instructor during quizzes, tutor during lessons, on call in DM.
                </p>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-5">
                  End state: a community of developers, admins, consultants, and AI integrators ready to help small businesses, enterprises, and government agencies actually adopt AI — instead of pretending to.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["L5u9X4ALkdw", "zCWd8pg0cMs"].map((id) => (
                    <div key={id} className="aspect-[9/16] rounded-lg overflow-hidden border border-white/10 bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${id}?rel=0`}
                        title="Rich Off Tech AI"
                        className="w-full h-full"
                        loading="lazy"
                        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4+</div><div className="text-gray-400 text-sm mt-2">Years in IT & Federal Tech</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">TS/SCI</div><div className="text-gray-400 text-sm mt-2">Active Full Scope Poly</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4</div><div className="text-gray-400 text-sm mt-2">Consulting Services Offered</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">100%</div><div className="text-gray-400 text-sm mt-2">Virtual & Flexible Sessions</div></div>
          </div>
          <AboutMontage />
        </div>
      </section>

      {/* ESTIMATE BUILDER — late-funnel self-serve, lazy-loaded behind a button */}
      <section id="estimate" className="bg-gradient-to-b from-black to-zinc-950 py-16 border-t border-white/5">
        <EstimateBuilderTrigger />
      </section>

      {/* CTA — value close, no price */}
      <section className="bg-gradient-to-br from-orange-500/10 to-red-500/10 py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Join free. Lock in inside.</h2>
          <p className="text-gray-400 text-lg mb-8">Hop in the Discord — it&apos;s free. Bo Tech and the team map your cert track, exam voucher, clearance path, or AI build from there. No checkout here.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-lg hover:opacity-90">
              Join the Discord — Free
            </a>
            <a href="#agents" className="inline-block px-8 py-4 border border-white/20 rounded-lg text-lg hover:bg-white/5">
              Talk to an agent first
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
