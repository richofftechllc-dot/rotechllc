"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Me = { ok: true; code: string; name: string; track: string | null } | { ok: false };

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

  const quizUrl = `https://richofftechllc-dot.github.io/rot-quiz/?ref=${btoa(me.code)}`;

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
        <a href={quizUrl} target="_blank" rel="noopener noreferrer" className="px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg">Open Full Quiz</a>
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
