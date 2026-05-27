"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Me =
  | { ok: true; code: string | null; name: string; track: string | null; authType: string }
  | { ok: false };

export default function Quiz() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

  if (!me) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center"><h1 className="text-4xl font-black mb-4">Loading...</h1></main>;
  }
  if (!me.ok) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  // Discord-only auth (no linked quiz code)
  if (!me.code) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <Image src="/bo-avatar.png" alt="ROT" width={80} height={80} className="rounded-full mx-auto mb-6" />
        <h1 className="text-3xl font-black mb-4">Welcome, {me.name}</h1>
        <p className="text-gray-400 mb-2 leading-relaxed">
          You're signed in via Discord, but your account isn't linked to a quiz code yet.
        </p>
        <p className="text-gray-400 mb-8 leading-relaxed">
          DM Bo in Discord to get your access code, then sign back in.
        </p>
        <a href="https://discord.gg/3gFdWYtPB" target="_blank" rel="noopener"
           className="inline-block px-6 py-3 text-white font-bold rounded-lg transition-colors"
           style={{ backgroundColor: "#5865F2" }}>
          Open ROT Discord
        </a>
        <p className="text-gray-600 text-xs mt-8">
          Already have a code? <a href="/login" className="text-orange-500 underline">Sign in with code</a>
        </p>
      </main>
    );
  }

  // Code-authenticated user — show quiz
  const quizUrl = `https://learn.rotechllc.com/?ref=${btoa(me.code)}`;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-black">Your Quiz</h1>
          <p className="text-gray-400 mt-2">
            Signed in as <span className="text-orange-500 font-semibold">{me.name}</span>
            <span className="text-gray-500 font-mono ml-2 text-sm">{me.code}</span>
          </p>
          {me.track && <p className="text-gray-500 text-sm mt-1">{me.track}</p>}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
          <iframe src={quizUrl} className="w-full h-[75vh]" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
        </div>
        <div className="bg-zinc-900 border border-orange-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Image src="/bo-avatar.png" alt="Bo" width={48} height={48} className="rounded-full border-2 border-orange-500" />
            <div>
              <div className="font-bold">Bo Tech</div>
              <div className="text-green-500 text-xs">Quiz Assistant</div>
            </div>
          </div>
          <div className="text-gray-400 text-sm space-y-3">
            <p>Yo. I'm here while you study.</p>
            <p>Stuck on a question? Need a concept explained? Hit the chat bubble bottom-right and ask.</p>
            <p className="text-orange-500 font-bold mt-4">Quick tips:</p>
            <ul className="space-y-2">
              <li>Read every answer before picking</li>
              <li>Eliminate wrong ones first</li>
              <li>Accuracy beats speed</li>
              <li>Note ones you guess to review</li>
            </ul>
            <p className="text-gray-500 text-xs italic mt-6">Bo can explain any cert concept — ask in the chat.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
