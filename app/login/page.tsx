"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const ERRORS: Record<string, string> = {
  not_in_server: "You're not in the ROT Discord server. Join first then try again.",
  no_role: "You don't have Founding Member access yet. Contact Bo.",
  token_failed: "Discord login failed. Try again.",
  no_code: "Discord login cancelled.",
  user_failed: "Could not fetch your Discord profile. Try again.",
  server_error: "Server error. Try again.",
};

export default function Login() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(ERRORS[e] || "Login failed. Try again.");
  }, []);

  async function signIn() {
    setErr("");
    const c = code.trim().toUpperCase();
    if (!c) { setErr("Enter your access code."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) { setErr(data.error || "Invalid code"); setLoading(false); return; }
      const from = new URLSearchParams(window.location.search).get("from");
      window.location.href = from || "/quiz";
    } catch {
      setErr("Network error");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-10 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image src="/bo-avatar.png" alt="ROT" width={80} height={80} className="rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Member Sign In</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Use Discord or your access code</p>

        <a href="/api/auth/discord"
          className="flex items-center justify-center gap-3 w-full py-3 rounded-lg mb-4 font-bold text-white transition-colors"
          style={{ backgroundColor: "#5865F2" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Sign in with Discord
        </a>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-500 text-xs">or use access code</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Access Code</label>
        <input value={code} onChange={e => setCode(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && signIn()}
          placeholder="FIRSTNAME2026" autoCapitalize="characters" disabled={loading}
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 mb-4 outline-none focus:border-orange-500 disabled:opacity-50" />
        <button onClick={signIn} disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg uppercase tracking-wider disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {err && <div className="text-red-400 text-sm text-center mt-3">{err}</div>}
        <div className="text-center text-xs text-gray-500 mt-6">
          Not a member? <a href="https://square.link/u/7P6knSUK" className="text-orange-500">Join ROT — $96</a>
        </div>
      </div>
    </main>
  );
}
