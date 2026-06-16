"use client";

// InteractiveLesson — turns a flat lesson HTML string (from LESSONS[id]) into a
// guided, click-through experience: section slideshow + tap-to-flip concept cards,
// tap-to-reveal pitfalls, and an active-recall cheat sheet. Pure client React +
// Tailwind (no DOM parsing on the server — string parsing only, SSR-safe).

import { useMemo, useState } from "react";

type Section = {
  title: string;
  kind: "intro" | "concepts" | "pitfalls" | "cheatsheet" | "realworld" | "prose";
  paras: string[];
  items: string[];
};

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function kindOf(title: string): Section["kind"] {
  const t = title.toUpperCase();
  if (t.includes("CONCEPT")) return "concepts";
  if (t.includes("PITFALL")) return "pitfalls";
  if (t.includes("CHEAT")) return "cheatsheet";
  if (t.includes("REAL WORLD")) return "realworld";
  if (t.includes("WHAT THIS")) return "intro";
  return "prose";
}

function parseLesson(html: string): Section[] {
  const chunks = html.split(/<h3>/i).slice(1);
  const out: Section[] = [];
  for (const chunk of chunks) {
    const m = chunk.match(/^([\s\S]*?)<\/h3>([\s\S]*)$/);
    if (!m) continue;
    const title = decode(m[1]);
    const body = m[2];
    const items = [...body.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((x) => x[1]);
    const paras = [...body.matchAll(/<p>([\s\S]*?)<\/p>/gi)].map((x) => decode(x[1]));
    out.push({ title, kind: kindOf(title), paras, items });
  }
  return out;
}

// Concept li: "<strong>Term</strong> — definition"
function splitConcept(li: string): { term: string; def: string } {
  const m = li.match(/<strong>([\s\S]*?)<\/strong>\s*[—–-]\s*([\s\S]*)/i);
  if (m) return { term: decode(m[1]), def: decode(m[2]) };
  return { term: decode(li), def: "" };
}
// Cheat li: "key = value"
function splitCheat(li: string): { key: string; val: string } {
  const t = decode(li);
  const i = t.indexOf(" = ");
  return i >= 0 ? { key: t.slice(0, i), val: t.slice(i + 3) } : { key: t, val: "" };
}
// Pitfall li: "Headline. the rest..."
function splitPitfall(li: string): { head: string; detail: string } {
  const t = decode(li);
  const i = t.indexOf(". ");
  return i >= 0 ? { head: t.slice(0, i + 1), detail: t.slice(i + 2) } : { head: t, detail: "" };
}

export default function InteractiveLesson({ html }: { html: string }) {
  const sections = useMemo(() => parseLesson(html), [html]);
  const [step, setStep] = useState(0);
  const [vis, setVis] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  if (!sections.length) {
    return <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6" dangerouslySetInnerHTML={{ __html: html }} />;
  }

  const n = sections.length;
  const sec = sections[step];
  const go = (next: number) => {
    if (next < 0 || next >= n || next === step) return;
    setVis(false);
    setTimeout(() => { setStep(next); setVis(true); }, 140);
  };
  const toggle = (key: string) =>
    setRevealed((prev) => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });

  const revealedCount = sec.items.filter((_, i) => revealed.has(`${step}-${i}`)).length;

  return (
    <div className="bg-zinc-900 border border-orange-500/30 rounded-xl overflow-hidden mb-6">
      {/* progress bar */}
      <div className="h-1.5 bg-black/40">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${((step + 1) / n) * 100}%` }} />
      </div>

      <div className="p-6">
        {/* header: dots + step counter */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">
            {sections.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to section ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-orange-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-gray-500">{step + 1} / {n}</span>
        </div>

        <div className={`transition-opacity duration-150 ${vis ? "opacity-100" : "opacity-0"}`}>
          <h3 className="text-xl font-black text-white mb-4">{sec.title}</h3>

          {/* prose / intro / real world */}
          {(sec.kind === "intro" || sec.kind === "prose" || sec.kind === "realworld") && (
            <div className="space-y-3">
              {sec.paras.map((p, i) => (
                <p key={i} className="text-gray-300 leading-relaxed">{p}</p>
              ))}
            </div>
          )}

          {/* KEY CONCEPTS — tap to flip */}
          {sec.kind === "concepts" && (
            <>
              <p className="text-xs text-orange-400/80 mb-3">Tap a card to flip it · {revealedCount}/{sec.items.length} revealed</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((li, i) => {
                  const { term, def } = splitConcept(li);
                  const open = revealed.has(`${step}-${i}`);
                  return (
                    <button
                      key={i}
                      onClick={() => toggle(`${step}-${i}`)}
                      className="text-left h-36 w-full"
                      style={{ perspective: "1000px" }}
                    >
                      <div
                        className="relative h-full w-full transition-transform duration-500"
                        style={{ transformStyle: "preserve-3d", transform: open ? "rotateY(180deg)" : "" }}
                      >
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-black/40 p-4 hover:border-orange-500/50"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <span className="text-base font-bold text-orange-400 text-center">{term}</span>
                          <span className="mt-2 text-[11px] uppercase tracking-wide text-gray-500">tap to reveal</span>
                        </div>
                        <div
                          className="absolute inset-0 overflow-y-auto rounded-xl border border-orange-500/40 bg-orange-500/5 p-4"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <span className="text-xs font-bold text-orange-400">{term}</span>
                          <p className="mt-1 text-sm text-gray-200 leading-snug">{def}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* PITFALLS — tap to reveal the fix */}
          {sec.kind === "pitfalls" && (
            <div className="space-y-3">
              {sec.items.map((li, i) => {
                const { head, detail } = splitPitfall(li);
                const open = revealed.has(`${step}-${i}`);
                return (
                  <button
                    key={i}
                    onClick={() => toggle(`${step}-${i}`)}
                    className="block w-full text-left rounded-xl border border-white/10 bg-black/40 p-4 hover:border-red-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-red-500">✕</span>
                      <span className="font-semibold text-white">{head}</span>
                    </div>
                    <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] mt-2 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden text-sm text-gray-300 pl-6">{detail || "—"}</p>
                    </div>
                    {!open && <span className="mt-1 block pl-6 text-[11px] uppercase tracking-wide text-gray-500">tap to see why</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* CHEAT SHEET — active recall, tap to reveal the answer */}
          {sec.kind === "cheatsheet" && (
            <>
              <p className="text-xs text-orange-400/80 mb-3">Quiz yourself — tap to reveal · {revealedCount}/{sec.items.length}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((li, i) => {
                  const { key, val } = splitCheat(li);
                  const open = revealed.has(`${step}-${i}`);
                  return (
                    <button
                      key={i}
                      onClick={() => toggle(`${step}-${i}`)}
                      className={`text-left rounded-xl border p-4 transition-all ${open ? "border-orange-500/50 bg-orange-500/5" : "border-white/10 bg-black/40 hover:border-orange-500/40"}`}
                    >
                      <div className="text-sm font-bold text-white">{key}</div>
                      {open ? (
                        <div className="mt-1 text-sm text-orange-300">{val || "✓"}</div>
                      ) : (
                        <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">tap to reveal</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* nav */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700"
          >
            ← Back
          </button>
          {step < n - 1 ? (
            <button onClick={() => go(step + 1)} className="px-5 py-2 rounded-lg text-sm font-bold text-black bg-orange-500 hover:bg-orange-400">
              Next →
            </button>
          ) : (
            <span className="text-sm font-semibold text-green-400">✓ Lesson complete — start the quiz below ↓</span>
          )}
        </div>
      </div>
    </div>
  );
}
