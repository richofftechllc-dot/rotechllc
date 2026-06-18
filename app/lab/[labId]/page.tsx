"use client";

// Flo-guided hands-on lab. Coaches the student through their OWN ServiceNow PDI,
// one step at a time, with voice + mic. The AI never touches their instance.

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getLab } from "@/lib/labs";
import Markdown from "@/app/components/Markdown";

type Msg = { role: "user" | "assistant"; content: string };
const FLO_VOICE = "XrExE9yKIg1WjnnlVkGX";

export default function LabPage({ params }: { params: Promise<{ labId: string }> }) {
  const { labId } = use(params);
  const lab = getLab(labId);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => (lab ? lab.steps.map(() => false) : []));
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const genRef = useRef(0);
  const recogRef = useRef<{ stop: () => void } | null>(null);
  const startedRef = useRef(false);

  // Scroll only the chat box, never the page — no jumping while Flo thinks/streams.
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages, busy]);

  function stopSpeak() { genRef.current++; if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setSpeaking(false); }
  async function speak(text: string) {
    stopSpeak();
    const gen = genRef.current;
    try {
      const r = await fetch("/api/bo/voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voiceId: FLO_VOICE }) });
      if (gen !== genRef.current || !r.ok) return;
      const url = URL.createObjectURL(await r.blob());
      if (gen !== genRef.current) { URL.revokeObjectURL(url); return; }
      const a = new Audio(url); audioRef.current = a; setSpeaking(true);
      a.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      await a.play().catch(() => setSpeaking(false));
    } catch { setSpeaking(false); }
  }

  function labCtx(curStep: number): string {
    if (!lab) return "";
    const steps = lab.steps.map((s, i) => `${i + 1}) ${s.title}: ${s.do} (verify: ${s.verify})`).join(" ");
    return `[LAB COACH MODE — you are Flo, guiding a hands-on ServiceNow lab in the student's OWN free PDI. Lab: "${lab.title}". Objective: ${lab.objective}. All steps: ${steps}. The student is currently on STEP ${curStep + 1}: ${lab.steps[curStep]?.do || "wrap-up"}. Coach ONE step at a time in your exact-but-warm voice; give the precise click-path. Verify by what they describe. When they confirm a step, celebrate in one line and move them to the next. Keep replies tight — 2-4 sentences.]`;
  }

  async function ask(sendText: string, displayText?: string, curStep = step) {
    if (busy || !lab) return;
    if (displayText !== "") setMessages((m) => [...m, { role: "user", content: displayText ?? sendText }]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `${labCtx(curStep)}\n\n${sendText}`, persona: "flo", handoff: true }),
      });
      const data = await r.json();
      const reply = data.reply || data.message || "Couldn't reach Flo — try again.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      if (autoSpeak) speak(reply);
    } catch { setMessages((m) => [...m, { role: "assistant", content: "Couldn't reach Flo right now." }]); }
    setBusy(false);
  }

  // Kickoff once.
  useEffect(() => {
    if (!lab || startedRef.current) return;
    startedRef.current = true;
    ask("(Start the lab: greet me as Flo in one line, say what we're building, then walk me into step 1 with the exact click-path.)", "");
  }, [lab]); // eslint-disable-line react-hooks/exhaustive-deps

  function markStepDone() {
    if (!lab || step >= lab.steps.length) return;
    setDone((d) => { const c = [...d]; c[step] = true; return c; });
    const next = step + 1;
    setStep(next);
    if (next < lab.steps.length) ask(`(I finished step ${step + 1}. Confirm it and walk me into step ${next + 1}.)`, `✅ Done with step ${step + 1}`, next);
    else ask(`(I finished the FINAL step — the whole lab is complete!)`, `🏁 Finished the last step!`, next - 1);
  }

  function toggleMic() {
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const SR = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Safari, or just type."); return; }
    stopSpeak();
    const r = new (SR as new () => { lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void; onresult: (e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void; onend: () => void; onerror: () => void; })();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let finalText = "";
    r.onresult = (e) => { let interim = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) finalText += t; else interim += t; } setInput((finalText + interim).trim()); };
    r.onerror = () => setListening(false);
    r.onend = () => { setListening(false); const t = finalText.trim(); if (t) ask(t); };
    recogRef.current = r; setListening(true); r.start();
  }

  if (!lab) {
    return (
      <main className="min-h-screen bg-black px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl"><Link href="/quiz" className="text-sm text-gray-500 hover:text-orange-500">← Back</Link><h1 className="mt-4 text-2xl font-black">Lab not found</h1></div>
      </main>
    );
  }

  const pct = Math.round((done.filter(Boolean).length / lab.steps.length) * 100);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/quiz" className="text-sm text-gray-500 hover:text-orange-500">← Back to tracks</Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs text-fuchsia-300">🧪 LAB · {lab.cert} · {lab.est}</p>
            <h1 className="text-2xl font-black">{lab.title}</h1>
          </div>
          <a href={lab.pdiUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-fuchsia-500 px-4 py-2 text-sm font-bold text-black hover:bg-fuchsia-400">🚀 Open my PDI ↗</a>
        </div>
        <p className="mt-1 text-gray-400">{lab.objective}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Steps */}
          <div>
            <div className="mb-2 h-1.5 rounded bg-white/10"><div className="h-full rounded bg-fuchsia-500 transition-all" style={{ width: `${pct}%` }} /></div>
            <div className="space-y-2">
              {lab.steps.map((s, i) => (
                <div key={i} className={`rounded-xl border p-3 ${i === step ? "border-fuchsia-500/50 bg-fuchsia-500/5" : done[i] ? "border-green-500/30 bg-green-500/5" : "border-white/10 bg-zinc-900/60"}`}>
                  <div className="flex items-start gap-2">
                    <span className={done[i] ? "text-green-400" : i === step ? "text-fuchsia-400" : "text-gray-600"}>{done[i] ? "✓" : i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold">{s.title}</div>
                      {(i === step || done[i]) && <div className="mt-1 text-xs text-gray-300">{s.do}</div>}
                      {i === step && (
                        <button onClick={markStepDone} disabled={busy} className="mt-2 rounded-lg bg-fuchsia-500 px-3 py-1 text-xs font-bold text-black hover:bg-fuchsia-400 disabled:opacity-40">✓ I did it — check &amp; continue</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {pct === 100 && <p className="text-sm font-semibold text-green-400">🎉 Lab complete — you did the real thing.</p>}
            </div>
          </div>

          {/* Flo chat */}
          <div className="flex h-[70vh] flex-col rounded-xl border border-fuchsia-500/30 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-white/10 p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-xs font-black">F</span>
                <span className="text-sm font-bold">Flo · lab coach</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {speaking && <button onClick={stopSpeak} className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-red-300">⏹ Stop</button>}
                <button onClick={() => { const n = !autoSpeak; setAutoSpeak(n); if (!n) stopSpeak(); }} className={`rounded border px-2 py-1 ${autoSpeak ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-gray-400"}`}>{autoSpeak ? "🔊" : "🔈"}</button>
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "ml-auto max-w-[85%] rounded-2xl bg-fuchsia-500 px-3 py-2 text-black" : "max-w-[90%] rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-gray-100"}>
                  {m.role === "assistant" ? <Markdown text={m.content} /> : <span className="whitespace-pre-wrap">{m.content}</span>}
                </div>
              ))}
              {busy && <div className="text-xs text-fuchsia-300 animate-pulse">Flo&apos;s thinking…</div>}
              <div ref={endRef} />
            </div>
            <div className="flex gap-2 border-t border-white/10 p-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask(input)} placeholder={listening ? "Listening…" : "Ask Flo, or tell her what you see…"} disabled={busy} className="flex-1 rounded bg-zinc-800 border border-white/10 px-3 py-2 text-sm outline-none focus:border-fuchsia-500" />
              <button onClick={toggleMic} title="Talk to Flo" className={`rounded px-3 font-bold ${listening ? "bg-red-500 text-white animate-pulse" : "bg-zinc-800 text-gray-300 border border-white/10"}`}>🎤</button>
              <button onClick={() => ask(input)} disabled={busy || !input.trim()} className="rounded bg-fuchsia-500 px-3 font-bold text-black disabled:opacity-40">↑</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
