"use client";

// LOCAL TEST PAGE — multi-tutor AI platform front face (Rich Off Tech). Public,
// not gated, not linked. Streams from /api/bo/tutor, renders markdown, themes per
// tutor. Adding a tutor = edit lib/tutors.ts only.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TUTORS, getTutor, type Tutor } from "@/lib/tutors";
import Markdown from "@/app/components/Markdown";

type Msg = { role: "user" | "assistant"; content: string; resume?: string };

function Avatar({ t, size = 40 }: { t: Tutor; size?: number }) {
  if (t.avatar) return <Image src={t.avatar} alt={t.name} width={size} height={size} className="rounded-full" style={{ boxShadow: `0 0 0 2px ${t.color}` }} />;
  return (
    <div className="flex items-center justify-center rounded-full font-black text-white"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `linear-gradient(135deg, ${t.color}, ${t.color}aa)`, boxShadow: `0 0 0 2px ${t.color}` }}>
      {t.initial}
    </div>
  );
}

export default function BoFrontFace() {
  const [tutorId, setTutorId] = useState<string>("bo");
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSpeakRef = useRef<{ text: string; t: number }>({ text: "", t: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<{ stop: () => void } | null>(null);
  const tutor = getTutor(tutorId);

  function toggleMic() {
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const SR = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
    if (!SR) { alert("Voice input needs Chrome or Safari. Try one of those, or just type."); return; }
    setAutoSpeak(true); // talk to it → it talks back
    const r = new (SR as new () => {
      lang: string; interimResults: boolean; continuous: boolean; start: () => void; stop: () => void;
      onresult: (e: { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> }) => void;
      onend: () => void; onerror: () => void;
    })();
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let finalText = "";
    r.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += t; else interim += t;
      }
      setInput((finalText + interim).trim());
    };
    r.onerror = () => setListening(false);
    r.onend = () => { setListening(false); const t = finalText.trim(); if (t) send(t); };
    recogRef.current = r;
    setListening(true);
    r.start();
  }

  // Scroll only the chat panel to its bottom — never the whole page.
  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [messages, busy]);
  useEffect(() => { stopSpeak(); /* switch tutor → stop any voice */ }, [tutorId]); // eslint-disable-line react-hooks/exhaustive-deps

  function stopSpeak() { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setSpeakingIdx(null); }
  async function speak(text: string, idx: number) {
    const now = Date.now();
    if (lastSpeakRef.current.text === text && now - lastSpeakRef.current.t < 2500) return; // de-dupe double-fire
    lastSpeakRef.current = { text, t: now };
    stopSpeak();
    try {
      const r = await fetch("/api/bo/voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, voiceId: tutor.voiceId }) });
      if (!r.ok) return;
      const url = URL.createObjectURL(await r.blob());
      const a = new Audio(url);
      audioRef.current = a;
      setSpeakingIdx(idx);
      a.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      await a.play().catch(() => setSpeakingIdx(null));
    } catch { setSpeakingIdx(null); }
  }

  function setLast(content: string) {
    setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content }; return c; });
  }

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/bo/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, messages: next }),
      });
      if (!r.body) { setLast((await r.text()) || "No response."); }
      else {
        const reader = r.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          setLast(acc);
        }
        if (!acc.trim()) setLast("(no response — is the model key set?)");
        else if (autoSpeak) speak(acc, next.length);
      }
    } catch { setLast("Couldn't reach the tutor from local."); }
    setBusy(false);
  }

  async function improveResume() {
    const text = resumeText.trim();
    if (!text || busy) return;
    setResumeOpen(false);
    setMessages((m) => [...m, { role: "user", content: `📄 Improve my resume${role ? ` for: ${role}` : ""}` }, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const r = await fetch("/api/bo/resume", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeText: text, role }) });
      const data = await r.json();
      if (data.resume) setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: data.resume, resume: data.resume }; return c; });
      else setLast(data.error || "Couldn't rework that resume right now.");
    } catch { setLast("Resume engine unreachable from local."); }
    setBusy(false);
  }

  function onResumeFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) f.text().then((t) => setResumeText(t.slice(0, 12000)));
  }
  function downloadResume(text: string) {
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    const a = document.createElement("a"); a.href = url; a.download = "resume-bo-tech.md"; a.click(); URL.revokeObjectURL(url);
  }

  const newChat = () => { stopSpeak(); setMessages([]); setInput(""); };
  // ROT member tutor view: only the Career & Tech tutors (Bo + Flo). The K-12 teachers
  // live on the separate K-12 product, not here.
  const career = TUTORS.filter((t) => t.category === "Career & Tech");

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-black p-3 md:flex">
        <div className="mb-4 px-1 text-lg font-black tracking-tight">RICH<span style={{ color: tutor.color }}>OFF</span>TECH</div>
        <button onClick={newChat} className="mb-4 flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-900 py-2 text-sm font-semibold hover:bg-zinc-800" style={{ borderColor: `${tutor.color}55` }}>
          <span style={{ color: tutor.color }}>＋</span> New chat
        </button>
        <div className="mb-1 px-1 text-[11px] uppercase tracking-wide text-gray-600">Tutors</div>
        <div className="space-y-1 overflow-y-auto">
          {career.map((t) => (
            <button key={t.id} onClick={() => { setTutorId(t.id); setMenuOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-zinc-900 ${t.id === tutorId ? "bg-zinc-900" : ""}`}>
              <Avatar t={t} size={24} />
              <span className="min-w-0">
                <span className="block truncate font-semibold">{t.name}</span>
                <span className="block truncate text-[11px] text-gray-500">{t.subject} · {t.gradeBand}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-white/10 pt-2 text-[11px] text-gray-600">AI Tutoring Platform · local demo</div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-900">
            <Avatar t={tutor} size={24} />
            <span className="font-bold">{tutor.name}</span>
            <span className="text-xs text-gray-500">{tutor.subject}</span>
            <span className="text-gray-500">▾</span>
          </button>
          <div className="flex items-center gap-2 text-[11px]">
            <button onClick={() => setAutoSpeak((v) => !v)} title="Auto-speak replies (ElevenLabs)"
              className={`rounded-full border px-2 py-0.5 ${autoSpeak ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-gray-400 hover:text-white"}`}>
              {autoSpeak ? "🔊 Auto-speak on" : "🔈 Auto-speak"}
            </button>
            {tutor.kidSafe && <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-400">● Kid-safe</span>}
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-gray-400">{tutor.gradeBand}</span>
          </div>

          {menuOpen && (
            <div className="absolute left-4 top-14 z-20 w-80 rounded-xl border border-white/10 bg-zinc-900 p-1.5 shadow-2xl">
              {[["Career & Tech", career]].map(([label, list]) => (
                <div key={label as string}>
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-gray-600">{label as string}</div>
                  {(list as Tutor[]).map((t) => (
                    <button key={t.id} onClick={() => { setTutorId(t.id); setMenuOpen(false); }}
                      className={`flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-zinc-800 ${t.id === tutorId ? "bg-zinc-800" : ""}`}>
                      <Avatar t={t} size={28} />
                      <span className="min-w-0">
                        <span className="flex items-center gap-2 text-sm font-bold">{t.name}<span className="text-[10px] font-normal text-gray-500">{t.subject} · {t.gradeBand}</span>{t.id === tutorId && <span style={{ color: t.color }}>✓</span>}</span>
                        <span className="block text-xs text-gray-400">{t.blurb}</span>
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* thread / hero */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 text-center">
              <Avatar t={tutor} size={72} />
              <h1 className="mt-4 text-3xl font-black">{tutor.name}</h1>
              <p className="mt-1 text-gray-400">{tutor.tagline}</p>
              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                {tutor.suggestions.map((s) => (
                  <button key={s} onClick={() => send(s)}
                    className="rounded-xl border border-white/10 bg-zinc-900/60 p-3 text-left text-sm font-medium transition-colors hover:bg-zinc-900"
                    style={{ borderColor: `${tutor.color}33` }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-5 px-4 py-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && <div className="mt-1 shrink-0"><Avatar t={tutor} size={28} /></div>}
                  <div className="min-w-0">
                    <div className={`rounded-2xl px-4 py-2.5 ${m.role === "user" ? "text-black" : "border border-white/10 bg-zinc-900 text-gray-100"}`}
                      style={m.role === "user" ? { background: tutor.color } : undefined}>
                      {m.role === "assistant"
                        ? (m.content ? <Markdown text={m.content} /> : <span className="text-orange-400 animate-pulse" style={{ color: tutor.color }}>▍</span>)
                        : <span className="whitespace-pre-wrap text-sm">{m.content}</span>}
                    </div>
                    {m.resume && (
                      <button onClick={() => downloadResume(m.resume!)} className="mt-2 rounded-lg border px-3 py-1.5 text-xs font-bold" style={{ borderColor: `${tutor.color}66`, color: tutor.color }}>⬇ Download resume (.md)</button>
                    )}
                    {m.role === "assistant" && m.content && (
                      <button onClick={() => (speakingIdx === i ? stopSpeak() : speak(m.content, i))} className="ml-1 mt-1 text-xs text-gray-500 hover:text-white">
                        {speakingIdx === i ? "⏹ stop" : "🔊 play"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* composer */}
        <div className="border-t border-white/10 p-4">
          <div className="mx-auto max-w-2xl">
            {resumeOpen && (
              <div className="mb-2 rounded-xl border border-white/15 bg-zinc-900 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">📄 Resume rework — paste it, get it back sharper</span>
                  <button onClick={() => setResumeOpen(false)} className="text-xs text-gray-500 hover:text-white">close</button>
                </div>
                <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Target role (optional) — e.g. SOC Analyst" className="mb-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none" />
                <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={5} placeholder="Paste your resume text here…" className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none" />
                <div className="mt-2 flex items-center justify-between">
                  <label className="cursor-pointer text-xs text-gray-400 hover:text-white">＋ upload .txt/.md<input type="file" accept=".txt,.md,.text,text/plain" onChange={onResumeFile} className="hidden" /></label>
                  <button onClick={improveResume} disabled={busy || resumeText.trim().length < 40} className="rounded-lg px-4 py-1.5 text-sm font-bold text-black disabled:opacity-30" style={{ background: tutor.color }}>Improve my resume →</button>
                </div>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-zinc-900 p-2">
              <button onClick={() => setMenuOpen((o) => !o)} className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold" style={{ background: `${tutor.color}26`, color: tutor.color }}>{tutor.name}</button>
              {tutor.capabilities?.includes("resume") && (
                <button onClick={() => setResumeOpen((o) => !o)} title="Improve your resume" className="shrink-0 rounded-lg px-2 py-1 text-gray-400 hover:text-white">📎</button>
              )}
              <button onClick={toggleMic} title="Talk to your tutor"
                className={`shrink-0 rounded-lg px-2 py-1 ${listening ? "animate-pulse bg-red-500 text-white" : "text-gray-400 hover:text-white"}`}>🎤</button>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={1} placeholder={`Message ${tutor.name}…`} className="max-h-40 flex-1 resize-none bg-transparent px-1 py-1.5 text-sm outline-none placeholder:text-gray-600" />
              <button onClick={() => send(input)} disabled={busy || !input.trim()} className="shrink-0 rounded-lg px-3 py-1.5 font-bold text-black disabled:opacity-30" style={{ background: tutor.color }}>↑</button>
            </div>
            <p className="mt-2 text-center text-[11px] text-gray-600">{tutor.kidSafe ? "Kid-safe tutor · " : ""}Rich Off Tech · AI Tutoring Platform</p>
          </div>
        </div>
      </main>
    </div>
  );
}
