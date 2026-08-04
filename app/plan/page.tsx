"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Milestone = { domainId: string; name: string; startDay: number; endDay: number; startDate: string; endDate: string; labCount: number };
type Plan = { trackId: string; trackName: string; pace: number; startDate: string; examDate: string; milestones: Milestone[] };
type TrackOpt = { id: string; name: string; domainCount: number };
type Resp = { ok: boolean; name?: string; trackId?: string; pace?: number; saved?: boolean; coachSet?: boolean; tracks?: TrackOpt[]; plan?: Plan | null };

const PACES = [30, 60, 90];

function fmt(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

export default function PlanPage() {
  const [data, setData] = useState<Resp | null>(null);
  const [busy, setBusy] = useState(false);
  const [previewTrack, setPreviewTrack] = useState<string>("");
  const [previewPace, setPreviewPace] = useState<number>(0);

  const load = useCallback(async (qs = "") => {
    const r = await fetch("/api/plan" + qs, { cache: "no-store" });
    if (r.status === 401) { window.location.href = "/login?from=/plan"; return; }
    setData(await r.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  const saved = !!data?.saved;
  const trackId = previewTrack || data?.trackId || "";
  const pace = previewPace || data?.pace || 60;

  async function choose(next: { trackId?: string; pace?: number }) {
    const nt = next.trackId ?? trackId;
    const np = next.pace ?? pace;
    setBusy(true);
    if (saved) {
      await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
      await load();
    } else {
      // No saved profile (e.g. owner preview) — recompute live via query params, don't persist.
      setPreviewTrack(nt); setPreviewPace(np);
      await load(`?trackId=${encodeURIComponent(nt)}&pace=${np}`);
    }
    setBusy(false);
  }

  if (!data) return <main className="min-h-[70vh] grid place-items-center text-rot-faint">Loading your plan…</main>;

  const plan = data.plan;

  return (
    <main className="max-w-3xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between gap-3 mb-1">
        <h1 className="text-3xl font-black">Your Certification Plan</h1>
        <Link href="/quiz" className="text-sm text-rot-accent hover:text-rot-accent">Go to Quiz →</Link>
      </div>
      <p className="text-rot-muted mb-6">
        {data.name ? `${data.name}, ` : ""}pick your pace and follow the roadmap in order — each block lines up with the quiz domain and its hands-on lab.
        {!saved && <span className="text-yellow-500"> (Preview — sign in as a member to save your dates.)</span>}
      </p>

      {/* TRACK PICKER */}
      {(!trackId || (data.tracks && data.tracks.length > 1)) && (
        <div className="mb-5">
          <div className="text-xs uppercase tracking-wider text-rot-faint mb-2">Certification</div>
          <div className="flex flex-wrap gap-2">
            {data.tracks?.map((t) => (
              <button key={t.id} onClick={() => choose({ trackId: t.id })} disabled={busy}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${trackId === t.id ? "bg-orange-500 border-orange-500 text-rot-fg" : "bg-rot-surface border-rot-line text-rot-muted hover:border-rot-line-strong"}`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PACE TOGGLE */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider text-rot-faint mb-2 flex items-center gap-2">
          How fast? {data.coachSet && <span className="text-rot-accent normal-case tracking-normal">· set by your coach — you can change it</span>}
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {PACES.map((p) => (
            <button key={p} onClick={() => choose({ pace: p })} disabled={busy}
              className={`py-3 rounded-xl font-black border transition ${pace === p ? "bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white" : "bg-rot-surface border-rot-line text-rot-muted hover:border-rot-line-strong"}`}>
              {p}<span className="block text-[11px] font-medium opacity-80">days</span>
            </button>
          ))}
        </div>
      </div>

      {/* ROADMAP */}
      {plan ? (
        <div>
          <div className="flex items-center justify-between bg-rot-surface border border-rot-line rounded-xl px-4 py-3 mb-4">
            <div><div className="text-xs text-rot-faint uppercase tracking-wider">Track</div><div className="font-bold">{plan.trackName}</div></div>
            <div className="text-right"><div className="text-xs text-rot-faint uppercase tracking-wider">🎯 Exam target</div><div className="font-bold text-rot-accent">{fmt(plan.examDate)}</div></div>
          </div>

          <ol className="relative border-l border-rot-line ml-3">
            {plan.milestones.map((m, i) => (
              <li key={m.domainId} className="mb-4 ml-5">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-orange-500 rounded-full text-black text-xs font-black">{i + 1}</span>
                <div className="bg-rot-surface border border-rot-line rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">{m.name}</div>
                    <div className="text-xs text-rot-muted whitespace-nowrap">{fmt(m.startDate)} – {fmt(m.endDate)}</div>
                  </div>
                  <div className="text-xs text-rot-faint mt-0.5">Days {m.startDay}–{m.endDay}</div>
                  <div className="flex gap-2 mt-2">
                    <Link href="/quiz" className="text-xs px-2.5 py-1 rounded-md bg-rot-sunken border border-rot-line hover:border-orange-500 text-gray-200">📚 Study + Quiz</Link>
                    {m.labCount > 0 && <Link href="/lab" className="text-xs px-2.5 py-1 rounded-md bg-rot-sunken border border-rot-line hover:border-orange-500 text-gray-200">🧪 Lab ({m.labCount})</Link>}
                  </div>
                </div>
              </li>
            ))}
            <li className="ml-5">
              <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full text-black text-xs">🎯</span>
              <div className="text-sm font-bold text-emerald-600">Sit the exam — {fmt(plan.examDate)}</div>
            </li>
          </ol>
        </div>
      ) : (
        <div className="text-rot-muted bg-rot-surface border border-rot-line rounded-xl p-6 text-center">Pick a certification above to see your dated roadmap.</div>
      )}
    </main>
  );
}
