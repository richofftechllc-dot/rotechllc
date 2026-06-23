"use client";
import { useEffect, useState } from "react";
import { renderMarkdownToHtml, PRINT_CSS } from "@/lib/resume/format-spec";

// Dead-simple resume builder: paste your resume, (optionally) paste the job, hit one button.
// No multi-section form, no tabs. Uses the existing /api/bo/resume engine.

const LS_TEXT = "rot.resume.text.v2";
const LS_OUT = "rot.resume.out.v2";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbY0W4ln8XRMlqCmS83cvTqA_F-nLlplfd6xC7Fow6XsQrG3URbd48j_H0qCNH4NU4/exec";

type Me = { ok: true; code: string | null; name: string; track: string | null } | { ok: false };
type RosterMember = { name: string; role: string; location: string; clearance: string; certs: string[]; years: string; linkedin?: string };

export default function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("");
  const [jobText, setJobText] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [pulling, setPulling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setResumeText(localStorage.getItem(LS_TEXT) || "");
    setOut(localStorage.getItem(LS_OUT) || "");
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);
  useEffect(() => { localStorage.setItem(LS_TEXT, resumeText); }, [resumeText]);

  async function pullFromRoster() {
    if (!me || !me.ok) return;
    setPulling(true); setErr("");
    try {
      const r = await fetch(APPS_SCRIPT_URL + "?_ts=" + Date.now());
      const rows: RosterMember[] = await r.json();
      const mine = rows.find(x => (x.name || "").trim().toLowerCase() === me.name.trim().toLowerCase());
      if (!mine) { setErr("Couldn't find your roster row — paste your resume instead."); return; }
      const starter = [
        mine.name,
        [mine.role, mine.location].filter(Boolean).join(" · "),
        mine.years ? `${mine.years} experience` : "",
        mine.clearance ? `Clearance: ${mine.clearance}` : "",
        mine.certs?.length ? `Certifications: ${mine.certs.join(", ")}` : "",
        mine.linkedin ? `LinkedIn: ${mine.linkedin}` : "",
        "", "EXPERIENCE", "(paste or type your roles + bullets here)",
      ].filter(v => v !== undefined).join("\n");
      setResumeText(prev => prev.trim() ? prev : starter);
    } catch { setErr("Roster is unavailable right now — paste your resume instead."); }
    finally { setPulling(false); }
  }

  async function build() {
    if (resumeText.trim().length < 40) { setErr("Paste your resume first (a few lines is fine)."); return; }
    setBusy(true); setErr(""); setCopied(false);
    try {
      const target = [role, jobText].filter(Boolean).join("\n").slice(0, 1500);
      const r = await fetch("/api/bo/resume", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, role: target }),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || "Couldn't generate — try again."); return; }
      setOut(d.resume || d.text || "");
      localStorage.setItem(LS_OUT, d.resume || d.text || "");
      window.scrollTo({ top: 9999, behavior: "smooth" });
    } catch { setErr("Network hiccup — try again."); }
    finally { setBusy(false); }
  }

  function copy() { navigator.clipboard.writeText(out).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }
  function printResume() {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html><head><title>Resume</title><style>${PRINT_CSS}</style></head><body>${renderMarkdownToHtml(out)}</body></html>`);
    w.document.close(); w.focus(); setTimeout(() => w.print(), 250);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-gray-100">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <div className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase mb-2">ROT Resume Builder</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Paste it. Pick the job. Done.</h1>
        <p className="text-gray-400 mt-3 max-w-xl">Drop your current resume, optionally paste the job you want, and Bo Tech rewrites it ATS-safe in the Rich Off Tech format — using only your real facts. No long forms.</p>

        {me?.ok && (
          <div className="mt-6 flex items-center justify-between gap-3 bg-[#141416] border border-[#262629] rounded-xl px-4 py-3">
            <div className="text-sm"><span className="font-semibold">Signed in as {me.name}</span><span className="text-gray-500 ml-2">{me.code}</span></div>
            <button onClick={pullFromRoster} disabled={pulling} className="text-sm px-3 py-1.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 disabled:opacity-50">{pulling ? "Pulling…" : "↓ Pull from roster"}</button>
          </div>
        )}

        {/* Step 1 */}
        <div className="mt-7">
          <label className="block text-sm font-semibold mb-2"><span className="text-orange-500 mr-2">1</span>Your resume</label>
          <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} rows={10}
            placeholder="Paste your current resume here — or your work history, bullet points, whatever you've got. Bo cleans it up."
            className="w-full bg-[#141416] border border-[#262629] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-y" />
        </div>

        {/* Step 2 */}
        <div className="mt-5">
          <label className="block text-sm font-semibold mb-2"><span className="text-orange-500 mr-2">2</span>Target job <span className="text-gray-500 font-normal">(optional — makes it sharper)</span></label>
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="Job title (e.g. ServiceNow Administrator)"
            className="w-full bg-[#141416] border border-[#262629] rounded-xl px-4 py-2.5 text-sm mb-2 focus:outline-none focus:border-orange-500" />
          <textarea value={jobText} onChange={e => setJobText(e.target.value)} rows={3}
            placeholder="Paste the job description (optional) — Bo mirrors its keywords where they're true."
            className="w-full bg-[#141416] border border-[#262629] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-y" />
        </div>

        {err && <div className="mt-4 text-sm text-red-400">{err}</div>}

        <button onClick={build} disabled={busy} className="mt-6 w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 disabled:opacity-60">
          {busy ? "Bo is building it…" : "✦ Build my resume"}
        </button>

        {/* Result */}
        {out && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Your resume</h2>
              <div className="flex gap-2">
                <button onClick={copy} className="text-sm px-3 py-1.5 rounded-lg border border-[#262629] hover:bg-[#141416]">{copied ? "Copied ✓" : "Copy"}</button>
                <button onClick={printResume} className="text-sm px-3 py-1.5 rounded-lg border border-[#262629] hover:bg-[#141416]">Print / PDF</button>
                <button onClick={build} disabled={busy} className="text-sm px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50">Regenerate</button>
              </div>
            </div>
            <div className="bg-white text-black rounded-xl p-8 overflow-x-auto" dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(out) }} />
          </div>
        )}
      </div>
    </main>
  );
}
