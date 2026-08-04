"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReferralLanding() {
  const params = useParams();
  const code = String(params?.code || "").toLowerCase();
  const [referrer, setReferrer] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`/api/referral/resolve?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((j) => { setValid(!!j.valid); setReferrer(j.referrerName || null); })
      .catch(() => setValid(false));
  }, [code]);

  async function go() {
    setErr("");
    if (!email.includes("@")) { setErr("Enter a valid email — use the same one you'll pay with."); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/referral/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, email }) });
      const j = await r.json();
      if (j.ok && j.checkoutUrl) { window.location.href = j.checkoutUrl; return; }
      setErr(j.error === "unknown_code" ? "This referral link isn't valid." : "Something went wrong — try again."); setBusy(false);
    } catch { setErr("Network error — try again."); setBusy(false); }
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-16 bg-rot-bg text-rot-fg">
      <div className="max-w-md w-full bg-rot-surface border border-rot-line rounded-2xl p-8">
        <div className="text-rot-accent font-black tracking-tight text-lg mb-1">RICH OFF TECH</div>
        {valid === null ? (
          <p className="text-rot-muted">Loading…</p>
        ) : valid === false ? (
          <>
            <h1 className="text-2xl font-bold mb-2">Join Rich Off Tech</h1>
            <p className="text-rot-muted mb-4">That referral link wasn&apos;t recognized, but you can still join.</p>
            <a href="https://www.rotechllc.com" className="inline-block px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold">See the deal →</a>
          </>
        ) : (
          <>
            {referrer && <div className="inline-block text-xs px-3 py-1 rounded-full bg-rot-accent/10 text-rot-accent border border-rot-accent/30 mb-3">Referred by {referrer}</div>}
            <h1 className="text-2xl font-black mb-2">Membership — $200/year</h1>
            <p className="text-rot-muted text-sm mb-4">Referred rate — $175 off. Everyone else pays $375.</p>
            <p className="text-rot-muted mb-5">Full access for 12 months: community, AI tutors, the quiz/study engine (Security+, ServiceNow CSA, AWS AI), weekly calls, and job drops.</p>
            <label className="block text-xs uppercase tracking-wider text-rot-muted mb-2">Your email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !busy && go()}
              placeholder="you@email.com"
              type="email"
              className="w-full bg-rot-bg border border-rot-line rounded-lg px-4 py-3 mb-1 outline-none focus:border-rot-accent"
            />
            <p className="text-rot-faint text-xs mb-4">Use the same email you&apos;ll pay with — that&apos;s how {referrer || "your referrer"} gets credited automatically.</p>
            <button onClick={go} disabled={busy} className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg uppercase tracking-wider disabled:opacity-50">
              {busy ? "…" : "Continue to checkout →"}
            </button>
            {err && <div className="text-red-400 text-sm text-center mt-3">{err}</div>}
          </>
        )}
      </div>
    </main>
  );
}
