// PICK YOUR LANE — audience paths. Lifted out of app/page.tsx in the Aug 4 2026
// restructure so the home page reads as a list of sections rather than 400 lines
// of inline markup. The "what's inside" and "AI builds" targets moved to
// /certifications, so these anchors are now cross-page links.
export default function WhoItsFor() {
  return (
    <section id="who" className="bg-rot-bg py-24 md:py-32 border-t border-rot-line scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rot-kicker mb-6 text-center">Who it&apos;s for</div>
        <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-center leading-[0.98]">Pick your lane.</h2>
        <p className="text-rot-muted text-lg max-w-2xl mx-auto text-center mb-16 leading-relaxed">Cleared, commercial, hiring, or building — ROT meets you where you are.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-rot-line border border-rot-line">
          <a href="/certifications#inside" className="block bg-rot-surface p-8 hover:bg-rot-sunken transition-colors group">
            <div className="text-2xl mb-5 opacity-60 group-hover:opacity-100 transition-opacity">🛡️</div>
            <div className="font-semibold text-lg mb-3">Cleared professionals</div>
            <p className="text-rot-muted text-sm leading-relaxed">Already hold a clearance? Jump to cleared roles, cert upkeep, and the recruiter roster. We keep you moving on-site.</p>
          </a>
          <a href="/certifications#inside" className="block bg-rot-surface p-8 hover:bg-rot-sunken transition-colors group">
            <div className="text-2xl mb-5 opacity-60 group-hover:opacity-100 transition-opacity">🚀</div>
            <div className="font-semibold text-lg mb-3">Aspiring &amp; commercial pros</div>
            <p className="text-rot-muted text-sm leading-relaxed">Breaking in or leveling up in commercial tech. Cert tracks (self-paced or live cohort), AI tutor, resume + interview prep — clearance optional.</p>
          </a>
          <a href="/roster" className="block bg-rot-surface p-8 hover:bg-rot-sunken transition-colors group">
            <div className="text-2xl mb-5 opacity-60 group-hover:opacity-100 transition-opacity">🧭</div>
            <div className="font-semibold text-lg mb-3">Recruiters &amp; hiring managers</div>
            <p className="text-rot-muted text-sm leading-relaxed">Scan a vetted public roster of cleared and commercial talent ready to interview. Reach out direct.</p>
          </a>
          <a href="/certifications#ai" className="block bg-rot-surface p-8 hover:bg-rot-sunken transition-colors group">
            <div className="text-2xl mb-5 opacity-60 group-hover:opacity-100 transition-opacity">🤝</div>
            <div className="font-semibold text-lg mb-3">Businesses &amp; founders</div>
            <p className="text-rot-muted text-sm leading-relaxed">CEOs and entrepreneurs: automate your processes, get a website or SaaS built, and deploy AI + 24/7 voice agents so you never miss a call.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
