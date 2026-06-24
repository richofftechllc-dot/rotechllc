"use client";

// /k12 — TEST page. Wraps the real K-12 tutors (lib/tutors.ts) in a friendly
// "Model of Care" flow: Understand the learner → Match a tutor → Learn → Adjust.
// Public, not gated, not linked (middleware doesn't match /k12). The intake is a
// light, non-clinical version of the care model's "screen & understand" step.

import { useMemo, useState } from "react";
import { TUTORS } from "@/lib/tutors";

const SUBJECTS = [
  { key: "math", label: "Math", tutorId: "ada" },
  { key: "science", label: "Science", tutorId: "nova" },
  { key: "social", label: "Social Studies / History", tutorId: "reed" },
  { key: "english", label: "Reading & Writing", tutorId: "ariel" },
];
const GRADES = ["K-2", "3-5", "6-8", "9-12"];
const FOCUS = [
  { key: "distract", label: "I lose focus fast / get distracted" },
  { key: "reexplain", label: "I need it explained a few different ways" },
  { key: "practice", label: "I get it but need practice" },
  { key: "ahead", label: "I'm ahead and want a challenge" },
];
const FOCUS_PLAN: Record<string, string> = {
  distract: "short, one-step turns with quick check-ins to keep your attention locked",
  reexplain: "the same idea taught more than one way until it clicks — switch the style anytime",
  practice: "worked examples plus practice questions until it's automatic",
  ahead: "tougher problems and next-level concepts so you're not bored",
};

const STAGES = [
  { n: "1", t: "Understand", d: "A few quick questions about the learner" },
  { n: "2", t: "Match", d: "The right tutor + how it should teach you" },
  { n: "3", t: "Learn", d: "Chat, examples, your own pace" },
  { n: "4", t: "Adjust", d: "Switch tutors/style anytime it's not landing" },
];

export default function K12Page() {
  const k12 = useMemo(() => TUTORS.filter((t) => t.category === "K-12"), []);
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [focus, setFocus] = useState("");

  const rec = SUBJECTS.find((s) => s.key === subject);
  const tutor = rec ? TUTORS.find((t) => t.id === rec.tutorId) : null;
  const ready = !!(grade && subject && focus);

  const wrap: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "0 18px" };
  const card: React.CSSProperties = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(16,24,40,.06)" };
  const pill = (active: boolean, color = "#2563eb"): React.CSSProperties => ({
    padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 600, fontSize: 14,
    border: active ? `2px solid ${color}` : "1px solid #d6dae1", background: active ? "#eff4ff" : "#fff", color: "#0f172a",
  });

  return (
    <main style={{ minHeight: "100vh", background: "#f4f5f7", color: "#0f172a", padding: "30px 0 70px", fontFamily: "-apple-system,Segoe UI,Roboto,Arial,sans-serif", lineHeight: 1.55 }}>
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ width: 34, height: 34, borderRadius: 8, background: "#0f172a", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>RT</span>
          <span style={{ fontWeight: 800 }}>Rich Off Tech · K-12 <span style={{ color: "#64748b", fontWeight: 600 }}>· Model of Care (test)</span></span>
        </div>

        <h1 style={{ fontSize: "clamp(26px,5vw,40px)", lineHeight: 1.05, letterSpacing: "-.02em", margin: "8px 0 8px" }}>A tutor that fits the learner.</h1>
        <p style={{ color: "#64748b", fontSize: 17, margin: "0 0 18px", maxWidth: "58ch" }}>Same idea every great support plan uses: understand the student first, match the right help, then adjust as you go. Tell us a little and we&apos;ll point you to your tutor.</p>

        {/* Model of Care stages */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, margin: "0 0 22px" }}>
          {STAGES.map((s) => (
            <div key={s.n} style={{ ...card, padding: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flex: "none", width: 26, height: 26, borderRadius: 7, background: "#2563eb", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 13 }}>{s.n}</span>
              <div><div style={{ fontWeight: 700 }}>{s.t}</div><div style={{ color: "#64748b", fontSize: 13 }}>{s.d}</div></div>
            </div>
          ))}
        </div>

        {/* Step 1: Understand */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#64748b", marginBottom: 12 }}>Understand the learner</div>

          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Grade</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {GRADES.map((g) => <button key={g} type="button" style={pill(grade === g)} onClick={() => setGrade(g)}>{g}</button>)}
          </div>

          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Subject</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {SUBJECTS.map((s) => <button key={s.key} type="button" style={pill(subject === s.key)} onClick={() => setSubject(s.key)}>{s.label}</button>)}
          </div>

          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>What fits you best?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FOCUS.map((f) => <button key={f.key} type="button" style={pill(focus === f.key, "#10b981")} onClick={() => setFocus(f.key)}>{f.label}</button>)}
          </div>
        </div>

        {/* Step 2: Match */}
        {ready && tutor && (
          <div style={{ ...card, borderLeft: `5px solid ${tutor.color}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: "#64748b", marginBottom: 8 }}>Your match</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 46, height: 46, borderRadius: 12, background: tutor.color, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20 }}>{tutor.initial}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{tutor.name}</div>
                <div style={{ color: "#64748b", fontSize: 14 }}>{tutor.subject} · grades {tutor.gradeBand}</div>
              </div>
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 15 }}>
              For a <b>{grade}</b> learner working on <b>{rec?.label}</b>, {tutor.name} will give you <b>{FOCUS_PLAN[focus]}</b>. If it&apos;s still not landing, you can switch the tutor or the style anytime — that&apos;s the &quot;adjust&quot; step, and it&apos;s the whole point.
            </p>
            <a href={`/bo`} style={{ display: "inline-block", marginTop: 16, padding: "12px 20px", borderRadius: 11, background: tutor.color, color: "#fff", fontWeight: 700, textDecoration: "none" }}>
              Start with {tutor.name} →
            </a>
            <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 14 }}>Kid-safe by design: never asks for personal info, age-appropriate only, and steers anything serious to a trusted adult. Sessions aren&apos;t stored.</p>
          </div>
        )}

        {!ready && (
          <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", marginTop: 6 }}>Pick a grade, subject, and what fits you — your tutor match shows up here.</p>
        )}

        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, marginTop: 36, fontFamily: "monospace" }}>
          RICH OFF TECH · K-12 ADAPTIVE TUTOR · MODEL OF CARE (TEST) · {k12.length} tutors live
        </div>
      </div>
    </main>
  );
}
