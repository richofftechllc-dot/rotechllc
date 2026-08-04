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
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center">
        <div className="font-bold text-blue-300 mb-1">Got you.</div>
        <p className="text-rot-muted text-sm">
          Nothing to pay and nothing to unsubscribe from twice — we&apos;ll send the guides
          and tell you when something worth your time drops.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-rot-sunken border border-rot-line rounded-xl p-5">
      <label className="block text-xs uppercase tracking-widest text-rot-faint mb-3 font-bold">
        Send me the free guides
      </label>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-blue-400 focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-blue-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rot-btn w-full py-3.5 text-sm disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send them over"}
      </button>
      {status === "error" && <div className="text-red-600 text-sm mt-3 text-center">{msg}</div>}
      <p className="text-rot-faint text-xs mt-3 text-center">No card. No spam. Unsubscribe whenever.</p>
    </form>
  );
}
