"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Rotating montage background. Drop the tech-news infographics into
// public/ai/ as news-1.jpg … news-4.jpg (any of these missing just shows the
// gradient underneath — no broken images). Phase 2 will swap this to read the
// latest 5 graphics from the techNewsPosts Firebase collection automatically.
const MONTAGE = ["/ai/news-1.jpg", "/ai/news-2.jpg", "/ai/news-3.jpg", "/ai/news-4.jpg"];

export default function AiWaitlist() {
  const [idx, setIdx] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  // cross-fade montage every 5s
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MONTAGE.length), 5000);
    return () => clearInterval(t);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMsg("");
    try {
      const r = await fetch("/api/ai-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await r.json();
      if (data.ok) {
        setStatus("done");
        setMsg(data.already ? "You're already on the list — we got you." : "You're on the list. 🔵");
      } else {
        setStatus("error");
        setMsg(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Rotating montage background */}
      <div className="absolute inset-0 z-0">
        {MONTAGE.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url(${src})`, opacity: i === idx ? 0.5 : 0 }}
          />
        ))}
        {/* gradient base (always visible, and the fallback if images aren't added yet) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-black" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
        <Image src="/rot-logo.png" alt="Rich Off Tech" width={64} height={64} className="mb-6 opacity-90" />

        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-400">
          Rich Off Tech · AI
        </p>
        <h1 className="text-4xl font-black leading-[1.05] sm:text-5xl">
          Daily Tech &amp; <span className="text-blue-400">AI Intel.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm text-gray-300 sm:text-base">
          The headlines that move careers and markets — read, analyzed, and sent straight to your
          phone. Join the waitlist to get the drop first.
        </p>

        {status === "done" ? (
          <div className="mt-10 w-full rounded-2xl border border-blue-500/40 bg-blue-950/40 p-8">
            <div className="text-3xl">✅</div>
            <p className="mt-3 text-lg font-bold text-blue-300">{msg}</p>
            <p className="mt-1 text-sm text-gray-400">
              We&apos;ll text you when the daily intel goes live. Welcome to the inside.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 w-full space-y-3 text-left">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-400"
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number to join"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 font-bold uppercase tracking-wide transition hover:bg-blue-500 disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Join the Waitlist"}
            </button>
            {status === "error" && <p className="text-sm text-red-400">{msg}</p>}
            <p className="pt-1 text-center text-[11px] text-gray-500">
              We&apos;ll only text you ROT tech intel. No spam. Opt out anytime.
            </p>
          </form>
        )}

        <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">
          Read · Analyze · Move
        </p>
      </div>
    </main>
  );
}
