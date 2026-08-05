import type { Metadata } from "next";
import Reveal from "../components/Reveal";
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
        <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">WHAT WE OFFER</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4">Certifications, coached.</h1>
        <p className="text-rot-muted text-lg max-w-2xl mx-auto">
          Pick a track, get the voucher, and work the system with a coach and an AI tutor
          until you pass. Security+ and ServiceNow CSA are what most people come for —
          but if you can sit it online, we coach it.
        </p>
      </section>

      <Reveal><Offers showDiscord={false} /></Reveal>

      {/* THE REST OF THE CATALOG — coached, but priced per person by a coach, so no
          price and no checkout button. Inventing either would be a chargeback or a
          payment the bot can't route. */}
      <section id="catalog" className="bg-rot-bg py-20 border-t border-rot-line scroll-mt-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">EVERYTHING ELSE</div>
            <h2 className="text-4xl md:text-5xl font-black mb-3">If you can sit it online, we coach it.</h2>
            <p className="text-rot-muted text-lg max-w-2xl mx-auto">
              Security+ and CSA are the two with instant checkout above because they&apos;re
              what people buy. Everything here runs the same system — voucher, quiz engine,
              study plan, a coach — priced for your situation. These are the common ones,
              not the whole list.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {CERT_CATALOG.map((g) => (
              <div key={g.group} className="bg-rot-surface border border-rot-line rounded-2xl p-6">
                <div className="text-rot-accent font-bold tracking-widest text-xs mb-4 uppercase">{g.group}</div>
                <div className="flex flex-wrap gap-2">
                  {g.certs.map((c) => (
                    <span key={c} className="text-sm px-3 py-1.5 bg-rot-sunken border border-rot-line rounded-lg text-rot-muted">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-rot-surface border border-rot-accent/30 rounded-2xl p-6">
            <div className="text-center mb-5">
              <h3 className="text-xl font-bold mb-2">Don&apos;t see yours? Type it.</h3>
              <p className="text-rot-muted text-sm max-w-xl mx-auto">
                If there&apos;s an online exam for it, we&apos;ll build you a track and quote you
                a price. Pricing on these is per person — it depends on the voucher, the
                timeline, and how much coaching you want.
              </p>
            </div>
            <CertRequest />
            <div className="flex flex-wrap gap-3 justify-center mt-6 pt-6 border-t border-rot-line">
              <a href="/help#agents" className="px-6 py-3 border border-rot-accent/30 text-rot-accent font-bold rounded-lg hover:bg-rot-accent/10">
                Or talk to the Cert Qualifier — free
              </a>
              <a href="/membership" className="px-6 py-3 border border-rot-line-strong rounded-lg hover:bg-rot-sunken">
                Become a member
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — value-first explainer (no prices) */}
      <section id="inside" className="bg-rot-sunken py-24 border-t border-rot-line scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-rot-accent font-bold tracking-widest text-sm mb-4 text-center">WHAT YOU GET INSIDE ROT</div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-center">Everything to break into tech.</h2>
          <p className="text-rot-muted text-lg max-w-2xl mx-auto text-center mb-14">
            Not a video dump — a guided system. Self-paced or live-cohort cert tracks, a live AI tutor, your exam voucher, clearance guidance, and real project work. You move, Bo Tech moves with you.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-rot-surface border border-rot-line rounded-2xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <div className="font-bold text-lg mb-2">Cert Tracks — Self-Paced or Live Cohort</div>
              <p className="text-rot-muted text-sm leading-relaxed"><b className="text-rot-fg">CompTIA plus 200+ certs you can take online</b> (ServiceNow, AWS, Google, Microsoft &amp; more). Go <b className="text-rot-fg">self-paced</b> through the quiz-driven modules (pass 75% to unlock the next) or join a <b className="text-rot-fg">live cohort</b>. <b className="text-emerald-600">Guaranteed pass*</b> when you follow the track.</p>
              <p className="text-rot-accent text-xs font-bold mt-3">⚡ Need it fast? Accelerated sessions available.</p>
            </div>
            <div className="bg-rot-surface border border-rot-line rounded-2xl p-6">
              <div className="text-3xl mb-3">🤖</div>
              <div className="font-bold text-lg mb-2">Quiz System + Bo Tech Tutor</div>
              <p className="text-rot-muted text-sm leading-relaxed">Your access code unlocks the quiz engine at <span className="text-rot-accent">rotechllc.com/quiz</span>. <b className="text-rot-fg">Bo Tech</b> is your live AI instructor — explains every question, drafts your resume, and answers at 3 AM in Discord.</p>
            </div>
            <div className="bg-rot-surface border border-rot-line rounded-2xl p-6">
              <div className="text-3xl mb-3">🎟️</div>
              <div className="font-bold text-lg mb-2">Exam Voucher + Test-Day Setup</div>
              <p className="text-rot-muted text-sm leading-relaxed">We get you the official cert voucher and run your OnVUE setup so you walk into exam day ready — plus remote desktop sessions for tutoring and lab help. You keep and test under your own account.</p>
            </div>
            <div className="bg-rot-surface border border-emerald-600/25 rounded-2xl p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="font-bold text-lg mb-2">Clearance Guidance</div>
              <p className="text-rot-muted text-sm leading-relaxed">We map your path to a security clearance and help position you to get <b className="text-rot-fg">sponsored by a cleared employer</b> — guidance and positioning, not a guarantee, and we don&apos;t issue clearances. Start with the Clearance Qualifier call on the help page.</p>
            </div>
            <div id="ai" className="bg-rot-surface border border-purple-600/25 rounded-2xl p-6 scroll-mt-20">
              <div className="text-3xl mb-3">⚙️</div>
              <div className="font-bold text-lg mb-2">AI Builds &amp; Automation</div>
              <p className="text-rot-muted text-sm leading-relaxed">For businesses &amp; founders: AI integrations into your existing workflows, custom <b className="text-rot-fg">websites &amp; SaaS</b>, AI agents, and <b className="text-rot-fg">24/7 voice agents</b> so you never miss a call. Start with the Project Discovery call on the help page.</p>
            </div>
            <div className="bg-rot-surface border border-rot-line rounded-2xl p-6">
              <div className="text-3xl mb-3">🌎</div>
              <div className="font-bold text-lg mb-2">Community + Recruiter Roster</div>
              <p className="text-rot-muted text-sm leading-relaxed">A locked-in Discord and a public roster recruiters actually scan. Weekly calls, interview prep, and job drops Mon/Wed/Fri.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="/help#agents" className="inline-block px-6 py-3 bg-gradient-to-r from-rot-accent to-rot-accent-2 text-white font-bold rounded-lg hover:opacity-90">Start with a quick AI call →</a>
          </div>
          <p className="text-rot-faint text-xs text-center mt-6 max-w-2xl mx-auto">*Pass guarantee: complete your track and the coursework — if you don&apos;t pass, we keep coaching you (retake voucher included) until you do. Full terms shared at enrollment.</p>
        </div>
      </section>
    </>
  );
}
