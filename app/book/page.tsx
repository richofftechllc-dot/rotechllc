"use client";

// "Book a 1-on-1" page. Members pick a coach, an upcoming slot, a topic, and confirm.
// Posts to /api/book → writes to `bookings` (source:"web"). The Discord bot mints the
// Google Meet + Fireflies invite, emails the member the link, AND pings the coach.
// Public route (middleware does not gate /book), but if the visitor is logged in we
// prefill + lock their name/email from the session so they never re-type it. The
// coach's real hours (set in the CRM / over Discord) are surfaced under the time picker.

import { useEffect, useMemo, useState } from "react";

const COACHES = [
  { key: "randy", name: "Randy" },
  { key: "tyler", name: "Tyler" },
  { key: "daquan", name: "Daquan" },
];
const TOPICS = ["Certifications / studying", "Career / resume", "Clearance", "General / not sure yet"];

type Slot = { value: string; label: string };
type CoachAvail = { slug: string; name: string; days: Record<string, string>; note: string };

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

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BookPage() {
  const slots = useMemo(buildSlots, []);
  const [coach, setCoach] = useState("");
  const [slot, setSlot] = useState("");
  const [topic, setTopic] = useState(TOPICS[3]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [avail, setAvail] = useState<CoachAvail[]>([]);

  // Prefill identity from the session (logged-in members), and pull coach availability.
  useEffect(() => {
    fetch("/api/book/me").then(r => r.json()).then(d => {
      if (d?.ok && (d.name || d.email)) { if (d.name) setName(d.name); if (d.email) setEmail(d.email); setLoggedIn(true); }
    }).catch(() => {});
    fetch("/api/availability").then(r => r.json()).then(d => { if (d?.ok && Array.isArray(d.coaches)) setAvail(d.coaches); }).catch(() => {});
  }, []);

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
  const homeHref = loggedIn ? "/home" : "/";
  const coachAvail = avail.find(c => c.slug === coach);
  const availDays = coachAvail ? DAY_ORDER.filter(d => coachAvail.days[d]) : [];

  if (state === "done") {
    return (
      <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#202124", display: "grid", placeItems: "center", padding: 24, fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
        <div style={{ background: "#fff", border: "1px solid #dadce0", borderRadius: 16, padding: 32, maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <h1 style={{ fontSize: 22, margin: "8px 0" }}>You&apos;re booked!</h1>
          <p style={{ color: "#5f6368" }}>
            <b>{COACHES.find(c => c.key === coach)?.name || "Your coach"}</b> just got pinged in Discord, and your
            Google&nbsp;Meet link is on the way to <b>{email}</b>. Fireflies records the call automatically. See you soon.
          </p>
          <a href={homeHref} style={{ display: "inline-block", marginTop: 18, padding: "10px 18px", borderRadius: 10, background: "#202124", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            ← Back to {loggedIn ? "Home" : "Rich Off Tech"}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f9fa", color: "#202124", padding: "32px 18px", fontFamily: "-apple-system,Segoe UI,Roboto,sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <a href={homeHref} style={{ display: "inline-block", color: "#5f6368", textDecoration: "none", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>← Back to {loggedIn ? "Home" : "Rich Off Tech"}</a>
        <div style={{ borderBottom: "3px solid #111", paddingBottom: 10, marginBottom: 22, fontWeight: 800, letterSpacing: ".04em" }}>RICH OFF TECH</div>
        <h1 style={{ fontSize: 26, margin: "0 0 6px" }}>Book a 1-on-1</h1>
        <p style={{ color: "#5f6368", marginTop: 0 }}>30 minutes on Google Meet. You&apos;ll get the join link by email, and the call records automatically.</p>

        {loggedIn && name && (
          <div style={{ background: "#fff7ed", border: "1px solid #fad9bd", borderRadius: 10, padding: "10px 14px", margin: "16px 0", fontSize: 14, color: "#8a4b14" }}>
            Booking as <b>{name}</b>{email ? <> · {email}</> : null}
          </div>
        )}

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Coach</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COACHES.map((c) => (
            <button key={c.key} onClick={() => setCoach(c.key)} type="button"
              style={{ padding: "10px 18px", borderRadius: 10, cursor: "pointer", fontWeight: 600,
                border: coach === c.key ? "2px solid #f97316" : "1px solid #dadce0",
                background: coach === c.key ? "#fff7ed" : "#fff", color: "#202124" }}>{c.name}</button>
          ))}
        </div>

        {coachAvail && (availDays.length > 0 || coachAvail.note) && (
          <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 13, color: "#3c4043" }}>
            <b>{coachAvail.name}&apos;s hours</b>
            {availDays.length > 0 && (
              <div style={{ marginTop: 4 }}>{availDays.map(d => `${d} ${coachAvail.days[d]}`).join(" · ")}</div>
            )}
            {coachAvail.note && <div style={{ color: "#5f6368", marginTop: 4 }}>{coachAvail.note}</div>}
          </div>
        )}

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
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="First & last" readOnly={loggedIn && !!name}
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", fontSize: 15, background: loggedIn && name ? "#f1f3f4" : "#fff" }} />

        <label style={{ display: "block", fontWeight: 600, fontSize: 13, margin: "20px 0 8px" }}>Email (gets your Meet link)</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" type="email" readOnly={loggedIn && !!email}
          style={{ width: "100%", padding: 12, borderRadius: 9, border: "1px solid #dadce0", fontSize: 15, background: loggedIn && email ? "#f1f3f4" : "#fff" }} />

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
