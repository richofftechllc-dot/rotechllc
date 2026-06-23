"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { TRACKS, LESSONS, LIVE_SESSION, type Track, type Domain } from "@/lib/quizData";
import LessonVideo from "@/app/components/LessonVideo";
import InteractiveLesson from "@/app/components/InteractiveLesson";
import Markdown from "@/app/components/Markdown";
import { labsForDomain } from "@/lib/labs";
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
  const [voiceErr, setVoiceErr] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Bo/Flo's personalized post-quiz debrief — the tutor reviews exactly what you
  // missed and offers to drill you on just those. Generated once per finished run.
  const [debrief, setDebrief] = useState("");
  const [debriefBusy, setDebriefBusy] = useState(false);
  const debriefRef = useRef(false);   // ensures the debrief generates exactly once per results landing
  const drillRef = useRef(false);     // true while quizzing ONLY the missed questions — don't save partial progress
  const lastSpeakRef = useRef<{ text: string; t: number }>({ text: "", t: 0 });
  const speakGenRef = useRef(0);                // cancels in-flight speech so two voices never overlap
  const recogRef = useRef<{ stop: () => void } | null>(null);
  const [listening, setListening] = useState(false);
  const VOICE = { bo: "CwhRBWXzGAHq8TQ4Fs17", flo: "XrExE9yKIg1WjnnlVkGX" }; // ElevenLabs (Roger laid-back / Matilda)
  function stopSpeak() { speakGenRef.current++; if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setSpeakingIdx(null); }
  async function speak(text: string, idx: number, p: "bo" | "flo" = persona) {
    const now = Date.now();
    if (lastSpeakRef.current.text === text && now - lastSpeakRef.current.t < 2500) return;
    lastSpeakRef.current = { text, t: now };
    stopSpeak();
    const gen = speakGenRef.current; // any newer speak/stop bumps this → this call aborts
    try {
      const r = await fetch("/api/bo/voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voiceId: VOICE[p] }) });
      if (gen !== speakGenRef.current) return;
      if (!r.ok) { setVoiceErr((await r.text().catch(() => "")) || `voice unavailable (${r.status})`); setSpeakingIdx(null); return; }
      setVoiceErr("");
      const url = URL.createObjectURL(await r.blob());
      if (gen !== speakGenRef.current) { URL.revokeObjectURL(url); return; }
      const a = new Audio(url); audioRef.current = a; setSpeakingIdx(idx);
      a.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      await a.play().catch(() => setSpeakingIdx(null));
    } catch { setSpeakingIdx(null); }
  }
  // Talk to the tutor. Starting the mic STOPS the tutor's voice (it listens), then
  // transcribes what you say and sends it — a live back-and-forth.
  function toggleMic() {
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const SR = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Safari, or just type."); return; }
    stopSpeak();          // tutor stops the moment you start talking
    setAutoSpeak(true);   // conversational: it answers out loud
    const r = new (SR as new () => { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void; onresult: (e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void; onend: () => void; onerror: () => void; })();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let finalText = "";
    r.onresult = (e) => { let interim = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) finalText += t; else interim += t; } setChatInput((finalText + interim).trim()); };
    r.onerror = () => setListening(false);
    r.onend = () => { setListening(false); const t = finalText.trim(); if (t) askBo(t, true); };
    recogRef.current = r; setListening(true); r.start();
  }
  // Toggling sound ON immediately speaks the most recent reply (so you hear something
  // right away), and the click itself is the user-gesture browsers require for audio.
  function toggleAutoSpeak() {
    const next = !autoSpeak;
    setAutoSpeak(next);
    if (next) { const last = [...chat].reverse().find(m => m.role === "assistant" && m.content); if (last) speak(last.content, -1); }
    else stopSpeak();
  }

  useEffect(() => { stopSpeak(); }, [qIdx]); // moving to another question stops the voice
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
    if (isDone && (finished || unansweredCount === 0) && !savedRef.current && !drillRef.current) {
      savedRef.current = true;
      saveDomainResult(domain, answers);
    }
  }, [qIdx, finished, domain, answers]);

  // Auto-generate Bo/Flo's debrief the moment the student lands on results. Reviews
  // exactly what they missed and (if anything) offers to drill them on just those.
  useEffect(() => {
    if (!domain) return;
    const total = domain.questions.length;
    const isDone = qIdx >= total && answers.length === total;
    const unansweredCount = answers.filter(a => a == null).length;
    if (isDone && (finished || unansweredCount === 0) && !debriefRef.current) {
      debriefRef.current = true;
      runDebrief(domain, answers, persona);
    }
  }, [qIdx, finished, domain, answers]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const reset = () => { setTrack(null); setDomain(null); setQIdx(0); setAnswers([]); setFinished(false); savedRef.current = false; setShowLesson(false); setChat([]); setDebrief(""); debriefRef.current = false; drillRef.current = false; };
  const start = (d: Domain) => { drillRef.current = false; setDebrief(""); debriefRef.current = false; setDomain(d); setQIdx(0); setAnswers(Array(d.questions.length).fill(null)); setFinished(false); savedRef.current = false; setShowLesson(false); setChat([]); };

  // "Drill me on those" — build a quiz from ONLY the questions the student just missed,
  // so they retest exactly their weak spots. drillRef stops this partial run from
  // overwriting their real high score for the domain.
  function drillMissed() {
    if (!domain) return;
    const missedQs = domain.questions.filter((qq, i) => answers[i] != null && answers[i] !== qq.answer);
    if (!missedQs.length) return;
    const dd: Domain = { ...domain, name: `${domain.name} — Drill`, questions: missedQs };
    drillRef.current = true;
    setDebrief(""); debriefRef.current = false; setShowLesson(false); setChat([]);
    setDomain(dd); setQIdx(0); setAnswers(Array(missedQs.length).fill(null)); setFinished(false); savedRef.current = false;
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bo/Flo reviews the finished run and speaks a short, personalized debrief — names the
  // ONE theme connecting what they missed, not a question-by-question list.
  async function runDebrief(d: Domain, finalAnswers: (number | null)[], p: "bo" | "flo") {
    if (!me || !me.ok || !me.code) return;
    const missed = d.questions
      .map((qq, i) => (finalAnswers[i] != null && finalAnswers[i] !== qq.answer)
        ? { q: qq.q, picked: finalAnswers[i] as number, correct: qq.answer, options: qq.options } : null)
      .filter((m): m is { q: string; picked: number; correct: number; options: string[] } => m !== null);
    const correct = finalAnswers.filter((a, i) => a === d.questions[i].answer).length;
    const skipped = finalAnswers.filter(a => a == null).length;
    const pct = Math.round((correct / d.questions.length) * 100);
    setDebriefBusy(true);
    try {
      const missedText = missed.length
        ? missed.map(m => `• "${m.q}" — picked ${String.fromCharCode(65 + m.picked)}) ${m.options[m.picked]}; correct ${String.fromCharCode(65 + m.correct)}) ${m.options[m.correct]}`).join("\n")
        : "(none — got everything they answered correct)";
      const msg = `[RESULTS DEBRIEF — ${me.name} just finished the "${d.name}" quiz: ${pct}% (${correct}/${d.questions.length} correct${skipped ? `, ${skipped} skipped` : ""}).
Questions MISSED:
${missedText}]

(SYSTEM: Give a SHORT spoken-style debrief, 2-4 sentences, open by their first name. Name the ONE topic/theme connecting what they missed — don't list every question. Tell them the single most important thing to lock in. ${missed.length ? "End by offering to drill them on just the ones they missed." : "Hype them up and tell them they're ready for the next domain."} Stay fully in your voice. No markdown headers.)`;
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, domainId: d.id, persona: p }),
      });
      const data = await r.json();
      const reply = data.reply || data.message || "";
      setDebrief(reply);
      if (reply && autoSpeak) speak(reply, -1, p);
    } catch { setDebrief(""); }
    setDebriefBusy(false);
  }

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

  async function askBo(question: string, forceSpeak = false) {
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
      if (autoSpeak || forceSpeak) speak(reply, chat.length + 1);
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
          <div className="bg-white border border-orange-500/30 rounded-xl p-8 text-center">
            <p className="text-gray-400">Your track <span className="text-orange-500 font-semibold">{me.track || "(unset)"}</span> doesn&apos;t match any quiz tracks yet. DM Bo in Discord.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {visibleTracks.map(t => {
              const done = t.domains.filter(d => progress[d.id]?.completed).length;
              return (
                <button key={t.id} onClick={() => setTrack(t)} className={`bg-white border rounded-xl p-6 text-left transition hover:scale-[1.02] ${TRACK_COLORS[t.id] || "border-gray-200"}`}>
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
              <div key={d.id} className={`w-full bg-white border rounded-lg p-4 flex items-center justify-between transition ${completed ? "border-green-500/40" : "border-gray-200 hover:border-orange-500"}`}>
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
                        className="px-3 py-1.5 text-xs border border-gray-200 text-gray-400 rounded hover:border-orange-500/40 hover:text-orange-400"
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
        <p className="text-gray-600 mb-1">
          You left <span className="text-orange-400 font-bold">{unanswered.length}</span> question{unanswered.length > 1 ? "s" : ""} unanswered.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Question{unanswered.length > 1 ? "s" : ""}: {unanswered.map(i => i + 1).join(", ")}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setQIdx(unanswered[0])} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Answer them →</button>
          <button onClick={() => setFinished(true)} className="px-6 py-3 bg-[#202124] text-white font-bold rounded-lg">Finish anyway</button>
        </div>
      </main>
    );
  }

  if (done) {
    const correct = answers.filter((a, i) => a === domain.questions[i].answer).length;
    const skipped = answers.filter(a => a == null).length;
    const pct = Math.round((correct / domain.questions.length) * 100);
    const missedCount = domain.questions.filter((qq, i) => answers[i] != null && answers[i] !== qq.answer).length;
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-black mb-4">Done</h1>
        <div className={`text-7xl font-black mb-2 ${pct >= 75 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</div>
        <p className="text-gray-400 mb-1">{correct} / {domain.questions.length} correct</p>
        {skipped > 0 && <p className="text-orange-400 text-sm mb-2">{skipped} left unanswered</p>}
        {progress[domain.id]?.highScore !== undefined && progress[domain.id].highScore! > pct && (
          <p className="text-gray-500 text-xs mb-6">Best: {progress[domain.id].highScore}%</p>
        )}

        {/* Bo/Flo's personalized debrief — the "this tutor knows ME" moment. */}
        {(debrief || debriefBusy) && (
          <div className="mt-8 mx-auto max-w-lg text-left bg-white border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {persona === "bo" ? (
                  <Image src="/bo-avatar.png" alt="Bo" width={36} height={36} className="rounded-full border-2 border-orange-500" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fuchsia-400 bg-gradient-to-br from-fuchsia-500 to-purple-600 text-sm font-black text-white">F</div>
                )}
                <div>
                  <div className="font-bold text-sm">{persona === "bo" ? "Bo Tech" : "Flo"}</div>
                  <div className={`text-xs ${persona === "bo" ? "text-green-500" : "text-fuchsia-300"}`}>Your debrief</div>
                </div>
              </div>
              {debrief && (
                <button onClick={() => (speakingIdx === -1 ? stopSpeak() : speak(debrief, -1))} title="Hear it"
                  className="text-xs rounded px-2 py-1 border border-gray-200 text-gray-400 hover:text-[#202124]">{speakingIdx === -1 ? "⏹" : "🔊"}</button>
              )}
            </div>
            {debriefBusy && !debrief
              ? <div className="text-orange-400 text-xs animate-pulse">{persona === "bo" ? "Bo" : "Flo"}&apos;s reviewing your run…</div>
              : <Markdown text={debrief} />}
            {!debriefBusy && debrief && missedCount > 0 && (
              <button onClick={drillMissed} className="mt-3 px-4 py-2 bg-orange-500 text-black font-bold text-sm rounded-lg">🎯 Drill me on those {missedCount} →</button>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center flex-wrap mt-6">
          <button onClick={() => start(domain)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Retry</button>
          <button onClick={() => setDomain(null)} className="px-6 py-3 bg-[#202124] text-white font-bold rounded-lg">Domains</button>
          <button onClick={reset} className="px-6 py-3 border border-[#dadce0] text-[#202124] font-bold rounded-lg hover:bg-gray-50">Home</button>
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
      {voiceErr && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-md bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg px-3 py-2 shadow flex items-center gap-2">
          <span>🔇 Bo&apos;s voice is off: {voiceErr.slice(0, 130)}</span>
          <button onClick={() => setVoiceErr("")} className="text-amber-500 hover:text-amber-700 font-bold">✕</button>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setDomain(null)} className="text-gray-500 text-sm hover:text-orange-500">← {track.name}</button>
        <div className="text-xs font-mono text-gray-500">{qIdx+1} / {domain.questions.length} · {correctSoFar} correct</div>
      </div>
      <h2 className="text-2xl font-bold mb-1">{domain.name}</h2>
      {lesson && <button onClick={() => setShowLesson(s => !s)} className="text-orange-500 text-sm mb-6 hover:underline">{showLesson ? "Hide" : "📖 View"} lesson</button>}
      {showLesson && lesson && <div className="bg-white border border-orange-500/30 rounded-xl p-6 mb-6 prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: lesson }} />}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-lg font-bold mb-6">{q.q}</div>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isPicked = cur === i;
              const isCorrect = i === q.answer;
              const show = cur != null;
              let cls = "border-gray-200 hover:border-orange-500/50";
              if (show && isCorrect) cls = "border-green-500 bg-green-500/10";
              else if (show && isPicked && !isCorrect) cls = "border-red-500 bg-red-500/10";
              else if (show) cls = "border-gray-100 opacity-50";
              return (
                <button key={i} onClick={() => cur == null && setAnswer(i)} disabled={cur != null} className={`w-full text-left p-4 border rounded-lg transition ${cls}`}>
                  <span className="font-mono text-xs text-gray-500 mr-3">{String.fromCharCode(65+i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {cur != null && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600">{q.exp}</div>
          )}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {qIdx > 0 && (
              <button onClick={() => setQIdx(qIdx - 1)} className="px-5 py-3 bg-[#202124] text-white font-bold rounded-lg">← Prev</button>
            )}
            {cur == null ? (
              <button onClick={() => setQIdx(qIdx + 1)} className="px-5 py-3 border border-orange-500/50 text-orange-400 font-bold rounded-lg">Skip →</button>
            ) : (
              <button onClick={() => setQIdx(qIdx + 1)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">{isLast ? "See results →" : "Next →"}</button>
            )}
          </div>
        </div>
        <div className="bg-white border border-orange-500/30 rounded-xl p-4 h-fit sticky top-4">
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
                  className={`text-xs rounded px-2 py-1 border ${autoSpeak ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-gray-200 text-gray-400 hover:text-[#202124]"}`}>
                  {autoSpeak ? "🔊" : "🔈"}
                </button>
                <button onClick={clearChat} disabled={chatBusy} title="Start a new chat — your tutor keeps what they've learned about you"
                  className="text-xs text-gray-400 hover:text-orange-400 border border-gray-200 hover:border-orange-500/40 rounded px-2 py-1 disabled:opacity-40">
                  ↻ New
                </button>
              </div>
            </div>
            <div className="flex rounded-lg bg-[#202124] p-0.5 text-xs">
              <button onClick={() => switchPersona("bo")} disabled={chatBusy} className={`flex-1 rounded-md py-1 font-bold transition-colors disabled:opacity-50 ${persona === "bo" ? "bg-orange-500 text-black" : "text-gray-400 hover:text-[#202124]"}`}>Bo · plain talk</button>
              <button onClick={() => switchPersona("flo")} disabled={chatBusy} className={`flex-1 rounded-md py-1 font-bold transition-colors disabled:opacity-50 ${persona === "flo" ? "bg-fuchsia-500 text-black" : "text-gray-400 hover:text-[#202124]"}`}>Flo · technical</button>
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
              <div key={i} className={m.role === "user" ? "bg-[#202124] rounded p-2 text-gray-600" : "bg-orange-500/10 border border-orange-500/20 rounded p-2 text-gray-200"}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{m.role === "user" ? "You" : (persona === "bo" ? "Bo" : "Flo")}</span>
                  {m.role === "assistant" && m.content && (
                    <button onClick={() => (speakingIdx === i ? stopSpeak() : speak(m.content, i))} title="Hear it" className="text-xs text-gray-500 hover:text-[#202124]">{speakingIdx === i ? "⏹" : "🔊"}</button>
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
              placeholder={listening ? "Listening…" : `Ask ${persona === "bo" ? "Bo" : "Flo"}…`}
              disabled={chatBusy}
              className="flex-1 bg-white border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            />
            <button onClick={toggleMic} title="Talk to your tutor" className={`px-3 rounded font-bold ${listening ? "bg-red-500 text-white animate-pulse" : "bg-[#202124] text-gray-600 hover:text-[#202124] border border-gray-200"}`}>🎤</button>
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
  const labs = labsForDomain(domain.id);
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

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-3">🧪 LABS — {domain.id.toUpperCase()}</div>
        {labs.length === 0 ? (
          <p className="text-gray-500 text-xs italic">No hands-on labs for this domain yet.</p>
        ) : (
          <ul className="space-y-2">
            {labs.map(l => (
              <li key={l.id}>
                <a href={`/lab/${l.id}`} className="block rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/5 p-2.5 hover:border-fuchsia-500/60">
                  <span className="block text-sm font-bold text-fuchsia-300">🧪 {l.title}</span>
                  <span className="block text-[11px] text-gray-400">{l.objective}</span>
                  <span className="mt-1 inline-block text-[11px] font-bold text-fuchsia-400">Start with Flo · {l.est} →</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-3">READY?</div>
        <p className="text-xs text-gray-400 mb-3">When you&apos;ve absorbed the lesson, take the quiz to lock it in.</p>
        <button onClick={onStart} className="w-full px-4 py-2.5 bg-orange-500 text-black font-bold text-sm rounded">Start Quiz →</button>
      </div>
    </aside>
  );
}
