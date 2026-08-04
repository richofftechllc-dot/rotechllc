"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Me = { ok: true; code: string; name: string } | { ok: false };

// Public nav mirrors the Aug 4 2026 route split, so the top-level sections of the
// site are visible instead of buried in one long scroll. Pricing, Sundays and the
// bot command reference are still reachable — they are linked from /help and
// /membership rather than each taking a top-level slot, because eleven desktop
// links wrapped the bar.
const LINKS: Array<{ href: string; label: string; external?: boolean; authOnly?: boolean }> = [
  { href: "/home", label: "Home", authOnly: true },
  { href: "/plan", label: "My Plan", authOnly: true },
  { href: "/account", label: "Profile", authOnly: true },
  { href: "/quiz", label: "Quiz", authOnly: true },
  { href: "/resume", label: "Resume", authOnly: true },
  { href: "/certifications", label: "What We Offer" },
  { href: "/membership", label: "Membership" },
  { href: "/roster", label: "Community" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
  { href: "https://discord.gg/dtcYf8PTNa", label: "Discord", external: true },
];

export default function Nav() {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  // Quiz + Resume only show once signed in.
  const visibleLinks = LINKS.filter(l => !l.authOnly || (me !== null && me.ok));

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-40 bg-rot-bg/80 backdrop-blur-xl border-b border-rot-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/bo-avatar.png" alt="ROT" width={36} height={36} className="rounded-full" />
          <span className="font-semibold tracking-tight text-rot-fg">Rich Off Tech</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-7 text-sm text-rot-muted">
          {visibleLinks.map(l => l.external ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="hover:text-rot-fg transition-colors">{l.label}</a>
          ) : (
            <Link key={l.href} href={l.href} className="hover:text-rot-fg transition-colors">{l.label}</Link>
          ))}
          {me === null ? (
            <span className="px-4 py-2 text-gray-500">…</span>
          ) : me.ok ? (
            <div className="flex items-center gap-3">
              <span className="text-rot-fg font-medium">{me.name}</span>
              <button onClick={logout} className="px-3 py-1.5 text-xs text-rot-muted hover:text-rot-fg border border-rot-line hover:border-rot-line-strong transition">Sign Out</button>
            </div>
          ) : (
            <Link href="/login" className="rot-btn px-5 py-2 text-sm">Sign In</Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 -mr-2"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* MOBILE DROPDOWN — drops down below the nav bar, 2-col grid so all 8 links fit on screen */}
      {open && (
        <div
          className="md:hidden absolute inset-x-0 top-full border-t border-rot-line shadow-2xl"
          style={{ backgroundColor: "var(--rot-bg)" }}
        >
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              {visibleLinks.map(l => l.external ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  onClick={() => setOpen(false)}
                  className="bg-rot-surface border border-rot-line px-4 py-4 text-rot-fg font-medium text-base flex items-center justify-between active:border-rot-line-strong"
                >
                  {l.label}
                  <span className="text-rot-faint">↗</span>
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="bg-rot-surface border border-rot-line px-4 py-4 text-rot-fg font-medium text-base active:border-rot-line-strong"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-3">
              {me === null ? (
                <div className="text-gray-500 text-sm text-center py-2">Loading…</div>
              ) : me.ok ? (
                <div className="flex items-center justify-between gap-3 bg-rot-surface border border-rot-line px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-rot-fg font-medium text-sm truncate">{me.name}</div>
                    <div className="text-rot-faint text-xs truncate">{me.code}</div>
                  </div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="rot-btn-ghost px-4 py-2 text-sm whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rot-btn block w-full py-4 text-base"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
