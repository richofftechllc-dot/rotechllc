"use client";
import { useState } from "react";

export default function CohortWaitlist({ cohort = "july-2026" }: { cohort?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/cohort-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, cohort }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMsg(data.error || "Something went wrong — try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setMsg("Network error — try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="bg-emerald-600/[0.07] border border-emerald-600/25 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">🎉</div>
        <div className="font-bold text-lg text-emerald-600 mb-1">You&apos;re on the list.</div>
        <p className="text-rot-muted text-sm">We&apos;ll text you the moment July cohorts drop — first dibs on a seat.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-rot-surface border border-rot-accent/30 rounded-xl p-6">
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          required
          placeholder="Phone (for the drop text)"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Get on the July waitlist →"}
      </button>
      {status === "error" && <p className="text-red-600 text-sm mt-2 text-center">{msg}</p>}
      <p className="text-rot-faint text-xs mt-3 text-center">We&apos;ll only text you about the cohort. No spam, ever.</p>
    </form>
  );
}
