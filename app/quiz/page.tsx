"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { TRACKS, LESSONS, LIVE_SESSION, type Track, type Domain } from "@/lib/quizData";
import LessonVideo from "@/app/components/LessonVideo";
import InteractiveLesson from "@/app/components/InteractiveLesson";
import Markdown from "@/app/components/Markdown";
import { allowedPrefixes } from "@/lib/access";

type Me = | { ok: true; code: string | null; name: string; track: string | null; authType: string } | { ok: false };
type ChatMsg = { role: "user" | "assistant"; content: string };
type DomainProgress = { completed?: boolean; highScore?: number };

const TRACK_COLORS: Record<string, string> = {
  sp: "border-green-400/40 hover:border-green-400",
  csa: "border-yellow-400/40 hover:border-yellow-400",
  ai: "border-blue-400/40 hover:border-blue-400",
};
const TRACK_TEXT: Record<string, string> = { sp: "text-green-400", csa: "text-yellow-400", ai: "text-blue-400" };

// Old quiz schema uses prefixed keys: secplus_sp1, csa_csa1, ai_ai1
function progKey(domainId: string): string {
  if (domainId.startsWith("sp")) return `secplus_${domainId}`;
  if (domainId.startsWith("csa")) return `csa_${domainId}`;
  if (domainId.startsWith("ai")) return `ai_${domainId}`;
  return domainId;
}

// allowedPrefixes now lives in lib/access.ts (single source of truth, shared with
// the /api/video-token gate). Imported above.

export default function Quiz() {
  const [me, setMe] = useState<Me | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [qIdx, setQIdx] = useState(0);
  // answers[i] = chosen option for question i, or null if skipped/unanswered (indexed,
  // so you can skip a question and come back to it).
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false); // true once the student chooses to finish
  const savedRef = useRef(false);                   // ensures the result saves exactly once
  const [showLesson, setShowLesson] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [persona, setPersona] = useState<"bo" | "flo">("bo");
  const [progress, setProgress] = useState<Record<string, DomainProgress>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpeakRef = useRef<{ text: string; t: number }>({ text: "", t: 0 });
  const VOICE = { bo: "CwhRBWXzGAHq8TQ4Fs17", flo: "XrExE9yKIg1WjnnlVkGX" }; // ElevenLabs (Roger laid-back / Matilda)
  function stopSpeak() { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setSpeakingIdx(null); }
  async function speak(text: string, idx: number, p: "bo" | "flo" = persona) {
    const now = Date.now();
    if (lastSpeakRef.current.text === text && now - lastSpeakRef.current.t < 2500) return;
    lastSpeakRef.current = { text, t: now };
    stopSpeak();
    try {
      const r = await fetch("/api/bo/voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voiceId: VOICE[p] }) });
      if (!r.ok) return;
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url); audioRef.current = a; setSpeakingIdx(idx);
      a.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      await a.play().catch(() => setSpeakingIdx(null));
    } catch { setSpeakingIdx(null); }
  }
  // Toggling sound ON immediately speaks the most recent reply (so you hear something
  // right away), and the click itself is the user-gesture browsers require for audio.
  function toggleAutoSpeak() {
    const next = !autoSpeak;
    setAutoSpeak(next);
    if (next) { const last = [...chat].reverse().find(m => m.role === "assistant" && m.content); if (last) speak(last.content, -1); }
    else stopSpeak();
  }

  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false })); }, []);

  const [progressStatus, setProgressStatus] = useState<"loading" | "loaded" | "empty" | "unauth" | "error">("loading");
  const [progressMeta, setProgressMeta] = useState<{ rawKeys: number; normalizedKeys: number } | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then(async r => {
        if (r.status === 401) { setProgressStatus("unauth"); return { progress: null }; }
        if (!r.ok) { setProgressStatus("error"); return { progress: null }; }
        return r.json();
      })
      .then(data => {
        const raw = data?.progress || {};
        const rawKeys = Object.keys(raw).length;
        const norm: Record<string, DomainProgress> = {};
        for (const [k, v] of Object.entries(raw)) {
          if (typeof v !== "object" || v === null) continue;
          const m = k.match(/^(?:secplus|csa|ai)_(.+)$/);
          const id = m ? m[1] : k;
          norm[id] = v as DomainProgress;
        }
        setProgress(norm);
        setProgressMeta({ rawKeys, normalizedKeys: Object.keys(norm).length });
        if (rawKeys === 0) setProgressStatus("empty");
        else setProgressStatus("loaded");
      })
      .catch(() => { setProgress({}); setProgressStatus("error"); });
  }, []);

  // Keep the chat PANEL scrolled to its latest message — never scroll the whole page.
  useEffect(() => { const el = chatScrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [chat]);

  // Save the result exactly once when the student lands on results. MUST be above the
  // early returns below (Rules of Hooks — every hook runs on every render).
  useEffect(() => {
    if (!domain) return;
    const total = domain.questions.length;
    const isDone = qIdx >= total && answers.length === total;
    const unansweredCount = answers.filter(a => a == null).length;
    if (isDone && (finished || unansweredCount === 0) && !savedRef.current) {
      savedRef.current = true;
      saveDomainResult(domain, answers);
    }
  }, [qIdx, finished, domain, answers]);

  if (!me) return <main className="max-w-2xl mx-auto px-6 py-24 text-center"><h1 className="text-4xl font-black">Loading...</h1></main>;
  if (!me.ok) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
  if (!me.code) return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      <Image src="/bo-avatar.png" alt="ROT" width={80} height={80} className="rounded-full mx-auto mb-6" />
      <h1 className="text-3xl font-black mb-4">Welcome, {me.name}</h1>
      <p className="text-gray-400 mb-8">Discord signed in but no quiz code linked. DM Bo in Discord for your code.</p>
      <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener" className="inline-block px-6 py-3 text-white font-bold rounded-lg" style={{backgroundColor:"#5865F2"}}>Open ROT Discord</a>
    </main>
  );

  const allowed = allowedPrefixes(me.track);
  const visibleTracks = TRACKS.filter(t => allowed.has(t.id));

  const reset = () => { setTrack(null); setDomain(null); setQIdx(0); setAnswers([]); setFinished(false); savedRef.current = false; setShowLesson(false); setChat([]); };
  const start = (d: Domain) => { setDomain(d); setQIdx(0); setAnswers(Array(d.questions.length).fill(null)); setFinished(false); savedRef.current = false; setShowLesson(false); setChat([]); };

  async function saveDomainResult(d: Domain, finalAnswers: (number | null)[]) {
    if (finalAnswers.length !== d.questions.length) return; // only save complete runs
    const correct = finalAnswers.filter((a, i) => a === d.questions[i].answer).length;
    const pct = Math.round((correct / d.questions.length) * 100);
    const existing = progress[d.id] || {};
    const highScore = Math.max(existing.highScore || 0, pct);
    const entry: DomainProgress = { completed: true, highScore };
    setProgress(p => ({ ...p, [d.id]: entry }));
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [progKey(d.id)]: entry }),
      });
    } catch (e) { console.error("Progress save failed:", e); }
  }

  async function askBo(question: string) {
    if (!question.trim() || chatBusy) return;
    // Render-time gates above (!me, !me.ok, !me.code) don't narrow inside closures.
    // Re-assert the same three to make the auth contract explicit at call time.
    if (!me || !me.ok || !me.code) return;
    const userMsg: ChatMsg = { role: "user", content: question };
    setChat(c => [...c, userMsg]);
    setChatInput("");
    setChatBusy(true);
    try {
      const q = domain?.questions[qIdx];
      const correctSoFar = answers.filter((a, i) => domain && a === domain.questions[i].answer).length;
      const ctx = domain && q
        ? `[Quiz context — student: ${me.name} (${me.code}), track: ${me.track}, domain: ${domain.name} (${domain.id}), question ${qIdx+1}/${domain.questions.length}: "${q.q}", options: ${q.options.map((o,i)=>String.fromCharCode(65+i)+") "+o).join(" | ")}, correct: ${String.fromCharCode(65+q.answer)}, student picked: ${answers[qIdx] != null ? String.fromCharCode(65 + (answers[qIdx] as number)) : "nothing yet"}, score so far: ${correctSoFar}/${answers.filter(a => a != null).length}]`
        : `[Student: ${me.name}, track: ${me.track}]`;
      // Real-tutor signal: their best scores per module, weak areas, and what they just missed.
      const histParts: string[] = [];
      if (track?.domains) {
        const scored = track.domains.filter(d => progress[d.id]?.highScore !== undefined);
        if (scored.length) histParts.push("best scores — " + scored.map(d => `${d.name} ${progress[d.id]!.highScore}%`).join("; "));
        const weak = scored.filter(d => (progress[d.id]!.highScore ?? 101) < 70).map(d => d.name);
        if (weak.length) histParts.push("WEAK areas (<70%): " + weak.join(", "));
      }
      const missedNow = domain ? answers.map((a, i) => (a != null && a !== domain.questions[i].answer) ? `"${domain.questions[i].q.slice(0, 55)}"` : null).filter(Boolean) : [];
      if (missedNow.length) histParts.push("missed this session: " + missedNow.join("; "));
      const hist = histParts.length ? `\n[Student history — ${histParts.join(" | ")}. Be a REAL tutor: target their weak areas, reference what they missed, don't re-teach what they already aced.]` : "";
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // domainId grounds Bo in this module's lesson; hist makes the tutoring personal.
        body: JSON.stringify({ message: `${ctx}${hist}\n\n${question}`, domainId: domain?.id, persona }),
      });
      const data = await r.json();
      const reply = data.reply || data.message || (data.error ? `(${data.error})` : "Couldn't reach Bo Tech right now. Try again.");
      setChat(c => [...c, { role: "assistant", content: reply }]);
      if (autoSpeak) speak(reply, chat.length + 1);
    } catch {
      setChat(c => [...c, { role: "assistant", content: "Couldn't reach Bo Tech right now. Try again in a sec." }]);
    }
    setChatBusy(false);
  }

  // Switch tutor. With an ongoing chat, the new tutor PICKS IT UP — it announces the
  // switch and re-explains the last point in its own style, so a stuck student can
  // hear a different version (Bo's street take ↔ Flo's technical breakdown).
  async function switchPersona(to: "bo" | "flo") {
    if (to === persona || chatBusy) return;
    setPersona(to);
    if (!chat.length || !me || !me.ok || !me.code) return; // no convo yet → greeting handles it
    setChatBusy(true);
    setChat(c => [...c, { role: "assistant", content: "" }]); // thinking placeholder
    try {
      const q = domain?.questions[qIdx];
      const ctx = domain && q
        ? `[Quiz context — student: ${me.name}, track: ${me.track}, domain: ${domain.name} (${domain.id}), current question: "${q.q}"]`
        : `[Student: ${me.name}, track: ${me.track}]`;
      const who = to === "flo" ? "Flo" : "Bo";
      const from = to === "flo" ? "Bo" : "Flo";
      const msg = `${ctx}\n\n(SYSTEM: The student just switched tutors from ${from} to you, ${who}. They likely want the last thing explained a different way. In ONE line say it's you taking over, then re-explain the most recent point concisely in YOUR style. Keep it to 2-4 sentences.)`;
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, domainId: domain?.id, persona: to, handoff: true }),
      });
      const data = await r.json();
      const reply = data.reply || data.message || `${who} here — want me to break that down my way?`;
      setChat(c => { const cc = [...c]; cc[cc.length - 1] = { role: "assistant", content: reply }; return cc; });
      if (autoSpeak) speak(reply, -1, to);
    } catch {
      setChat(c => { const cc = [...c]; cc[cc.length - 1] = { role: "assistant", content: `${to === "flo" ? "Flo" : "Bo"} here — ask me and I'll explain it my way.` }; return cc; });
    }
    setChatBusy(false);
  }

  // Start a fresh thread. Clears the visible chat + server context, but Bo distills
  // and KEEPS a persistent memory of the student, so he still knows you next time.
  async function clearChat() {
    if (chatBusy) return;
    stopSpeak();
    setChat([]);
    setChatInput("");
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
    } catch { /* visible chat already cleared; memory persists server-side */ }
  }

  if (!track) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-2">Your <span className="text-orange-500">Quiz</span></h1>
          <p className="text-gray-400">Signed in as <span className="text-orange-500 font-semibold">{me.name}</span> <span className="font-mono text-sm text-gray-500 ml-2">{me.code}</span></p>
          {me.track && <p className="text-gray-500 text-sm mt-1">{me.track}</p>}
          <div className="text-[11px] mt-2 font-mono">
            {progressStatus === "loading" && <span className="text-gray-500">↻ Loading progress…</span>}
            {progressStatus === "loaded" && progressMeta && (
              <span className="text-green-500">✓ Synced ({progressMeta.rawKeys} raw → {progressMeta.normalizedKeys} domain entries)</span>
            )}
            {progressStatus === "empty" && (
              <span className="text-yellow-500">⚠ No saved progress for <code className="text-yellow-300">{me.code}</code> in Firestore. If you completed domains on rotechllc.com/learn, the data should appear here automatically — verify the doc exists at <code>quizProgress/{me.code}</code> in Firebase console.</span>
            )}
            {progressStatus === "unauth" && <span className="text-red-400">✗ Progress endpoint returned 401. Session cookie may not be reaching the API.</span>}
            {progressStatus === "error" && <span className="text-red-400">✗ Progress fetch errored. Check /api/progress in the Network tab.</span>}
          </div>
        </div>
        {visibleTracks.length === 0 ? (
          <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-8 text-center">
            <p className="text-gray-400">Your track <span className="text-orange-500 font-semibold">{me.track || "(unset)"}</span> doesn&apos;t match any quiz tracks yet. DM Bo in Discord.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {visibleTracks.map(t => {
              const done = t.domains.filter(d => progress[d.id]?.completed).length;
              return (
                <button key={t.id} onClick={() => setTrack(t)} className={`bg-zinc-900 border rounded-xl p-6 text-left transition hover:scale-[1.02] ${TRACK_COLORS[t.id] || "border-white/10"}`}>
                  <div className="text-3xl mb-2">{t.id === "sp" ? "🛡️" : t.id === "csa" ? "⚙️" : "🤖"}</div>
                  <div className={`font-bold text-xl mb-1 ${TRACK_TEXT[t.id] || ""}`}>{t.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{t.domains.length} domains · {t.domains.reduce((s, d) => s + d.questions.length, 0)} questions</div>
                  <div className="text-xs text-orange-400 font-mono mt-2">{done}/{t.domains.length} complete</div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  if (!domain) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={reset} className="text-gray-500 text-sm mb-6 hover:text-orange-500">← Tracks</button>
        <h1 className={`text-4xl font-black mb-8 ${TRACK_TEXT[track.id] || ""}`}>{track.name}</h1>
        <div className="space-y-2">
          {track.domains.map((d, i) => {
            const p = progress[d.id];
            const score = p?.highScore || 0;
            const completed = !!p?.completed;
            const hasLesson = !!LESSONS[d.id];
            return (
              <div key={d.id} className={`w-full bg-zinc-900 border rounded-lg p-4 flex items-center justify-between transition ${completed ? "border-green-500/40" : "border-white/10 hover:border-orange-500"}`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-700">{String(i+1).padStart(2,"0")}</span>
                  <div>
                    <div className="font-bold">
                      {d.name}
                      {completed && <span className="text-green-400 text-xs ml-2 font-mono">✓ {score}%</span>}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {d.questions.length} questions · {d.id}
                      {hasLesson ? " · 📖 lesson" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {hasLesson ? (
                    <>
                      <button
                        onClick={() => { setDomain(d); setShowLesson(true); setQIdx(d.questions.length); setAnswers([]); }}
                        className="px-3 py-1.5 text-xs bg-orange-500 text-black font-bold rounded"
                      >
                        📖 Study {completed ? "→ Retake" : "→ Quiz"}
                      </button>
                      <button
                        onClick={() => start(d)}
                        className="px-3 py-1.5 text-xs border border-white/15 text-gray-400 rounded hover:border-orange-500/40 hover:text-orange-400"
                      >
                        Skip
                      </button>
                    </>
                  ) : (
                    <button onClick={() => start(d)} className="px-3 py-1.5 text-xs bg-orange-500 text-black font-bold rounded">{completed ? "Retake →" : "Quiz →"}</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    );
  }

  const q = domain.questions[qIdx];
  const done = qIdx >= domain.questions.length;
  const lesson = LESSONS[domain.id];
  const unanswered = answers.map((a, i) => (a == null ? i : -1)).filter(i => i >= 0);

  if (done && showLesson && lesson && answers.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-12">
        <button onClick={() => setDomain(null)} className="text-gray-500 text-sm mb-6 hover:text-orange-500">← {track.name}</button>
        <h1 className="text-3xl font-black mb-2">{domain.name}</h1>
        <p className="text-gray-500 text-sm mb-6 font-mono">📖 Lesson · {domain.id}</p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {domain.video_url && <LessonVideo url={domain.video_url} domainId={domain.id} domainName={domain.name} />}
            <InteractiveLesson html={lesson} />
            <button onClick={() => start(domain)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Start Quiz →</button>
          </div>
          <SidePanel domain={domain} onStart={() => start(domain)} />
        </div>
      </main>
    );
  }

  // Reached the end with questions still skipped — let them go back or finish anyway.
  if (done && !finished && unanswered.length > 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-3xl font-black mb-3">Hold up ⚠️</h1>
        <p className="text-gray-300 mb-1">
          You left <span className="text-orange-400 font-bold">{unanswered.length}</span> question{unanswered.length > 1 ? "s" : ""} unanswered.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Question{unanswered.length > 1 ? "s" : ""}: {unanswered.map(i => i + 1).join(", ")}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setQIdx(unanswered[0])} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Answer them →</button>
          <button onClick={() => setFinished(true)} className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg">Finish anyway</button>
        </div>
      </main>
    );
  }

  if (done) {
    const correct = answers.filter((a, i) => a === domain.questions[i].answer).length;
    const skipped = answers.filter(a => a == null).length;
    const pct = Math.round((correct / domain.questions.length) * 100);
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-black mb-4">Done</h1>
        <div className={`text-7xl font-black mb-2 ${pct >= 75 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</div>
        <p className="text-gray-400 mb-1">{correct} / {domain.questions.length} correct</p>
        {skipped > 0 && <p className="text-orange-400 text-sm mb-2">{skipped} left unanswered</p>}
        {progress[domain.id]?.highScore !== undefined && progress[domain.id].highScore! > pct && (
          <p className="text-gray-500 text-xs mb-6">Best: {progress[domain.id].highScore}%</p>
        )}
        <div className="flex gap-3 justify-center flex-wrap mt-6">
          <button onClick={() => start(domain)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Retry</button>
          <button onClick={() => setDomain(null)} className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg">Domains</button>
          <button onClick={reset} className="px-6 py-3 border border-white/20 text-white font-bold rounded-lg">Home</button>
        </div>
      </main>
    );
  }

  const correctSoFar = answers.filter((a, i) => a === domain.questions[i].answer).length;
  const cur = answers[qIdx];                                   // null/undefined = not answered yet
  const isLast = qIdx + 1 >= domain.questions.length;
  const setAnswer = (i: number) => setAnswers(a => { const n = [...a]; n[qIdx] = i; return n; });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setDomain(null)} className="text-gray-500 text-sm hover:text-orange-500">← {track.name}</button>
        <div className="text-xs font-mono text-gray-500">{qIdx+1} / {domain.questions.length} · {correctSoFar} correct</div>
      </div>
      <h2 className="text-2xl font-bold mb-1">{domain.name}</h2>
      {lesson && <button onClick={() => setShowLesson(s => !s)} className="text-orange-500 text-sm mb-6 hover:underline">{showLesson ? "Hide" : "📖 View"} lesson</button>}
      {showLesson && lesson && <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6 mb-6 prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: lesson }} />}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-xl p-6">
          <div className="text-lg font-bold mb-6">{q.q}</div>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isPicked = cur === i;
              const isCorrect = i === q.answer;
              const show = cur != null;
              let cls = "border-white/10 hover:border-orange-500/50";
              if (show && isCorrect) cls = "border-green-500 bg-green-500/10";
              else if (show && isPicked && !isCorrect) cls = "border-red-500 bg-red-500/10";
              else if (show) cls = "border-white/5 opacity-50";
              return (
                <button key={i} onClick={() => cur == null && setAnswer(i)} disabled={cur != null} className={`w-full text-left p-4 border rounded-lg transition ${cls}`}>
                  <span className="font-mono text-xs text-gray-500 mr-3">{String.fromCharCode(65+i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {cur != null && (
            <div className="mt-6 pt-6 border-t border-white/10 text-sm text-gray-300">{q.exp}</div>
          )}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {qIdx > 0 && (
              <button onClick={() => setQIdx(qIdx - 1)} className="px-5 py-3 bg-zinc-800 text-white font-bold rounded-lg">← Prev</button>
            )}
            {cur == null ? (
              <button onClick={() => setQIdx(qIdx + 1)} className="px-5 py-3 border border-orange-500/50 text-orange-400 font-bold rounded-lg">Skip →</button>
            ) : (
              <button onClick={() => setQIdx(qIdx + 1)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">{isLast ? "See results →" : "Next →"}</button>
            )}
          </div>
        </div>
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-4 h-fit sticky top-4">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {persona === "bo" ? (
                  <Image src="/bo-avatar.png" alt="Bo" width={40} height={40} className="rounded-full border-2 border-orange-500" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-fuchsia-400 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-sm font-black text-white">F</div>
                )}
                <div>
                  <div className="font-bold text-sm">{persona === "bo" ? "Bo Tech" : "Flo"}</div>
                  <div className={`text-xs ${persona === "bo" ? "text-green-500" : "text-fuchsia-300"}`}>{persona === "bo" ? "Live · knows this question" : "Live · ServiceNow instructor"}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {speakingIdx !== null && (
                  <button onClick={stopSpeak} title="Stop reading"
                    className="text-xs rounded px-2 py-1 border border-red-500/40 bg-red-500/10 text-red-300">⏹ Stop</button>
                )}
                <button onClick={toggleAutoSpeak} title="Speak replies aloud"
                  className={`text-xs rounded px-2 py-1 border ${autoSpeak ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-gray-400 hover:text-white"}`}>
                  {autoSpeak ? "🔊" : "🔈"}
                </button>
                <button onClick={clearChat} disabled={chatBusy} title="Start a new chat — your tutor keeps what they've learned about you"
                  className="text-xs text-gray-400 hover:text-orange-400 border border-white/10 hover:border-orange-500/40 rounded px-2 py-1 disabled:opacity-40">
                  ↻ New
                </button>
              </div>
            </div>
            <div className="flex rounded-lg bg-zinc-800 p-0.5 text-xs">
              <button onClick={() => switchPersona("bo")} disabled={chatBusy} className={`flex-1 rounded-md py-1 font-bold transition-colors disabled:opacity-50 ${persona === "bo" ? "bg-orange-500 text-black" : "text-gray-400 hover:text-white"}`}>Bo · plain talk</button>
              <button onClick={() => switchPersona("flo")} disabled={chatBusy} className={`flex-1 rounded-md py-1 font-bold transition-colors disabled:opacity-50 ${persona === "flo" ? "bg-fuchsia-500 text-black" : "text-gray-400 hover:text-white"}`}>Flo · technical</button>
            </div>
          </div>
          <div ref={chatScrollRef} className="space-y-2 max-h-96 overflow-y-auto mb-3 text-sm">
            {chat.length === 0 && (
              <div className="text-gray-500 text-xs space-y-2">
                {persona === "bo" ? (
                  <>
                    <p>Yo {me.name.split(" ")[0]}. I see the question you on.</p>
                    <p>Ask me anything — &quot;why is C right?&quot;, &quot;break this down,&quot; &quot;real-world example?&quot;</p>
                  </>
                ) : (
                  <>
                    <p>Hey {me.name.split(" ")[0]} — Flo here. Let&apos;s do it the ServiceNow way.</p>
                    <p>Ask me the term, the click-path, or &quot;what&apos;s the exam trick here?&quot;</p>
                  </>
                )}
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} className={m.role === "user" ? "bg-zinc-800 rounded p-2 text-gray-300" : "bg-orange-500/10 border border-orange-500/20 rounded p-2 text-gray-200"}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{m.role === "user" ? "You" : (persona === "bo" ? "Bo" : "Flo")}</span>
                  {m.role === "assistant" && m.content && (
                    <button onClick={() => (speakingIdx === i ? stopSpeak() : speak(m.content, i))} title="Hear it" className="text-xs text-gray-500 hover:text-white">{speakingIdx === i ? "⏹" : "🔊"}</button>
                  )}
                </div>
                {m.role === "assistant"
                  ? <Markdown text={m.content} />
                  : <div className="whitespace-pre-wrap">{m.content}</div>}
              </div>
            ))}
            {chatBusy && <div className="text-orange-400 text-xs animate-pulse">{persona === "bo" ? "Bo" : "Flo"}&apos;s thinking...</div>}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && askBo(chatInput)}
              placeholder="Ask Bo..."
              disabled={chatBusy}
              className="flex-1 bg-zinc-800 border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button onClick={() => askBo(chatInput)} disabled={chatBusy || !chatInput.trim()} className="px-3 bg-orange-500 text-black font-bold rounded disabled:opacity-40">→</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function extractYouTubeIdSimple(url: string): string | null {
  const patterns = [/youtu\.be\/([^?&#]+)/, /youtube\.com\/watch\?v=([^&#]+)/, /youtube\.com\/embed\/([^?#]+)/, /youtube\.com\/live\/([^?#]+)/];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

function SidePanel({ domain, onStart }: { domain: Domain; onStart: () => void }) {
  const labs = domain.labs || [];
  const liveYouTubeId = LIVE_SESSION.url ? extractYouTubeIdSimple(LIVE_SESSION.url) : null;
  return (
    <aside className="space-y-4 h-fit lg:sticky lg:top-4">
      {LIVE_SESSION.active && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-bold text-xs tracking-widest uppercase">Live Now</span>
          </div>
          <div className="font-bold text-sm mb-1">{LIVE_SESSION.title || "Community Session"}</div>
          {LIVE_SESSION.host && <div className="text-xs text-gray-400 mb-3">with {LIVE_SESSION.host}</div>}
          {liveYouTubeId ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${liveYouTubeId}?autoplay=0&rel=0`}
                title={LIVE_SESSION.title || "Live"}
                className="w-full h-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : LIVE_SESSION.url ? (
            <a href={LIVE_SESSION.url} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-3 py-2 bg-red-500 text-white font-bold text-xs rounded uppercase tracking-wider">
              Join Now ↗
            </a>
          ) : null}
        </div>
      )}

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
        <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-3">🧪 LABS — {domain.id.toUpperCase()}</div>
        {labs.length === 0 ? (
          <p className="text-gray-500 text-xs italic">No hands-on labs added for this domain yet.</p>
        ) : (
          <ul className="space-y-2">
            {labs.map(l => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-orange-400 hover:text-orange-300 font-bold">{l.name} ↗</a>
                {l.description && <p className="text-xs text-gray-500 mt-0.5">{l.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
        <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-3">READY?</div>
        <p className="text-xs text-gray-400 mb-3">When you&apos;ve absorbed the lesson, take the quiz to lock it in.</p>
        <button onClick={onStart} className="w-full px-4 py-2.5 bg-orange-500 text-black font-bold text-sm rounded">Start Quiz →</button>
      </div>
    </aside>
  );
}
