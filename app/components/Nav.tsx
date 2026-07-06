"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Me = { ok: true; code: string; name: string } | { ok: false };

const LINKS: Array<{ href: string; label: string; external?: boolean; authOnly?: boolean }> = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "My Plan", authOnly: true },
  { href: "/account", label: "Profile", authOnly: true },
  { href: "/roster", label: "Community" },
  { href: "/#about", label: "About" },
  { href: "/quiz", label: "Quiz", authOnly: true },
  { href: "/resume", label: "Resume", authOnly: true },
  { href: "/calls", label: "Sundays" },
  { href: "/pricing", label: "Pricing" },
  { href: "/commands", label: "Bot" },
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
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/bo-avatar.png" alt="ROT" width={36} height={36} className="rounded-full" />
          <span className="font-bold tracking-tight text-orange-500">ROT</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          {visibleLinks.map(l => l.external ? (
            <a key={l.href} href={l.href} target="_blank" rel="noopener" className="hover:text-white">{l.label}</a>
          ) : (
            <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>
          ))}
          {me === null ? (
            <span className="px-4 py-2 text-gray-500">…</span>
          ) : me.ok ? (
            <div className="flex items-center gap-3">
              <span className="text-orange-500 font-semibold">{me.name}</span>
              <button onClick={logout} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded">Sign Out</button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200">Sign In</Link>
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
          className="md:hidden absolute inset-x-0 top-full border-t border-orange-500/30 shadow-2xl"
          style={{ backgroundColor: "#09090b" }}
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
                  className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-base flex items-center justify-between active:bg-orange-500/20 active:border-orange-500"
                >
                  {l.label}
                  <span className="text-orange-500">↗</span>
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-base active:bg-orange-500/20 active:border-orange-500"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-3">
              {me === null ? (
                <div className="text-gray-500 text-sm text-center py-2">Loading…</div>
              ) : me.ok ? (
                <div className="flex items-center justify-between gap-3 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3">
                  <div className="min-w-0">
                    <div className="text-orange-500 font-bold text-sm truncate">{me.name}</div>
                    <div className="text-gray-500 text-xs truncate">{me.code}</div>
                  </div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="px-4 py-2 text-sm text-white border border-white/15 rounded-lg active:bg-white/10 whitespace-nowrap"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl text-lg shadow-lg shadow-orange-500/30 active:scale-95 transition"
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
