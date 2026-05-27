"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

type Me = { ok: true; code: string; name: string } | { ok: false };

export default function Nav() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/bo-avatar.png" alt="ROT" width={36} height={36} className="rounded-full" />
          <span className="font-bold tracking-tight text-orange-500">ROT</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/roster" className="hover:text-white">Community</Link>
          <Link href="/quiz" className="hover:text-white">Quiz</Link>
          <Link href="/calls" className="hover:text-white">Sundays</Link>
          <Link href="/pricing" className="hover:text-white">Pricing</Link>
          <Link href="/commands" className="hover:text-white">Bot</Link>
          <a href="https://discord.gg/3gFdWYtPB" target="_blank" rel="noopener" className="hover:text-white">Discord</a>
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
      </div>
    </nav>
  );
}
