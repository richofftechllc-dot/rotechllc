"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TRACKS, LESSONS, type Track, type Domain } from "@/lib/quizData";

type Me = | { ok: true; code: string | null; name: string; track: string | null; authType: string } | { ok: false };

const TRACK_COLORS: Record<string, string> = {
  sp: "border-green-400/40 hover:border-green-400",
  csa: "border-yellow-400/40 hover:border-yellow-400",
  ai: "border-blue-400/40 hover:border-blue-400",
};
const TRACK_TEXT: Record<string, string> = { sp: "text-green-400", csa: "text-yellow-400", ai: "text-blue-400" };

export default function Quiz() {
  const [me, setMe] = useState<Me | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showLesson, setShowLesson] = useState(false);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

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

  const reset = () => { setTrack(null); setDomain(null); setQIdx(0); setPicked(null); setAnswers([]); setShowLesson(false); };
  const start = (d: Domain) => { setDomain(d); setQIdx(0); setPicked(null); setAnswers([]); setShowLesson(false); };

  if (!track) return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-5xl font-black mb-2">Your <span className="text-orange-500">Quiz</span></h1>
        <p className="text-gray-400">Signed in as <span className="text-orange-500 font-semibold">{me.name}</span> <span className="font-mono text-sm text-gray-500 ml-2">{me.code}</span></p>
        {me.track && <p className="text-gray-500 text-sm mt-1">{me.track}</p>}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {TRACKS.map(t => (
          <button key={t.id} onClick={() => setTrack(t)} className={`bg-zinc-900 border rounded-xl p-6 text-left transition hover:scale-[1.02] ${TRACK_COLORS[t.id] || "border-white/10"}`}>
            <div className="text-3xl mb-2">{t.id === "sp" ? "🛡️" : t.id === "csa" ? "⚙️" : "🤖"}</div>
            <div className={`font-bold text-xl mb-1 ${TRACK_TEXT[t.id] || ""}`}>{t.name}</div>
            <div className="text-xs text-gray-500 font-mono">{t.domains.length} domains · {t.domains.reduce((s, d) => s + d.questions.length, 0)} questions</div>
          </button>
        ))}
      </div>
    </main>
  );

  if (!domain) return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={reset} className="text-gray-500 text-sm mb-6 hover:text-orange-500">← Tracks</button>
      <h1 className={`text-4xl font-black mb-8 ${TRACK_TEXT[track.id] || ""}`}>{track.name}</h1>
      <div className="space-y-2">
        {track.domains.map((d, i) => (
          <button key={d.id} onClick={() => start(d)} className="w-full bg-zinc-900 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-orange-500 transition text-left">
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-gray-700">{String(i+1).padStart(2,"0")}</span>
              <div>
                <div className="font-bold">{d.name}</div>
                <div className="text-xs text-gray-500 font-mono">{d.questions.length} questions · {d.id}</div>
              </div>
            </div>
            <span className="text-gray-600">→</span>
          </button>
        ))}
      </div>
    </main>
  );

  const q = domain.questions[qIdx];
  const done = qIdx >= domain.questions.length;
  const lesson = LESSONS[domain.id];

  if (done) {
    const correct = answers.filter((a, i) => a === domain.questions[i].answer).length;
    const pct = Math.round((correct / domain.questions.length) * 100);
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h1 className="text-5xl font-black mb-4">Done</h1>
        <div className={`text-7xl font-black mb-2 ${pct >= 75 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</div>
        <p className="text-gray-400 mb-8">{correct} / {domain.questions.length} correct</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => start(domain)} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">Retry</button>
          <button onClick={() => setDomain(null)} className="px-6 py-3 bg-zinc-800 text-white font-bold rounded-lg">Domains</button>
          <button onClick={reset} className="px-6 py-3 border border-white/20 text-white font-bold rounded-lg">Home</button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setDomain(null)} className="text-gray-500 text-sm hover:text-orange-500">← {track.name}</button>
        <div className="text-xs font-mono text-gray-500">{qIdx+1} / {domain.questions.length}</div>
      </div>
      <h2 className="text-2xl font-bold mb-1">{domain.name}</h2>
      {lesson && <button onClick={() => setShowLesson(s => !s)} className="text-orange-500 text-sm mb-6 hover:underline">{showLesson ? "Hide" : "View"} lesson</button>}
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
              <button onClick={() => { setAnswers([...answers, picked]); setQIdx(qIdx+1); setPicked(null); }} className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg">
                {qIdx + 1 < domain.questions.length ? "Next →" : "Finish"}
              </button>
            </div>
          )}
        </div>
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/bo-avatar.png" alt="Bo" width={48} height={48} className="rounded-full border-2 border-orange-500" />
            <div><div className="font-bold">Bo Tech</div><div className="text-green-500 text-xs">Study Mode</div></div>
          </div>
          <div className="text-gray-400 text-sm space-y-3">
            <p>Read every option before picking. Eliminate the obvious wrong ones first.</p>
            <p>Stuck? Hit the chat bubble bottom-right to ask Bo Tech.</p>
            <p className="text-orange-500 font-bold mt-4">Domain: <span className="text-white">{domain.name}</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}
