"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HomeData = {
  ok: boolean;
  authType: "code" | "discord";
  isCoach?: boolean;
  name: string;
  code: string | null;
  track: string | null;
  tracks: string[];
  certs: string[];
  hasCustomer: boolean;
  access: { status: string; daysLeft: number | null; accessEnd: string; plan: string };
  progress: { done: number; total: number; avg: number | null; weak: string[]; strong: string[] };
  nextDomain: string | null;
  bookings: { coach: string; slot: string; topic: string; label: string }[];
};

function fmtSlot(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return iso; }
}

export default function MemberHome() {
  const [d, setD] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/home")
      .then(async (r) => {
        if (r.status === 401) { window.location.href = "/api/auth/discord?redirect=/home"; return; }
        const j = await r.json();
        if (j?.ok) setD(j);
      })
      .catch(() => { /* shows the fallback below */ })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <main className="min-h-screen bg-black text-white grid place-items-center"><p className="text-white/50">Loading your home…</p></main>;
  }
  if (!d) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-6 text-center">
        <div>
          <p className="text-white/60 mb-3">We couldn&apos;t load your home right now.</p>
          <Link href="/login" className="text-orange-500 underline">Log in again</Link>
        </div>
      </main>
    );
  }

  const readiness = d.progress.avg;
  const pct = d.progress.total > 0 ? Math.round((d.progress.done / d.progress.total) * 100) : 0;
  const accessLabel = d.access.status === "comp" ? "Comped access"
    : d.access.status === "canceled" ? "Canceled"
    : d.access.status === "expired" ? "Expired"
    : d.access.daysLeft !== null ? `Active · ${d.access.daysLeft}d left`
    : "Active";
  const accessColor = d.access.status === "expired" || d.access.status === "canceled"
    ? "text-red-400 border-red-500/30 bg-red-500/10"
    : d.access.daysLeft !== null && d.access.daysLeft <= 7
    ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
    : "text-green-400 border-green-500/30 bg-green-500/10";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-5 py-10">
        {/* Greeting + status */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">Your Home</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Yo, {d.name.split(" ")[0]} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            {d.isCoach && <Link href="/admin" className="text-xs px-3 py-1.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition">🛠 Coach CRM →</Link>}
            {d.track && <span className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/70">{d.track}</span>}
            <span className={`text-xs px-3 py-1.5 rounded-full border ${accessColor}`}>{accessLabel}</span>
          </div>
        </div>

        {/* Continue where you left off */}
        <Link href="/quiz" className="block rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent p-6 mb-5 hover:border-orange-500/60 transition">
          <p className="text-xs uppercase tracking-wider text-orange-400 font-bold mb-2">Continue where you left off</p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xl font-bold">{d.nextDomain ? `Next up: ${d.nextDomain.toUpperCase()}` : d.track ? `${d.track} prep` : "Start your prep"}</p>
              <p className="text-white/50 text-sm mt-1">
                {d.progress.total > 0 ? `${d.progress.done}/${d.progress.total} domains done` : "No quizzes started yet"}
                {readiness !== null ? ` · ${readiness}% avg` : ""}
              </p>
            </div>
            <span className="shrink-0 px-4 py-2 rounded-lg bg-orange-500 text-black font-bold text-sm">Resume →</span>
          </div>
          {d.progress.total > 0 && (
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          )}
        </Link>

        {/* Readiness + Upcoming */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">Exam readiness</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-orange-500">{readiness !== null ? `${readiness}%` : "—"}</span>
              <span className="text-white/50 text-sm">ready (avg score)</span>
            </div>
            {d.progress.strong.length > 0 && <p className="text-sm text-green-400 mt-3">💪 Strong: {d.progress.strong.slice(0, 3).join(", ")}</p>}
            {d.progress.weak.length > 0 && <p className="text-sm text-amber-400 mt-1">🎯 Focus: {d.progress.weak.slice(0, 3).join(", ")}</p>}
            {readiness === null && <p className="text-sm text-white/40 mt-3">Take a quiz and your readiness shows up here.</p>}
            {d.progress.weak.length > 0
              ? <Link href={`/quiz?focus=${encodeURIComponent(d.progress.weak[0])}`} className="inline-block mt-4 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition">Drill {d.progress.weak[0]} →</Link>
              : <Link href="/quiz" className="inline-block mt-4 px-3 py-1.5 rounded-lg border border-white/15 text-sm hover:bg-white/5 transition">{readiness !== null ? "Keep drilling →" : "Start a quiz →"}</Link>}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">Upcoming 1-on-1s</p>
            {d.bookings.length > 0 ? (
              <div className="space-y-2">
                {d.bookings.slice(0, 3).map((b, i) => (
                  <div key={i} className="text-sm">
                    <span className="text-white font-semibold">{fmtSlot(b.slot)}</span>
                    <span className="text-white/50"> · {b.topic || b.label || "Session"}{b.coach ? ` w/ ${b.coach}` : ""}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No sessions booked yet.</p>
            )}
            <Link href="/book" className="inline-block mt-4 px-3 py-1.5 rounded-lg bg-orange-500 text-black font-semibold text-sm hover:bg-orange-400 transition">Book a 1-on-1 →</Link>
          </div>
        </div>

        {/* Quick actions */}
        <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">Jump back in</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Action href="/bo" emoji="🦞" label="Ask Bo" sub="Your AI tutor" />
          <Action href="/quiz" emoji="📝" label="Take a quiz" sub="Drill a domain" />
          <Action href="/resume" emoji="📄" label="My resume" sub="Build / tailor" />
          <Action href="/roster" emoji="🌐" label="Roster" sub="The community" />
          <Action href="/hub" emoji="📚" label="Resources" sub="Tools & guides" />
          <Action href="/calls" emoji="🎥" label="My calls" sub="Sessions & recaps" />
        </div>

        {/* Certs */}
        {d.certs.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-2">Your certs</p>
            <div className="flex flex-wrap gap-2">
              {d.certs.map((c, i) => (
                <span key={i} className="text-sm px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Action({ href, emoji, label, sub }: { href: string; emoji: string; label: string; sub: string }) {
  return (
    <Link href={href} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-orange-500/40 hover:bg-white/[0.07] transition">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-white/40 text-xs">{sub}</div>
    </Link>
  );
}
