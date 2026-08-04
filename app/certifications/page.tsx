import type { Metadata } from "next";
import CertRequest from "../components/CertRequest";
import Offers from "../components/Offers";
import { CERT_CATALOG } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Certifications & What We Offer — Rich Off Tech",
  description: "Security+ and ServiceNow CSA cert tracks, exam vouchers, the AI tutor, clearance guidance, and AI builds for businesses.",
};

// WHAT WE OFFER — the cert tracks and everything the membership puts around them.
// Split out of the old single-scroll home page (Aug 4 2026). The Discord-only card
// is hidden here because Discord Access lives on /membership next to the membership
// tiers; this page is about the paid cert tracks.
export default function Certifications() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-4 text-center">
        <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">WHAT WE OFFER</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4">Certifications, coached.</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Pick a track, get the voucher, and work the system with a coach and an AI tutor
          until you pass. Security+ and ServiceNow CSA are what most people come for —
          but if you can sit it online, we coach it.
        </p>
      </section>

      <Offers showDiscord={false} />

      {/* THE REST OF THE CATALOG — coached, but priced per person by a coach, so no
          price and no checkout button. Inventing either would be a chargeback or a
          payment the bot can't route. */}
      <section id="catalog" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">EVERYTHING ELSE</div>
            <h2 className="text-4xl md:text-5xl font-black mb-3">If you can sit it online, we coach it.</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Security+ and CSA are the two with instant checkout above because they&apos;re
              what people buy. Everything here runs the same system — voucher, quiz engine,
              study plan, a coach — priced for your situation. These are the common ones,
              not the whole list.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {CERT_CATALOG.map((g) => (
              <div key={g.group} className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                <div className="text-orange-400 font-bold tracking-widest text-xs mb-4 uppercase">{g.group}</div>
                <div className="flex flex-wrap gap-2">
                  {g.certs.map((c) => (
                    <span key={c} className="text-sm px-3 py-1.5 bg-black/50 border border-white/10 rounded-lg text-gray-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-6">
            <div className="text-center mb-5">
              <h3 className="text-xl font-bold mb-2">Don&apos;t see yours? Type it.</h3>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                If there&apos;s an online exam for it, we&apos;ll build you a track and quote you
                a price. Pricing on these is per person — it depends on the voucher, the
                timeline, and how much coaching you want.
              </p>
            </div>
            <CertRequest />
            <div className="flex flex-wrap gap-3 justify-center mt-6 pt-6 border-t border-white/10">
              <a href="/help#agents" className="px-6 py-3 border border-orange-500/40 text-orange-300 font-bold rounded-lg hover:bg-orange-500/10">
                Or talk to the Cert Qualifier — free
              </a>
              <a href="/book" className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5">
                Book a coach
              </a>
            </div>
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
              <p className="text-gray-400 text-sm leading-relaxed">We map your path to a security clearance and help position you to get <b className="text-white">sponsored by a cleared employer</b> — guidance and positioning, not a guarantee, and we don&apos;t issue clearances. Start with the Clearance Qualifier call on the help page.</p>
            </div>
            <div id="ai" className="bg-zinc-900 border border-purple-500/20 rounded-2xl p-6 scroll-mt-20">
              <div className="text-3xl mb-3">⚙️</div>
              <div className="font-bold text-lg mb-2">AI Builds &amp; Automation</div>
              <p className="text-gray-400 text-sm leading-relaxed">For businesses &amp; founders: AI integrations into your existing workflows, custom <b className="text-white">websites &amp; SaaS</b>, AI agents, and <b className="text-white">24/7 voice agents</b> so you never miss a call. Start with the Project Discovery call on the help page.</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-3">🌎</div>
              <div className="font-bold text-lg mb-2">Community + Recruiter Roster</div>
              <p className="text-gray-400 text-sm leading-relaxed">A locked-in Discord and a public roster recruiters actually scan. Weekly calls, interview prep, and job drops Mon/Wed/Fri.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="/help#agents" className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">Start with a quick AI call →</a>
          </div>
          <p className="text-gray-600 text-xs text-center mt-6 max-w-2xl mx-auto">*Pass guarantee: complete your track and the coursework — if you don&apos;t pass, we keep coaching you (retake voucher included) until you do. Full terms shared at enrollment.</p>
        </div>
      </section>
    </>
  );
}
