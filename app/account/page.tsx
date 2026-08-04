"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Me = { ok: true; code?: string | null; name?: string; track?: string | null; authType?: string } | { ok: false };

export default function Account() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me").then((r) => (r.status === 401 ? { ok: false } : r.json())).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!me) return <main className="min-h-[70vh] grid place-items-center text-rot-faint">Loading…</main>;
  if (!me.ok) { if (typeof window !== "undefined") window.location.href = "/login?from=/account"; return null; }

  const rows: [string, string][] = [
    ["Name", me.name || "Member"],
    ["Membership", "Founding Member"],
    ["Track", me.track || "General access"],
    ["Access code", me.code || "— (signed in with Discord)"],
    ["Signed in via", me.authType === "discord" ? "Discord" : "Access code"],
  ];

  return (
    <main className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-black mb-1">Your Profile</h1>
      <p className="text-rot-muted mb-6">Your Rich Off Tech account at a glance.</p>

      <div className="bg-rot-surface border border-rot-line rounded-2xl divide-y divide-white/5 mb-6">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-rot-faint text-sm">{k}</span>
            <span className="font-semibold text-right">{v}</span>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <Link href="/plan" className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl px-5 py-4 text-center">📅 My Plan / roadmap</Link>
        <Link href="/quiz" className="bg-rot-surface border border-rot-line rounded-xl px-5 py-4 text-center font-bold hover:border-rot-line-strong">📚 Quiz engine</Link>
        <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener" className="bg-rot-surface border border-rot-line rounded-xl px-5 py-4 text-center font-bold hover:border-rot-line-strong">💬 Discord</a>
        <Link href="/bo" className="bg-rot-surface border border-rot-line rounded-xl px-5 py-4 text-center font-bold hover:border-rot-line-strong">🤖 AI tutors</Link>
      </div>

      <button onClick={logout} className="text-sm text-rot-muted hover:text-rot-fg border border-rot-line rounded-lg px-4 py-2">Sign out</button>
    </main>
  );
}
