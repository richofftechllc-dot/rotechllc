import Link from "next/link";
import Image from "next/image";

// TODO Bo: confirm the IG handle + LinkedIn slug below; placeholders if uncertain.
const SOCIALS = {
  instagram: "https://www.instagram.com/richofftech_/",
  linkedin:  "https://www.linkedin.com/company/rich-off-tech-llc",
  email:     "mailto:richofftechllc@gmail.com",
  discord:   "https://discord.gg/dtcYf8PTNa",
};

export default function Footer() {
  return (
    <footer className="border-t border-rot-line bg-rot-sunken py-12 mt-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          {/* The full lockup, large and quiet — the mark signs off the page
              rather than shouting at the end of it. This replaces the orange
              text wordmark: the accent is supposed to mean "this costs money",
              and spending it on a footer heading was the loudest orange on the
              page sitting furthest from anything you can buy.

              The lockup already sets "RICH OFF TECH", so the line of type that
              used to sit here would be saying it twice. */}
          <div>
            <Image
              src="/rot-lockup-ink.png"
              alt="Rich Off Tech"
              width={700}
              height={754}
              className="w-[132px] h-auto mb-5 opacity-80"
            />
            <p className="text-rot-faint text-sm leading-relaxed">
              Cleared tech. No shortcuts.<br />
              Community-led pipeline for cleared &amp; aspiring tech professionals.
            </p>
          </div>

          <div>
            <div className="text-rot-muted font-bold tracking-widest text-xs mb-4">EXPLORE</div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/roster" className="text-rot-muted hover:text-rot-fg">Community Roster</Link></li>
              <li><Link href="/quiz" className="text-rot-muted hover:text-rot-fg">Quiz Tracks</Link></li>
              <li><Link href="/resume" className="text-rot-muted hover:text-rot-fg">Resume Builder</Link></li>
              <li><Link href="/pricing" className="text-rot-muted hover:text-rot-fg">Pricing</Link></li>
              <li><Link href="/calls" className="text-rot-muted hover:text-rot-fg">Sunday Calls</Link></li>
              <li><Link href="/commands" className="text-rot-muted hover:text-rot-fg">Bo Tech Commands</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-rot-muted font-bold tracking-widest text-xs mb-4">CONNECT</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className="text-rot-muted hover:text-rot-fg inline-flex items-center gap-2">
                  <span aria-hidden>📷</span> Instagram
                </a>
              </li>
              <li>
                <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" className="text-rot-muted hover:text-rot-fg inline-flex items-center gap-2">
                  <span aria-hidden>💼</span> LinkedIn
                </a>
              </li>
              <li>
                <a href={SOCIALS.email} className="text-rot-muted hover:text-rot-fg inline-flex items-center gap-2">
                  <span aria-hidden>✉️</span> richofftechllc@gmail.com
                </a>
              </li>
              <li>
                <a href={SOCIALS.discord} target="_blank" rel="noopener noreferrer" className="text-rot-muted hover:text-rot-fg inline-flex items-center gap-2">
                  <span aria-hidden>💬</span> Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rot-line mt-10 pt-6 text-xs text-rot-faint flex flex-wrap items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} Rich Off Tech LLC · Est. January 2025 · Randy Allen, Founder</div>
          <div>Bo Tech &amp; ROT Discord · Launched April 10, 2026</div>
        </div>
      </div>
    </footer>
  );
}
