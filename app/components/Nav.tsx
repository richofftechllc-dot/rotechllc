"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Me = { ok: true; code: string; name: string } | { ok: false };

const LINKS: Array<{ href: string; label: string; external?: boolean }> = [
  { href: "/roster", label: "Community" },
  { href: "/#about", label: "About" },
  { href: "/quiz", label: "Quiz" },
  { href: "/resume", label: "Resume" },
  { href: "/calls", label: "Sundays" },
  { href: "/pricing", label: "Pricing" },
  { href: "/commands", label: "Bot" },
  { href: "https://discord.gg/3gFdWYtPB", label: "Discord", external: true },
];

export default function Nav() {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);

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
          {LINKS.map(l => l.external ? (
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

      {/* MOBILE DRAWER */}
      <div
        className={`md:hidden fixed inset-x-0 top-[68px] bottom-0 bg-black/95 backdrop-blur-xl transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={() => setOpen(false)}
      >
        <div className="max-w-md mx-auto px-6 py-8 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
          {LINKS.map(l => l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-white py-3 border-b border-white/5 flex items-center justify-between"
            >
              {l.label}
              <span className="text-orange-500 text-sm">↗</span>
            </a>
          ) : (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-white py-3 border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-8">
            {me === null ? (
              <div className="text-gray-500 text-sm">Loading…</div>
            ) : me.ok ? (
              <div className="flex items-center justify-between gap-3 bg-zinc-900 border border-white/10 rounded-xl p-4">
                <div>
                  <div className="text-orange-500 font-bold">{me.name}</div>
                  <div className="text-gray-500 text-xs">{me.code}</div>
                </div>
                <button
                  onClick={() => { logout(); setOpen(false); }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl text-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
