// PICK YOUR LANE — audience paths. Lifted out of app/page.tsx in the Aug 4 2026
// restructure so the home page reads as a list of sections rather than 400 lines
// of inline markup. The "what's inside" and "AI builds" targets moved to
// /certifications, so these anchors are now cross-page links.
export default function WhoItsFor() {
  return (
    <section id="who" className="bg-black py-20 border-t border-white/5 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-orange-500 font-bold tracking-widest text-sm mb-4 text-center">WHO IT&apos;S FOR</div>
        <h2 className="text-4xl md:text-5xl font-black mb-4 text-center">Pick your lane.</h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto text-center mb-12">Cleared, commercial, hiring, or building — ROT meets you where you are.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <a href="/certifications#inside" className="block bg-zinc-900 border border-green-500/20 rounded-2xl p-6 hover:border-green-500/50 transition">
            <div className="text-3xl mb-3">🛡️</div>
            <div className="font-bold text-lg mb-2">Cleared professionals</div>
            <p className="text-gray-400 text-sm">Already hold a clearance? Jump to cleared roles, cert upkeep, and the recruiter roster. We keep you moving on-site.</p>
          </a>
          <a href="/certifications#inside" className="block bg-zinc-900 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition">
            <div className="text-3xl mb-3">🚀</div>
            <div className="font-bold text-lg mb-2">Aspiring &amp; commercial pros</div>
            <p className="text-gray-400 text-sm">Breaking in or leveling up in commercial tech. Cert tracks (self-paced or live cohort), AI tutor, resume + interview prep — clearance optional.</p>
          </a>
          <a href="/roster" className="block bg-zinc-900 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="text-3xl mb-3">🧭</div>
            <div className="font-bold text-lg mb-2">Recruiters &amp; hiring managers</div>
            <p className="text-gray-400 text-sm">Scan a vetted public roster of cleared and commercial talent ready to interview. Reach out direct.</p>
          </a>
          <a href="/certifications#ai" className="block bg-zinc-900 border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition">
            <div className="text-3xl mb-3">🤝</div>
            <div className="font-bold text-lg mb-2">Businesses &amp; founders</div>
            <p className="text-gray-400 text-sm">CEOs and entrepreneurs: automate your processes, get a website or SaaS built, and deploy AI + 24/7 voice agents so you never miss a call.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
