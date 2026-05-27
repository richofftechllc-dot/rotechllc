"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { TRACKS, LESSONS, type Track, type Domain } from "@/lib/quizData";

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

function allowedPrefixes(trackStr: string | null): Set<string> {
  const all = new Set(["sp", "csa", "ai"]);
  if (!trackStr) return all;
  const t = trackStr.toLowerCase();
  const out = new Set<string>();
  if (t.includes("security+") || t.includes("sec+") || t.includes("comptia security")) out.add("sp");
  if (t.includes("servicenow") || t.includes("csa")) out.add("csa");
  if (t.includes("aws ai") || t.includes("ai practitioner")) out.add("ai");
  if (t.includes("full") || t.includes("admin") || t.includes("all access")) return all;
  return out.size > 0 ? out : all;
}

export default function Quiz() {
  const [me, setMe] = useState<Me | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showLesson, setShowLesson] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatBusy, setChatBusy] = useState(false);
  const [progress, setProgress] = useState<Record<string, DomainProgress>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false })); }, []);

  useEffect(() => {
    fetch("/api/progress")
      .then(r => r.ok ? r.json() : { progress: null })
      .then(data => {
        const raw = data.progress || {};
        // Normalize prefixed keys (secplus_sp1) back to internal (sp1)
        const norm: Record<string, DomainProgress> = {};
        for (const [k, v] of Object.entries(raw)) {
          if (typeof v !== "object" || v === null) continue;
          const m = k.match(/^(?:secplus|csa|ai)_(.+)$/);
          const id = m ? m[1] : k;
          norm[id] = v as DomainProgress;
        }
        setProgress(norm);
      })
      .catch(() => setProgress({}));
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  if (!me) return <main className="max-w-2xl mx-auto px-6 py-24 text-center"><h1 className="text-4xl font-black">Loading...</h1></main>;
  if (!me.ok) { if (typeof window !== "undefined") window.location.href = "/login"; return null; }
  if (!me.code) return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      <Image src="/bo-avatar.png" alt="ROT" width={80} height={80} className="rounded-full mx-auto mb-6" />
      <h1 className="text-3xl font-black mb-4">Welcome, {me.name}</h1>
      <p className="text-gray-400 mb-8">Discord signed in but no quiz code linked. DM Bo in Discord for your code.</p>
      <a href="https://discord.gg/3gFdWYtPB" target="_blank" rel="noopener" className="inline-block px-6 py-3 text-white font-bold rounded-lg" style={{backgroundColor:"#5865F2"}}>Open ROT Discord</a>
    </main>
  );

  const allowed = allowedPrefixes(me.track);
  const visibleTracks = TRACKS.filter(t => allowed.has(t.id));

  const reset = () => { setTrack(null); setDomain(null); setQIdx(0); setPicked(null); setAnswers([]); setShowLesson(false); setChat([]); };
  const start = (d: Domain) => { setDomain(d); setQIdx(0); setPicked(null); setAnswers([]); setShowLesson(false); setChat([]); };

  async function saveDomainResult(d: Domain, finalAnswers: number[]) {
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
    const userMsg: ChatMsg = { role: "user", content: question };
    setChat(c => [...c, userMsg]);
    setChatInput("");
    setChatBusy(true);
    try {
      const q = domain?.questions[qIdx];
      const correctSoFar = answers.filter((a, i) => domain && a === domain.questions[i].answer).length;
      const ctx = domain && q
        ? `[Quiz context — student: ${me.name} (${me.code}), track: ${me.track}, domain: ${domain.name} (${domain.id}), question ${qIdx+1}/${domain.questions.length}: "${q.q}", options: ${q.options.map((o,i)=>String.fromCharCode(65+i)+") "+o).join(" | ")}, correct: ${String.fromCharCode(65+q.answer)}, student picked: ${picked !== null ? String.fromCharCode(65+picked) : "nothing yet"}, score so far: ${correctSoFar}/${answers.length}]`
        : `[Student: ${me.name}, track: ${me.track}]`;
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chat, { role: "user", content: ctx + "\n\n" + question }] }),
      });
      const data = await r.json();
      const reply = data.message || data.response || data.content || data.text || (typeof data === "string" ? data : JSON.stringify(data));
      setChat(c => [...c, { role: "assistant", content: reply }]);
    } catch {
      setChat(c => [...c, { role: "assistant", content: "Couldn't reach Bo Tech right now. Try again in a sec." }]);
    }
    setChatBusy(false);
  }

  if (!track) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-2">Your <span className="text-orange-500">Quiz</span></h1>
          <p className="text-gray-400">Signed in as <span className="text-orange-500 font-semibold">{me.name}</span> <span className="font-mono text-sm text-gray-500 ml-2">{me.code}</span></p>
          {me.track && <p className="text-gray-500 text-sm mt-1">{me.track}</p>}
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
                  {hasLesson && (
                    <button onClick={() => { setDomain(d); setShowLesson(true); setQIdx(d.questions.length); }} className="px-3 py-1.5 text-xs border border-orange-500/40 text-orange-400 rounded hover:bg-orange-500/10">Study</button>
                  )}
                  <button onClick={() => start(d)} className="px-3 py-1.5 text-xs bg-orange-500 text-black font-bold rounded">{completed ? "Retake →" : "Quiz →"}</button>
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

  if (done && showLesson && lesson && answers.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-12">
        <button onClick={() => setDomain(null)} className="text-gray-500 text-sm mb-6 hover:text-orange-500">← {track.name}</button>
        <h1 className="text-3xl font-black mb-2">{domain.name}</h1>
        <p className="text-gray-500 text-sm mb-6 font-mono">📖 Lesson · {domain.id}</p>
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6 prose prose-invert max-w-none mb-6" dangerouslySetInnerHTML={{ __html: lesson }} />
        <button onClick={() => start(domain)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Start Quiz →</button>
      </main>
    );
  }

  if (done) {
    const correct = answers.filter((a, i) => a === domain.questions[i].answer).length;
    const pct = Math.round((correct / domain.questions.length) * 100);
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-black mb-4">Done</h1>
        <div className={`text-7xl font-black mb-2 ${pct >= 75 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</div>
        <p className="text-gray-400 mb-2">{correct} / {domain.questions.length} correct</p>
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

  function commitAnswer() {
    if (picked === null) return;
    const next = [...answers, picked];
    setAnswers(next);
    setQIdx(qIdx + 1);
    setPicked(null);
    if (next.length === domain!.questions.length) {
      saveDomainResult(domain!, next);
    }
  }

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
              const isPicked = picked === i;
              const isCorrect = i === q.answer;
              const show = picked !== null;
              let cls = "border-white/10 hover:border-orange-500/50";
              if (show && isCorrect) cls = "border-green-500 bg-green-500/10";
              else if (show && isPicked && !isCorrect) cls = "border-red-500 bg-red-500/10";
              else if (show) cls = "border-white/5 opacity-50";
              return (
                <button key={i} onClick={() => picked === null && setPicked(i)} disabled={picked !== null} className={`w-full text-left p-4 border rounded-lg transition ${cls}`}>
                  <span className="font-mono text-xs text-gray-500 mr-3">{String.fromCharCode(65+i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-300 mb-4">{q.exp}</div>
              <button onClick={commitAnswer} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">
                {qIdx + 1 < domain.questions.length ? "Next →" : "Finish"}
              </button>
            </div>
          )}
        </div>
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-4 h-fit sticky top-4">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/bo-avatar.png" alt="Bo" width={40} height={40} className="rounded-full border-2 border-orange-500" />
            <div><div className="font-bold text-sm">Bo Tech</div><div className="text-green-500 text-xs">Live · knows this question</div></div>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto mb-3 text-sm">
            {chat.length === 0 && (
              <div className="text-gray-500 text-xs space-y-2">
                <p>Yo {me.name.split(" ")[0]}. I see the question you on.</p>
                <p>Ask me anything — &quot;why is C right?&quot;, &quot;break this down,&quot; &quot;real-world example?&quot;</p>
              </div>
            )}
            {chat.map((m, i) => (
              <div key={i} className={m.role === "user" ? "bg-zinc-800 rounded p-2 text-gray-300" : "bg-orange-500/10 border border-orange-500/20 rounded p-2 text-gray-200"}>
                <div className="text-xs text-gray-500 mb-1">{m.role === "user" ? "You" : "Bo"}</div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
            {chatBusy && <div className="text-orange-400 text-xs animate-pulse">Bo&apos;s thinking...</div>}
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
