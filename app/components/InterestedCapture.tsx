"use client";
import { useState } from "react";

// Email capture for the INTERESTED side of the home fork. Mirrors CohortWaitlist's
// shape and states on purpose — same submit/loading/done/error flow, so there is one
// form pattern on this site rather than two.
//
// Email only. Asking for a phone number in exchange for a free study plan is a bad
// trade and it is the reason most of these forms go unfilled.
export default function InterestedCapture() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/interested", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
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
      <div className="bg-rot-warn/10 border border-rot-warn/30 rounded-xl p-5 text-center">
        <div className="font-bold text-rot-warn mb-1">Got you.</div>
        <p className="rot-silver-muted text-sm">
          Nothing to pay and nothing to unsubscribe from twice — we&apos;ll send the guides
          and tell you when something worth your time drops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white/45 border border-rot-silver-line rounded-xl p-5">
      <label className="block text-xs uppercase tracking-widest rot-silver-muted mb-3 font-bold">
        Send me the free guides
      </label>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-3 bg-white/80 border border-rot-silver-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-fg focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/80 border border-rot-silver-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-fg focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3.5 text-sm font-semibold rounded-lg bg-rot-fg text-white hover:opacity-90 transition disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send them over"}
      </button>
      {status === "error" && <div className="text-red-700 text-sm mt-3 text-center">{msg}</div>}
      <p className="text-rot-silver-muted text-xs mt-3 text-center">No card. No spam. Unsubscribe whenever.</p>
    </form>
  );
}
