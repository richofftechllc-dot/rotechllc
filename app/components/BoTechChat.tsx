"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Msg = { role: "user" | "assistant"; content: string };

export default function BoTechChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Yo. I'm Bo Tech. What you trying to figure out?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  // Lazy-load history the first time the chat opens (skip if anonymous → just keeps the greeting).
  useEffect(() => {
    if (!open || historyLoaded) return;
    setHistoryLoaded(true);
    fetch("/api/chat")
      .then(r => r.ok ? r.json() : { messages: [] })
      .then(data => {
        const history: Msg[] = Array.isArray(data?.messages) ? data.messages : [];
        if (history.length === 0) return; // keep the default greeting
        setMsgs([
          { role: "assistant", content: "Yo, back to it. Picking up where we left off." },
          ...history.map((m: Msg) => ({ role: m.role, content: m.content })),
        ]);
      })
      .catch(() => { /* silent — keep greeting */ });
  }, [open, historyLoaded]);

  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent<{ prefill?: string; context?: { domainId?: string; domainName?: string; timestamp_sec?: number } }>).detail;
      setOpen(true);
      if (detail?.prefill) setInput(detail.prefill);
      if (detail?.context) {
        const ctx = detail.context;
        setMsgs(prev => {
          const last = prev[prev.length - 1];
          const hint = `Bo here — I see you're on ${ctx.domainName || "this lesson"}${typeof ctx.timestamp_sec === "number" ? ` at ${Math.floor(ctx.timestamp_sec / 60)}:${String(ctx.timestamp_sec % 60).padStart(2, "0")}` : ""}. Ask the question.`;
          if (last?.role === "assistant" && last.content === hint) return prev;
          return [...prev, { role: "assistant", content: hint }];
        });
      }
    }
    window.addEventListener("bo-tech:open", handleOpen);
    return () => window.removeEventListener("bo-tech:open", handleOpen);
  }, []);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMsgs(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const code = typeof document !== "undefined" ? document.cookie.split("rot_code=")[1]?.split(";")[0] : null;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, accessCode: code || null }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: "assistant", content: data.reply || "Something broke." }]);
    } catch {
      setMsgs(prev => [...prev, { role: "assistant", content: "Connection issue. Try again." }]);
    }
    setLoading(false);
  }

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shadow-orange-500/30 hover:scale-105 transition z-50">
          <Image src="/bo-avatar.png" alt="Bo Tech" width={64} height={64} />
        </button>
      )}
      {open && (
        <div className="fixed bottom-6 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image src="/bo-avatar.png" alt="Bo" width={32} height={32} className="rounded-full" />
              <div>
                <div className="font-bold text-sm">Bo Tech</div>
                <div className="text-xs text-green-500">● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div className={`inline-block px-4 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-orange-500 text-black" : "bg-white/10 text-white"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-xs">Bo is typing...</div>}
          </div>
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask Bo anything..." className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
            <button onClick={send} disabled={loading} className="px-4 py-2 bg-orange-500 text-black rounded-lg text-sm font-bold hover:bg-orange-400 disabled:opacity-50">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
