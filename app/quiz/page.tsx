"use client";
import { useEffect } from "react";

export default function Quiz() {
  useEffect(() => {
    const code = document.cookie.split("rot_code=")[1]?.split(";")[0];
    if (!code) {
      window.location.href = "/login";
      return;
    }
    window.location.href = `https://richofftechllc-dot.github.io/rot-quiz/?ref=${btoa(code)}`;
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-black mb-4">Loading Your Quiz...</h1>
      <p className="text-gray-400">Auto-signing you in.</p>
    </main>
  );
}
