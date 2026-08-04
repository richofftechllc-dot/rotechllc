"use client";
import { useState } from "react";

// "Don't see yours?" box on /certifications.
//
// Same submit/loading/done/error shape as InterestedCapture and CohortWaitlist so
// there is one form pattern on this site. The cert field is the point — it is a
// named demand signal for a product we don't sell yet, and it lands in the CRM
// Leads tab with the cert attached.
export default function CertRequest() {
  const [cert, setCert] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/cert-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cert, name, email }),
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
        <div className="font-bold text-lg text-emerald-600 mb-1">Asked and answered — soon.</div>
        <p className="text-rot-muted text-sm">
          That went straight to Bo. If there&apos;s an online exam for it, you&apos;ll get a
          plan and a price back.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="text-left">
      <div className="grid sm:grid-cols-3 gap-3 mb-3">
        <input
          value={cert}
          onChange={(e) => setCert(e.target.value)}
          required
          placeholder="Which cert? (e.g. CCNA)"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-accent/30 rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
          className="w-full px-4 py-3 bg-rot-bg border border-rot-line rounded-lg text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rot-btn-accent w-full py-3.5 text-sm disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Ask about this cert →"}
      </button>
      {status === "error" && <div className="text-red-600 text-sm mt-3 text-center">{msg}</div>}
      <p className="text-rot-faint text-xs mt-3 text-center">Goes straight to Bo. No card, no commitment.</p>
    </form>
  );
}
