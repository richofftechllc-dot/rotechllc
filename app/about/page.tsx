import type { Metadata } from "next";
import Image from "next/image";
import AboutMontage from "../components/AboutMontage";
import ResultsWall from "../components/ResultsWall";
import Team from "../components/Team";
import WatchCarousel from "../components/WatchCarousel";

export const metadata: Metadata = {
  title: "About — Rich Off Tech",
  description: "Bo's story, the coordinators behind the AI, and the receipts.",
};

// ABOUT — Bo's story, the coordinators, the playbook videos, and the proof. Moved off
// the home page in the Aug 4 2026 restructure; the home page keeps ResultsWall because
// the receipts have to land before the offers, but the full context lives here.
export default function About() {
  return (
    <>
      {/* ABOUT — Bo's story. K26 montage collapsed by default. */}
      <section id="about" className="bg-zinc-950 py-24 border-b border-white/5 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">ABOUT · RICH OFF TECH LLC · EST. JANUARY 2025</div>
          <h1 className="text-5xl md:text-6xl font-black mb-12">Guided by Experience.<br />Powered by Purpose.</h1>
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
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4+</div><div className="text-gray-400 text-sm mt-2">Years in IT &amp; Federal Tech</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">TS/SCI</div><div className="text-gray-400 text-sm mt-2">Active Full Scope Poly</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">4</div><div className="text-gray-400 text-sm mt-2">Consulting Services Offered</div></div>
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6"><div className="text-4xl font-black text-green-500">100%</div><div className="text-gray-400 text-sm mt-2">Virtual &amp; Flexible Sessions</div></div>
          </div>
          <AboutMontage />
        </div>
      </section>

      {/* RECEIPTS — the same wall the home page opens with, in full context */}
      <ResultsWall />

      {/* TEAM — humans behind the AI */}
      <Team />

      {/* WATCH — Bo's playbook on YouTube Shorts */}
      <WatchCarousel />

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
    </>
  );
}
