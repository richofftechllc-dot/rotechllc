"use client";
import { useEffect, useState } from "react";

export default function Quiz() {
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    const c = document.cookie.split("rot_code=")[1]?.split(";")[0];
    setCode(c || null);
  }, []);

  if (!code) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl font-black mb-4">Quiz Access</h1>
        <p className="text-gray-400 mb-8">Sign in with your access code to unlock the quiz system.</p>
        <a href="/login" className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg">Sign In</a>
      </main>
    );
  }

  const quizUrl = `https://richofftechllc-dot.github.io/rot-quiz/?ref=${btoa(code)}`;
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-black mb-2">Your Quiz</h1>
      <p className="text-gray-400 mb-6">Signed in as <span className="text-orange-500 font-mono">{code}</span></p>
      <iframe src={quizUrl} className="w-full h-[80vh] rounded-xl border border-white/10" />
    </main>
  );
}
