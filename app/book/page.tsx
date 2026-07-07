"use client";

// Public "book a 1-on-1" page. Members pick a coach, an upcoming slot, a topic, and
// leave name + email. Posts to /api/book → writes to `bookings` (source:"web"). The
// Discord bot mints the Google Meet + Fireflies invite and emails the link. Public
// route (middleware does not gate /book).
//
// The times come STRAIGHT from the coach's CRM schedule (GET /api/book?coach=) — the same
// source Discord reads. A coach with no schedule shows no times. One source of truth.

import { useEffect, useState } from "react";

const COACHES = [
  { key: "randy", name: "Randy" },
  { key: "tyler", name: "Tyler" },
  { key: "daquan", name: "Daquan" },
];
const TOPICS = ["Certifications / studying", "Career / resume", "Clearance", "General / not sure yet"];

type Slot = { value: string; label: string };

export default function BookPage() {
  const [coach, setCoach] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState(TOPICS[3]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  // Whether ANY coach has open times right now (drives the whole-page closed state).
  const [gate, setGate] = useState<"checking" | "open" | "closed">("checking");

  useEffect(() => {
    let alive = true;
    fetch("/api/book")
      .then((r) => r.json())
      .then((d) => { if (alive) setGate(d?.open ? "open" : "closed"); })
      .catch(() => { if (alive) setGate("closed"); });
    return () => { alive = false; };
  }, []);

  // Load the selected coach's real slots from their CRM schedule.
  useEffect(() => {
    if (!coach) { setSlots([]); setSlot(""); return; }
    let alive = true;
    setSlotsLoading(true); setSlot("");
    fetch(`/api/book?coach=${coach}`)
      .then((r) => r.json())
      .then((d) => { if (alive) { setSlots(Array.isArray(d?.slots) ? d.slots : []); setSlotsLoading(false); } })
      .catch(() => { if (alive) { setSlots([]); setSlotsLoading(false); } });
    return () => { alive = false; };
  }, [coach]);

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
      else {
        setState("error"); setMsg(d.error || "Something went wrong — try again.");
        // Time got taken or schedule changed — refresh this coach's slots.
        if (d.closed) { setSlot(""); fetch(`/api/book?coach=${coach}`).then((x) => x.json()).then((x) => setSlots(Array.isArray(x?.slots) ? x.slots : [])).catch(() => {}); }
      }
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

  if (gate === "checking") {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#5f6368", display: "grid", placeItems: "center", padding: 24, fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
        <p>Loading…</p>
      </main>
    );
  }

  if (gate === "closed") {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#202124", display: "grid", placeItems: "center", padding: 24, fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
        <div style={{ background: "#fff", border: "1px solid #dadce0", borderRadius: 16, padding: 32, maxWidth: 460, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>📅</div>
          <h1 style={{ fontSize: 22, margin: "8px 0" }}>Booking is closed right now</h1>
          <p style={{ color: "#5f6368" }}>1-on-1 slots open up when a coach posts their availability. Check back soon, or reach out in the Discord and we&apos;ll get you on the list.</p>
        </div>
      </main>
    );
  }

  // Time-picker inner content depends on coach selection + that coach's slots.
  const timePicker = () => {
    if (!coach) return <p style={{ color: "#9aa0a6", fontSize: 14, margin: "8px 0 0" }}>Pick a coach first.</p>;
    if (slotsLoading) return <p style={{ color: "#9aa0a6", fontSize: 14, margin: "8px 0 0" }}>Loading times…</p>;
    if (slots.length === 0) return <p style={{ color: "#9aa0a6", fontSize: 14, margin: "8px 0 0" }}>No open times with {COACHES.find((c) => c.key === coach)?.name} right now — try another coach.</p>;
    return (
      <select value={slot} onChange={(e) => setSlot(e.target.value)}
        style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", background: "#fff", fontSize: 15 }}>
        <option value="">Pick a time…</option>
        {slots.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    );
  };

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
        {timePicker()}

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
