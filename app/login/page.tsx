"use client";
import Image from "next/image";
import { useState } from "react";

export default function Login() {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  function signIn() {
    const c = code.trim().toUpperCase();
    if (!c) { setErr("Enter your access code."); return; }
    document.cookie = `rot_code=${c}; path=/; max-age=2592000; SameSite=Lax`;
    window.location.href = "/quiz";
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 py-16">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-10 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image src="/bo-avatar.png" alt="ROT" width={80} height={80} className="rounded-full" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Member Sign In</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your access code to continue</p>
        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">Access Code</label>
        <input value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && signIn()}
          placeholder="FIRSTNAME2026" autoCapitalize="characters"
          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 mb-4 outline-none focus:border-orange-500" />
        <button onClick={signIn} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg uppercase tracking-wider">Sign In</button>
        {err && <div className="text-red-500 text-sm text-center mt-3">{err}</div>}
        <div className="text-center text-xs text-gray-500 mt-6">Not a member? <a href="https://square.link/u/7P6knSUK" className="text-orange-500">Join ROT — $96</a></div>
      </div>
    </main>
  );
}
