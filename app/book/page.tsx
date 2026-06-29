"use client";

// Public "book a 1-on-1" page. Members pick a coach, an upcoming slot, a topic, and
// leave name + email. Posts to /api/book → writes to `bookings` (source:"web"). The
// Discord bot mints the Google Meet + Fireflies invite and emails the link. Public
// route (middleware does not gate /book). ET business hours, next 7 days.

import { useMemo, useState } from "react";

const COACHES = [
  { key: "randy", name: "Randy" },
  { key: "tyler", name: "Tyler" },
  { key: "daquan", name: "Daquan" },
];
const TOPICS = ["Certifications / studying", "Career / resume", "Clearance", "General / not sure yet"];

type Slot = { value: string; label: string };

// Build ET slots (11:00–16:30, every 30 min) for the next 7 days. value carries an
// explicit -04:00 (EDT) offset so the time is unambiguous regardless of the visitor's TZ.
function buildSlots(): Slot[] {
  const out: Slot[] = [];
  const now = Date.now();
  for (let d = 0; d < 7; d++) {
    const base = new Date();
    base.setDate(base.getDate() + d);
    const y = base.getFullYear(), m = base.getMonth(), day = base.getDate();
    for (let h = 11; h <= 16; h++) {
      for (const min of [0, 30]) {
        const mm = String(min).padStart(2, "0");
        const dd = String(day).padStart(2, "0");
        const mo = String(m + 1).padStart(2, "0");
        const value = `${y}-${mo}-${dd}T${String(h).padStart(2, "0")}:${mm}:00-04:00`;
        const t = Date.parse(value);
        if (isNaN(t) || t < now + 30 * 60 * 1000) continue; // skip past / too-soon
        const label = new Date(value).toLocaleString("en-US", {
          timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
        }) + " ET";
        out.push({ value, label });
      }
    }
  }
  return out;
}

export default function BookPage() {
  const slots = useMemo(buildSlots, []);
  const [coach, setCoach] = useState("");
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState(TOPICS[3]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit() {
    setState("sending"); setMsg("");
    const label = slots.find((s) => s.value === slot)?.label || "";
    try {
      const r = await fetch("/api/book", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coach, slot, label, topic, name, email }),
      });
      const d = await r.json();
      if (d.ok) { setState("done"); }
      else { setState("error"); setMsg(d.error || "Something went wrong — try again."); }
    } catch { setState("error"); setMsg("Couldn't reach the server — try again."); }
  }

  const ready = coach && slot && name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (state === "done") {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#202124", display: "grid", placeItems: "center", padding: 24, fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
        <div style={{ background: "#fff", border: "1px solid #dadce0", borderRadius: 16, padding: 32, maxWidth: 460, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <h1 style={{ fontSize: 22, margin: "8px 0" }}>You&apos;re booked!</h1>
          <p style={{ color: "#5f6368" }}>Your Google Meet link is on the way to <b>{email}</b> — Fireflies will record the call automatically. See you soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#202124", padding: "32px 18px", fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ borderBottom: "3px solid #111", paddingBottom: 10, marginBottom: 22, fontWeight: 800, letterSpacing: ".04em" }}>RICH OFF TECH</div>
        <h1 style={{ fontSize: 26, margin: "0 0 6px" }}>Book a 1-on-1</h1>
        <p style={{ color: "#5f6368", marginTop: 0 }}>30 minutes on Google Meet. You&apos;ll get the join link by email, and the call records automatically.</p>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Coach</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COACHES.map((c) => (
            <button key={c.key} onClick={() => setCoach(c.key)} type="button"
              style={{ padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600,
                border: coach === c.key ? "2px solid #f97316" : "1px solid #dadce0",
                background: coach === c.key ? "#fff7ed" : "#fff", color: "#202124" }}>{c.name}</button>
          ))}
        </div>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Time (ET)</label>
        <select value={slot} onChange={(e) => setSlot(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", background: "#fff", fontSize: 15 }}>
          <option value="">Pick a time…</option>
          {slots.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Topic</label>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", background: "#fff", fontSize: 15 }}>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First & last"
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", fontSize: 15 }} />

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Email (gets your Meet link)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email"
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", fontSize: 15 }} />

        {state === "error" && <p style={{ color: "#d93025", fontSize: 14, marginTop: 14 }}>{msg}</p>}

        <button onClick={submit} disabled={!ready || state === "sending"} type="button"
          style={{ width: "100%", marginTop: 24, padding: 14, borderRadius: 11, border: "none", fontWeight: 700, fontSize: 16,
            cursor: ready && state !== "sending" ? "pointer" : "not-allowed",
            background: ready ? "#202124" : "#c8ccd0", color: "#fff" }}>
          {state === "sending" ? "Booking…" : "Book my 1-on-1"}
        </button>
      </div>
    </main>
  );
}
