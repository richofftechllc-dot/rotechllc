import Link from "next/link";

// TODO Bo: confirm the IG handle + LinkedIn slug below; placeholders if uncertain.
const SOCIALS = {
  instagram: "https://www.instagram.com/richofftech_/",
  linkedin:  "https://www.linkedin.com/company/rich-off-tech-llc",
  email:     "mailto:richofftechllc@gmail.com",
  discord:   "https://discord.gg/3gFdWYtPB",
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950 py-12 mt-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="font-black text-xl mb-2"><span className="text-orange-500">Rich Off Tech</span></div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Cleared tech. No shortcuts.<br />
              Community-led pipeline for cleared &amp; aspiring tech professionals.
            </p>
          </div>

          <div>
            <div className="text-gray-400 font-bold tracking-widest text-xs mb-4">EXPLORE</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/roster" className="text-gray-400 hover:text-white">Community Roster</Link></li>
              <li><Link href="/quiz" className="text-gray-400 hover:text-white">Quiz Tracks</Link></li>
              <li><Link href="/resume" className="text-gray-400 hover:text-white">Resume Builder</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              <li><Link href="/calls" className="text-gray-400 hover:text-white">Sunday Calls</Link></li>
              <li><Link href="/commands" className="text-gray-400 hover:text-white">Bo Tech Commands</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-gray-400 font-bold tracking-widest text-xs mb-4">CONNECT</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-2">
                  <span aria-hidden>📷</span> Instagram
                </a>
              </li>
              <li>
                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-2">
                  <span aria-hidden>💼</span> LinkedIn
                </a>
              </li>
              <li>
                <a href={SOCIALS.email} className="text-gray-400 hover:text-white inline-flex items-center gap-2">
                  <span aria-hidden>✉️</span> richofftechllc@gmail.com
                </a>
              </li>
              <li>
                <a href={SOCIALS.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white inline-flex items-center gap-2">
                  <span aria-hidden>💬</span> Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Rich Off Tech LLC · Randy Allen, Founder</div>
          <div>Bo Tech &amp; ROT Discord · Founded April 10, 2026</div>
        </div>
      </div>
    </footer>
  );
}
