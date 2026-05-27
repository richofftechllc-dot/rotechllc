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

const benefits = [
  "Full Discord access", "The Roster (recruiter-visible)", "Weekly meetings with the community",
  "Full quiz system (Discord + web)", "Free 30-min 1-on-1 strategy call with Bo",
  "24/7 Bo Tech AI agent", "Cert roadmaps for 10+ certifications", "Clearance pathway guidance",
  "Real project portfolio guidance", "Resume rebuild intake", "Salary intel database", "Job drops + community wins",
];

export default async function Pricing() {
  const count = await getMemberCount();
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-5xl md:text-7xl font-black text-center mb-4">Everything You Get<br /><span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">For $96 / 12 Months.</span></h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Founding Member rate locked for the full 12 months. After 100 spots fill, price moves up.</p>
      <div className="border-2 border-orange-500/30 rounded-2xl p-8 md:p-12 relative">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs font-bold tracking-wider">FOUNDING MEMBER</div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ul className="space-y-3">
            {benefits.map(b => <li key={b} className="flex gap-3 text-gray-300"><span className="text-green-500">✓</span>{b}</li>)}
          </ul>
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-8 text-center">
            <div className="text-7xl font-black text-orange-500">$96</div>
            <div className="text-gray-500 text-sm mb-6">for 12 months</div>
            <a href="https://square.link/u/7P6knSUK" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg">Lock In Founding</a>
            <div className="text-green-500 text-sm mt-4">● {count} / 100 spots claimed</div>
            <div className="text-gray-500 text-xs mt-2 italic">After 100 fill, price moves up to monthly tier.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
