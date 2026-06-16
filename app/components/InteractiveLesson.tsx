"use client";

// InteractiveLesson — turns a flat lesson HTML string (LESSONS[id]) into a guided,
// ADHD-friendly click-through: section slideshow, tap-to-flip concept cards (with
// real ServiceNow UI icons + a labeled mock instance), tap-to-reveal pitfalls, and
// an active-recall cheat sheet. Pure client React + Tailwind, SSR-safe (string
// parsing only — no DOM on the server).

import { useEffect, useMemo, useState } from "react";

type Section = {
  title: string;
  kind: "intro" | "concepts" | "pitfalls" | "cheatsheet" | "realworld" | "prose";
  paras: string[];
  items: string[];
};

function decode(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
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
    const items = [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/gi)].map((x) => x[1]);
    const paras = [...m[2].matchAll(/<p>([\s\S]*?)<\/p>/gi)].map((x) => decode(x[1]));
    const title = decode(m[1]);
    out.push({ title, kind: kindOf(title), paras, items });
  }
  return out;
}

function splitConcept(li: string): { term: string; def: string } {
  const m = li.match(/<strong>([\s\S]*?)<\/strong>\s*[—–-]\s*([\s\S]*)/i);
  if (m) return { term: decode(m[1]), def: decode(m[2]) };
  const t = decode(li);
  const i = t.search(/\s[—–-]\s/);
  return i >= 0 ? { term: t.slice(0, i), def: t.slice(i + 3) } : { term: t, def: "" };
}
function splitCheat(li: string): { key: string; val: string } {
  const t = decode(li);
  const i = t.indexOf(" = ");
  return i >= 0 ? { key: t.slice(0, i).trim(), val: t.slice(i + 3).trim() } : { key: t, val: "" };
}
function splitPitfall(li: string): { head: string; detail: string } {
  const t = decode(li);
  const i = t.indexOf(". ");
  return i >= 0 ? { head: t.slice(0, i + 1), detail: t.slice(i + 2) } : { head: t, detail: "" };
}

// ─── ServiceNow UI icons (inline SVG, inherit currentColor) ───────────────
function iconNameFor(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("hamburger")) return "menu";
  if (t.includes("gear")) return "gear";
  if (t.includes("navigator")) return "nav";
  if (t.includes("content frame")) return "panel";
  if (t.includes("banner")) return "banner";
  if (t.includes("favorite") || t.includes("star")) return "star";
  if (t.includes("history") || t.includes("clock")) return "clock";
  if (t.includes("service portal") || t.includes("portal")) return "portal";
  if (t.includes("impersonate")) return "impersonate";
  if (t.includes("polaris") || t.includes("next experience")) return "sparkle";
  if (t.includes("filter") || t.includes("search")) return "search";
  if (t.includes("new tab")) return "tab";
  return null;
}

function UIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "menu": return <svg viewBox="0 0 24 24" className={className}><line x1="4" y1="7" x2="20" y2="7" {...p} /><line x1="4" y1="12" x2="20" y2="12" {...p} /><line x1="4" y1="17" x2="20" y2="17" {...p} /></svg>;
    case "gear": return <svg viewBox="0 0 24 24" className={className}><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19" {...p} /></svg>;
    case "star": return <svg viewBox="0 0 24 24" className={className}><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17.9 6.7 19.6l1-5.8L3.5 9.7l5.9-.9z" {...p} /></svg>;
    case "clock": return <svg viewBox="0 0 24 24" className={className}><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 7.5V12l3 2" {...p} /></svg>;
    case "nav": return <svg viewBox="0 0 24 24" className={className}><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><line x1="9" y1="4" x2="9" y2="20" {...p} /><line x1="5" y1="8" x2="7" y2="8" {...p} /><line x1="5" y1="12" x2="7" y2="12" {...p} /></svg>;
    case "panel": return <svg viewBox="0 0 24 24" className={className}><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><line x1="9" y1="4" x2="9" y2="20" {...p} /><line x1="12" y1="9" x2="18" y2="9" {...p} /><line x1="12" y1="13" x2="18" y2="13" {...p} /></svg>;
    case "banner": return <svg viewBox="0 0 24 24" className={className}><rect x="3" y="4" width="18" height="16" rx="2" {...p} /><line x1="3" y1="9" x2="21" y2="9" {...p} /><circle cx="6.5" cy="6.5" r=".9" fill="currentColor" stroke="none" /></svg>;
    case "portal": return <svg viewBox="0 0 24 24" className={className}><circle cx="12" cy="12" r="8.5" {...p} /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" {...p} /></svg>;
    case "impersonate": return <svg viewBox="0 0 24 24" className={className}><circle cx="9" cy="8" r="3" {...p} /><path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" {...p} /><path d="M16 8h5m0 0-2-2m2 2-2 2" {...p} /></svg>;
    case "sparkle": return <svg viewBox="0 0 24 24" className={className}><path d="M12 3l1.8 5L19 9.8 14 12l-2 5-2-5-5-2.2 5.2-1.8z" {...p} /></svg>;
    case "search": return <svg viewBox="0 0 24 24" className={className}><circle cx="10.5" cy="10.5" r="6" {...p} /><line x1="15" y1="15" x2="20" y2="20" {...p} /></svg>;
    case "tab": return <svg viewBox="0 0 24 24" className={className}><rect x="4" y="6" width="16" height="13" rx="2" {...p} /><path d="M14 3h7v7M21 3l-8 8" {...p} /></svg>;
    default: return null;
  }
}

// ─── Labeled mock of a ServiceNow instance (the "real demo") ──────────────
function ServiceNowMock() {
  return (
    <div className="mb-5 rounded-xl border border-white/10 bg-gradient-to-b from-zinc-950 to-black p-3">
      <p className="mb-2 text-[11px] uppercase tracking-wide text-gray-500">This is what an instance actually looks like ↓</p>
      {/* Banner */}
      <div className="flex items-center gap-2 rounded-t-lg bg-zinc-800 px-3 py-2 text-gray-200 ring-1 ring-orange-500/30">
        <UIcon name="menu" className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-bold text-white">now<span className="text-orange-400">.</span></span>
        <div className="ml-2 flex flex-1 items-center gap-1 rounded bg-zinc-900 px-2 py-1 text-[11px] text-gray-500"><UIcon name="search" className="w-3 h-3" />Search</div>
        <UIcon name="gear" className="w-4 h-4 text-orange-400" />
        <div className="h-5 w-5 rounded-full bg-orange-500/80" />
      </div>
      <div className="flex">
        {/* Navigator */}
        <div className="w-2/5 rounded-bl-lg bg-zinc-900 p-2 ring-1 ring-white/5">
          <div className="mb-2 flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-[10px] text-gray-500"><UIcon name="search" className="w-3 h-3" />Filter navigator</div>
          <div className="mb-1 flex items-center gap-1 text-[11px] text-yellow-400"><UIcon name="star" className="w-3 h-3" /> Favorites <span className="mx-1 text-gray-600">·</span><UIcon name="clock" className="w-3 h-3 text-gray-400" /> History</div>
          {["Incident", "Problem", "Change", "Service Catalog"].map((m) => (
            <div key={m} className="truncate py-0.5 text-[11px] text-gray-400">{m}</div>
          ))}
        </div>
        {/* Content frame */}
        <div className="w-3/5 rounded-br-lg bg-zinc-950 p-2 ring-1 ring-white/5">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-gray-600">Content frame</div>
          {["INC0012345  ·  Email down", "INC0012346  ·  VPN issue", "INC0012347  ·  Laptop swap"].map((r) => (
            <div key={r} className="truncate border-b border-white/5 py-1 text-[11px] text-gray-300">{r}</div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-500">
        <span><span className="text-orange-400">☰</span> hamburger = collapse sidebar</span>
        <span><span className="text-orange-400">⚙</span> gear = personal settings</span>
        <span><span className="text-yellow-400">★</span> favorites</span>
        <span><span className="text-gray-300">🕐</span> history</span>
      </div>
    </div>
  );
}

export default function InteractiveLesson({ html }: { html: string }) {
  const sections = useMemo(() => parseLesson(html), [html]);
  const [step, setStep] = useState(0);
  const [vis, setVis] = useState(true);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const n = sections.length;
  const go = (next: number) => {
    if (next < 0 || next >= n || next === step) return;
    setVis(false);
    setTimeout(() => { setStep(next); setVis(true); }, 130);
  };

  // Keyboard nav (ADHD-friendly: move with arrow keys, no hunting for buttons)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(step + 1);
      if (e.key === "ArrowLeft") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!n) return <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6" dangerouslySetInnerHTML={{ __html: html }} />;

  const sec = sections[step];
  const toggle = (key: string) => setRevealed((p) => { const s = new Set(p); s.has(key) ? s.delete(key) : s.add(key); return s; });
  const revealAll = () => setRevealed((p) => { const s = new Set(p); sec.items.forEach((_, i) => s.add(`${step}-${i}`)); return s; });
  const revealedCount = sec.items.filter((_, i) => revealed.has(`${step}-${i}`)).length;
  const allRevealed = sec.items.length > 0 && revealedCount === sec.items.length;
  const showMock = sec.kind === "concepts" && sec.items.some((li) => /navigator|banner|content frame|gear/i.test(li));

  return (
    <div className="bg-zinc-900 border border-orange-500/30 rounded-xl overflow-hidden mb-6">
      <div className="h-1.5 bg-black/40">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${((step + 1) / n) * 100}%` }} />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">
            {sections.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Section ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === step ? "w-6 bg-orange-500" : "w-2 bg-white/20 hover:bg-white/40"}`} />
            ))}
          </div>
          <span className="text-xs font-mono text-gray-500">{step + 1} / {n} · ← → keys</span>
        </div>

        <div className={`transition-opacity duration-150 ${vis ? "opacity-100" : "opacity-0"}`}>
          <h3 className="text-xl font-black text-white mb-4">{sec.title}</h3>

          {(sec.kind === "intro" || sec.kind === "prose" || sec.kind === "realworld") && (
            <div className="space-y-3">
              {sec.paras.map((p, i) => <p key={i} className="text-gray-300 leading-relaxed">{p}</p>)}
            </div>
          )}

          {sec.kind === "concepts" && (
            <>
              {showMock && <ServiceNowMock />}
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-orange-400/80">Tap a card to flip it · {revealedCount}/{sec.items.length}</p>
                {!allRevealed && <button onClick={revealAll} className="text-[11px] text-gray-400 hover:text-orange-400 underline">reveal all</button>}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((li, i) => {
                  const { term, def } = splitConcept(li);
                  const icon = iconNameFor(term);
                  const open = revealed.has(`${step}-${i}`);
                  return (
                    <button key={i} onClick={() => toggle(`${step}-${i}`)} className="text-left h-40 w-full" style={{ perspective: "1000px" }}>
                      <div className="relative h-full w-full transition-transform duration-500" style={{ transformStyle: "preserve-3d", transform: open ? "rotateY(180deg)" : "" }}>
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 p-4 hover:border-orange-500/50" style={{ backfaceVisibility: "hidden" }}>
                          {icon && <span className="text-orange-400"><UIcon name={icon} className="w-8 h-8" /></span>}
                          <span className="text-center text-base font-bold text-orange-400">{term}</span>
                          <span className="text-[11px] uppercase tracking-wide text-gray-500">tap to reveal</span>
                        </div>
                        <div className="absolute inset-0 overflow-y-auto rounded-xl border border-orange-500/40 bg-orange-500/5 p-4" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                          <div className="mb-1 flex items-center gap-1.5 text-orange-400">
                            {icon && <UIcon name={icon} className="w-4 h-4" />}
                            <span className="text-xs font-bold">{term}</span>
                            <span className="ml-auto text-green-400">✓</span>
                          </div>
                          <p className="text-sm leading-snug text-gray-200">{def}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {sec.kind === "pitfalls" && (
            <div className="space-y-3">
              {sec.items.map((li, i) => {
                const { head, detail } = splitPitfall(li);
                const open = revealed.has(`${step}-${i}`);
                return (
                  <button key={i} onClick={() => toggle(`${step}-${i}`)} className="block w-full rounded-xl border border-white/10 bg-black/40 p-4 text-left transition-colors hover:border-red-500/40">
                    <div className="flex items-start gap-2">
                      <span className={open ? "text-green-400" : "text-red-500"}>{open ? "✓" : "✕"}</span>
                      <span className="font-semibold text-white">{head}</span>
                    </div>
                    <div className={`grid transition-all duration-300 ${open ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden pl-6 text-sm text-gray-300">{detail || "—"}</p>
                    </div>
                    {!open && <span className="mt-1 block pl-6 text-[11px] uppercase tracking-wide text-gray-500">tap to see why</span>}
                  </button>
                );
              })}
            </div>
          )}

          {sec.kind === "cheatsheet" && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-orange-400/80">Quiz yourself — tap to reveal · {revealedCount}/{sec.items.length}</p>
                {!allRevealed && <button onClick={revealAll} className="text-[11px] text-gray-400 hover:text-orange-400 underline">reveal all</button>}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {sec.items.map((li, i) => {
                  const { key, val } = splitCheat(li);
                  const icon = iconNameFor(key);
                  const open = revealed.has(`${step}-${i}`);
                  // Fact card (no "key = value"): single statement you tap to mark known.
                  if (!val) {
                    return (
                      <button key={i} onClick={() => toggle(`${step}-${i}`)} className={`flex items-start gap-2 rounded-xl border p-4 text-left transition-all ${open ? "border-green-500/40 bg-green-500/5" : "border-white/10 bg-black/40 hover:border-orange-500/40"}`}>
                        <span className={open ? "text-green-400" : "text-orange-400/70"}>{open ? "✓" : "•"}</span>
                        {icon && <span className="text-orange-400"><UIcon name={icon} className="w-5 h-5" /></span>}
                        <span className="text-sm text-gray-200">{key}</span>
                      </button>
                    );
                  }
                  // Recall card: prompt on front, answer revealed on tap.
                  return (
                    <button key={i} onClick={() => toggle(`${step}-${i}`)} className={`rounded-xl border p-4 text-left transition-all ${open ? "border-orange-500/50 bg-orange-500/5" : "border-white/10 bg-black/40 hover:border-orange-500/40"}`}>
                      <div className="flex items-center gap-2 text-sm font-bold text-white">{icon && <UIcon name={icon} className="w-5 h-5 text-orange-400" />}{key}</div>
                      {open
                        ? <div className="mt-1 text-sm text-orange-300">{val}</div>
                        : <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">tap to reveal</div>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {allRevealed && (sec.kind === "concepts" || sec.kind === "cheatsheet") && (
            <p className="mt-4 text-sm font-semibold text-green-400">✓ Nice — you went through them all.</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => go(step - 1)} disabled={step === 0}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30">← Back</button>
          {step < n - 1
            ? <button onClick={() => go(step + 1)} className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-bold text-black hover:bg-orange-400">Next →</button>
            : <span className="text-sm font-semibold text-green-400">✓ Lesson complete — start the quiz below ↓</span>}
        </div>
      </div>
    </div>
  );
}
