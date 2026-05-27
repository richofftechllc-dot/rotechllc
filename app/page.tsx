import Image from "next/image";
import Link from "next/link";

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
            <a href="https://square.link/u/gGNBn35n" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90">
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
        <div>
          <div className="text-5xl font-black text-orange-500">{memberCount}</div>
          <div className="text-gray-500 text-sm mt-2">Active members</div>
        </div>
        <div>
          <div className="text-5xl font-black text-orange-500">14</div>
          <div className="text-gray-500 text-sm mt-2">States represented</div>
        </div>
        <div>
          <div className="text-5xl font-black text-orange-500">4</div>
          <div className="text-gray-500 text-sm mt-2">Years zero to seven figures</div>
        </div>
      </div>
    </main>
  );
}
