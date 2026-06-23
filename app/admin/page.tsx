"use client";
import { useEffect, useState, useCallback, Fragment } from "react";
import Image from "next/image";

type Member = {
  email: string; name: string; discordTag: string; discordId: string;
  tier: string; status: string; paymentStatus: string; invoiced: boolean;
  tracks: string[]; roles: string[]; certs?: string[]; phone?: string; quizCode: string; accessEndDate: string; daysLeft?: number | null; plan?: string; referredBy?: string; rolesAssigned: boolean;
  assignedTo: string; notes: string; purchaseDate?: string;
  progress?: { domains: { domain: string; highScore: number; completed: boolean }[]; done: number; avg: number | null; weak: string[] };
};
type Note = { by: string; text: string; at: string };
type Followup = {
  id: string; title: string; memberEmail?: string; source?: string;
  status: "open" | "done"; assignedTo?: string; notes?: Note[]; createdAt?: string; createdBy?: string;
};
type Schedule = { id?: string; discordId: string; name: string; days: Record<string, string>; note?: string; updatedAt?: string };
type Call = { id: string; title: string; date: string | null; participants: string[]; grade: string; transcriptUrl: string; gradedAt: number | null };
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Light, professional palette (Google Admin / Zoho feel): white surfaces, near-black
// text, gray borders, status pills in muted tones, one orange accent for the brand.
// Referral payout per paid referral (configurable). Drives the "owed" total.
const REFERRAL_PAYOUT = 20;
const PILL: Record<string, string> = {
  late: "bg-red-50 text-red-700 border-red-200",
  active: "bg-green-50 text-green-700 border-green-200",
  comp: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  canceled: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminCRM() {
  const [authed, setAuthed] = useState<"loading" | "yes" | "no">("loading");
  const [tab, setTab] = useState<"followups" | "members" | "calls" | "schedule" | "referrals" | "team" | "bo">("followups");
  const [chat, setChat] = useState<{ id: string; authorId: string; authorName: string; text: string; createdAt: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [boMsgs, setBoMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [boInput, setBoInput] = useState("");
  const [boBusy, setBoBusy] = useState(false);
  const [calls, setCalls] = useState<Call[]>([]);
  const [fTier, setFTier] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [resetMsg, setResetMsg] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<{ total: number; comped: number; expiringSoon: number } | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [me, setMe] = useState<{ discordId: string; name: string; isOwner?: boolean } | null>(null);
  const [schedDraft, setSchedDraft] = useState<{ days: Record<string, string>; note: string }>({ days: {}, note: "" });
  const [q, setQ] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refDraft, setRefDraft] = useState<Record<string, string>>({});
  const [dmDraft, setDmDraft] = useState<Record<string, string>>({});
  const [trackDraft, setTrackDraft] = useState<Record<string, string>>({});
  const [actionMsg, setActionMsg] = useState<Record<string, string>>({});
  const [resumeView, setResumeView] = useState<Record<string, { name?: string; data: unknown; updatedAt?: string } | null>>({});
  const [invoiceFor, setInvoiceFor] = useState<string | null>(null);
  const [invoiceService, setInvoiceService] = useState("sec-essential");

  const loadMembers = useCallback(async () => {
    const r = await fetch("/api/admin/members");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) { setMembers(d.members); setStats(d.stats); }
  }, []);
  const loadFollowups = useCallback(async () => {
    const r = await fetch("/api/admin/followups");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) setFollowups(d.items);
  }, []);
  const loadSchedule = useCallback(async () => {
    const r = await fetch("/api/admin/schedule");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) {
      setSchedules(d.schedules);
      setMe(d.me);
      const mine = (d.schedules as Schedule[]).find((s) => s.discordId === d.me.discordId);
      if (mine) setSchedDraft({ days: { ...mine.days }, note: mine.note || "" });
    }
  }, []);

  const loadCalls = useCallback(async () => {
    const r = await fetch("/api/admin/calls");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) setCalls(d.calls);
  }, []);
  const loadChat = useCallback(async () => {
    const r = await fetch("/api/admin/chat");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) { setChat(d.messages); if (d.me) setMe(d.me); }
  }, []);
  async function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatInput("");
    await fetch("/api/admin/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    loadChat();
  }
  async function resetCode(m: Member) {
    setResetMsg(s => ({ ...s, [m.email]: "…" }));
    const r = await fetch("/api/admin/reset-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: m.email }) });
    const d = await r.json();
    setResetMsg(s => ({ ...s, [m.email]: d.ok ? `New code: ${d.quizCode}` : `Error: ${d.error}` }));
    if (d.ok) loadMembers();
  }

  // CRM → bot actions (the bot executes these from the botCommands queue).
  async function doAction(email: string, type: string, payload: Record<string, unknown>, okMsg: string) {
    setActionMsg(s => ({ ...s, [email]: "…" }));
    const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, payload }) });
    const d = await r.json();
    setActionMsg(s => ({ ...s, [email]: r.ok && d.ok ? okMsg : `Error: ${d.error || r.status}` }));
  }
  function sendUpdate(m: Member) {
    const msg = (dmDraft[m.email] || "").trim();
    if (!msg) return;
    doAction(m.email, "dm", { email: m.email, discordId: m.discordId, message: msg }, "✓ Update queued — bot will DM them.");
    setDmDraft(s => ({ ...s, [m.email]: "" }));
  }
  function addTrack(m: Member) {
    const tier = trackDraft[m.email];
    if (!tier) return;
    doAction(m.email, "addTrack", { email: m.email, tier, name: m.name }, `✓ Granting ${tier} — bot will apply it + notify them.`);
  }
  function scheduleCall(m: Member) {
    doAction(m.email, "dm", { email: m.email, discordId: m.discordId, message: "📅 Let's get you on a 1-on-1. DM me the word **book** here and I'll show you open times (pick your coach + a slot). See you soon!" }, "✓ Sent them the booking prompt in Discord.");
  }
  function sendInvoice(m: Member) {
    doAction(m.email, "invoice", { clientName: m.name, clientEmail: m.email, service: invoiceService }, "✓ Invoice queued — Square will email it.");
    setInvoiceFor(null);
  }
  async function viewResume(m: Member) {
    if (resumeView[m.email]) { setResumeView(s => ({ ...s, [m.email]: null })); return; }
    setResumeView(s => ({ ...s, [m.email]: { data: "loading" } }));
    const r = await fetch(`/api/admin/resume?code=${encodeURIComponent(m.quizCode)}`);
    const d = await r.json();
    setResumeView(s => ({ ...s, [m.email]: d.ok ? { name: d.name, data: d.resume, updatedAt: d.updatedAt } : { data: `Error: ${d.error}` } }));
  }

  // Bo Tech assistant — sends the roster snapshot + whoever's expanded for grounded answers.
  async function askBo() {
    const text = boInput.trim();
    if (!text || boBusy) return;
    const next = [...boMsgs, { role: "user" as const, content: text }];
    setBoMsgs(next); setBoInput(""); setBoBusy(true);
    try {
      const roster = members.slice(0, 200).map(m => `${m.name || m.email} | ${m.tier || "—"} | ${m.paymentStatus} | ${m.daysLeft ?? "—"}d`).join("\n");
      const focus = expanded ? members.find(m => m.email === expanded) : null;
      const r = await fetch("/api/admin/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, roster, focus }) });
      const reply = await r.text();
      setBoMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setBoMsgs(m => [...m, { role: "assistant", content: "Couldn't reach Bo just now — try again." }]);
    } finally { setBoBusy(false); }
  }

  useEffect(() => { loadMembers(); loadFollowups(); loadSchedule(); loadCalls(); loadChat(); }, [loadMembers, loadFollowups, loadSchedule, loadCalls, loadChat]);
  // Live-ish team chat: refresh every 8s while the Team tab is open.
  useEffect(() => {
    if (tab !== "team") return;
    loadChat();
    const t = setInterval(loadChat, 8000);
    return () => clearInterval(t);
  }, [tab, loadChat]);

  async function act(body: Record<string, unknown>) {
    await fetch("/api/admin/followups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    loadFollowups();
  }
  async function saveSchedule() {
    await fetch("/api/admin/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(schedDraft) });
    loadSchedule();
  }
  async function setReferrer(m: Member) {
    await fetch("/api/admin/set-referrer", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizCode: m.quizCode, email: m.email, referredBy: refDraft[m.email] ?? m.referredBy ?? "" }),
    });
    loadMembers();
  }

  if (authed === "loading") return <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-gray-500">Loading CRM…</main>;
  if (authed === "no") return (
    <main className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4 px-6 text-center text-[#202124]">
      <Image src="/rot-logo.png" alt="Rich Off Tech" width={56} height={56} className="rounded-xl" />
      <h1 className="text-2xl font-bold">Rich Off Tech — CRM</h1>
      <p className="text-gray-500 max-w-sm">Coaches only. Sign in with the Discord account that holds the ROT Coach role.</p>
      <a href="/api/auth/discord?redirect=/admin" className="px-6 py-3 font-semibold rounded-lg text-white" style={{ backgroundColor: "#5865F2" }}>Sign in with Discord</a>
    </main>
  );

  const openFollowups = followups.filter(f => f.status === "open");
  const doneFollowups = followups.filter(f => f.status === "done");
  const filteredMembers = members.filter(m =>
    (!q || [m.name, m.email, m.discordTag, m.tier, m.tracks.join(",")].join(" ").toLowerCase().includes(q.toLowerCase())) &&
    (!fTier || m.tier === fTier) &&
    (!fStatus || m.paymentStatus === fStatus));
  const lateCount = members.filter(m => m.paymentStatus === "late" || m.paymentStatus === "expired").length;

  // Referral rollup: group by who referred them, count paid, compute payout owed.
  const referrerMap: Record<string, Member[]> = {};
  members.forEach(m => { if (m.referredBy) (referrerMap[m.referredBy] ||= []).push(m); });
  const referrers = Object.entries(referrerMap).map(([ref, list]) => ({
    ref, count: list.length,
    paid: list.filter(x => x.paymentStatus === "active" || x.paymentStatus === "comp").length,
  })).sort((a, b) => b.count - a.count);
  const totalOwed = referrers.reduce((s, r) => s + r.paid * REFERRAL_PAYOUT, 0);

  const TABS: { id: typeof tab; label: string }[] = [
    { id: "followups", label: "Follow-ups" },
    { id: "members", label: "Members" },
    { id: "calls", label: "Calls" },
    { id: "schedule", label: "Schedule" },
    { id: "team", label: "Team Chat" },
    { id: "bo", label: "Ask Bo" },
    { id: "referrals", label: "Referrals" },
  ];
  const tierOptions = Array.from(new Set(members.map(m => m.tier).filter(Boolean))).sort();
  const statusOptions = Array.from(new Set(members.map(m => m.paymentStatus).filter(Boolean))).sort();

  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#202124]">
      {/* Header */}
      <header className="bg-white border-b border-[#dadce0] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/rot-logo.png" alt="Rich Off Tech" width={36} height={36} className="rounded-lg" />
            <div className="leading-tight">
              <div className="font-semibold text-[15px]">Rich Off Tech</div>
              <div className="text-[11px] text-gray-500 tracking-wide uppercase">Admin · CRM</div>
            </div>
          </div>
          {me && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="flex items-center gap-1.5 font-medium text-[#202124]"><span className="w-2 h-2 rounded-full bg-green-500" />Signed in</span>
                <span className="text-[11px] text-gray-500">{me.name}</span>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#202124] text-white grid place-items-center text-xs font-semibold">{me.name.slice(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Members", value: stats?.total ?? members.length, tone: "text-[#202124]" },
            { label: "Expiring ≤30d", value: stats?.expiringSoon ?? 0, tone: "text-amber-600" },
            { label: "Late / expired", value: lateCount, tone: "text-red-600" },
            { label: "Comped", value: stats?.comped ?? 0, tone: "text-blue-600" },
            { label: "Open follow-ups", value: openFollowups.length, tone: "text-[#202124]" },
          ].map(c => (
            <div key={c.label} className="bg-white border border-[#dadce0] rounded-xl p-4">
              <div className={`text-3xl font-semibold ${c.tone}`}>{c.value}</div>
              <div className="text-xs text-gray-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[#dadce0] mb-6">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`pb-3 text-sm font-medium -mb-px border-b-2 transition ${tab === t.id ? "border-orange-500 text-[#202124]" : "border-transparent text-gray-500 hover:text-[#202124]"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Follow-ups ── */}
        {tab === "followups" && (
          <div className="space-y-4">
            <button onClick={() => act({ action: "create", title: "New follow-up", source: "manual" })}
              className="text-sm px-3 py-2 rounded-lg bg-[#202124] text-white font-medium hover:bg-black">+ Add follow-up</button>

            {openFollowups.length === 0 && <p className="text-gray-500 text-sm">No open follow-ups. Completed calls drop in here automatically.</p>}
            {openFollowups.map(f => (
              <div key={f.id} className="bg-white border border-[#dadce0] rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-semibold">{f.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {f.memberEmail ? f.memberEmail + " · " : ""}{f.source || "manual"}{f.createdAt ? " · " + new Date(f.createdAt).toLocaleDateString() : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${f.assignedTo ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                      {f.assignedTo ? `👤 ${f.assignedTo}` : "unassigned"}
                    </span>
                    {!f.assignedTo && <button onClick={() => act({ action: "assign", id: f.id })} className="text-xs px-2.5 py-1 rounded-lg border border-[#dadce0] hover:bg-gray-50">Assign to me</button>}
                    <button onClick={() => act({ action: "status", id: f.id, status: "done" })} className="text-xs px-2.5 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700">✓ Done</button>
                  </div>
                </div>
                {(f.notes || []).length > 0 && (
                  <div className="mt-3 space-y-1">
                    {(f.notes || []).map((n, i) => (
                      <div key={i} className="text-xs text-gray-700 bg-[#f8f9fa] border border-[#e8eaed] rounded px-2 py-1"><span className="text-gray-400">{n.by}:</span> {n.text}</div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <input value={noteDraft[f.id] || ""} onChange={e => setNoteDraft(s => ({ ...s, [f.id]: e.target.value }))}
                    placeholder="Add a note…" className="flex-1 bg-white border border-[#dadce0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500" />
                  <button onClick={() => { if ((noteDraft[f.id] || "").trim()) { act({ action: "note", id: f.id, note: noteDraft[f.id] }); setNoteDraft(s => ({ ...s, [f.id]: "" })); } }}
                    className="text-sm px-3 rounded-lg bg-[#202124] text-white font-medium">Note</button>
                </div>
              </div>
            ))}

            {doneFollowups.length > 0 && (
              <details className="text-sm">
                <summary className="text-gray-500 cursor-pointer">✓ {doneFollowups.length} completed</summary>
                <div className="mt-2 space-y-1">
                  {doneFollowups.map(f => (
                    <div key={f.id} className="text-xs text-gray-500 flex items-center justify-between bg-white border border-[#e8eaed] rounded px-3 py-1.5">
                      <span className="line-through">{f.title}</span>
                      <button onClick={() => act({ action: "status", id: f.id, status: "open" })} className="text-orange-600 hover:underline">reopen</button>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* ── Members ── */}
        {tab === "members" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, tier, track…"
                className="flex-1 min-w-[200px] bg-white border border-[#dadce0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500" />
              <select value={fTier} onChange={e => setFTier(e.target.value)} className="bg-white border border-[#dadce0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500">
                <option value="">All tiers</option>
                {tierOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={fStatus} onChange={e => setFStatus(e.target.value)} className="bg-white border border-[#dadce0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500">
                <option value="">All status</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(q || fTier || fStatus) && <button onClick={() => { setQ(""); setFTier(""); setFStatus(""); }} className="text-sm px-3 rounded-lg border border-[#dadce0] text-gray-600 hover:bg-gray-50">Clear</button>}
              <span className="text-xs text-gray-400 self-center ml-auto">{filteredMembers.length} shown</span>
            </div>
            <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]">
                  <tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Member</th><th className="px-3 font-medium">Tier</th><th className="px-3 font-medium">Tracks</th>
                    <th className="px-3 font-medium">Payment</th><th className="px-3 font-medium">Access ends</th><th className="px-3 font-medium">Role</th><th className="px-3 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(m => (
                    <Fragment key={m.email}>
                      <tr className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] cursor-pointer" onClick={() => setExpanded(expanded === m.email ? null : m.email)}>
                        <td className="py-2.5 px-4">
                          <div className="font-medium">{m.name || m.email}</div>
                          <div className="text-xs text-gray-500">{m.email}{m.discordTag ? ` · ${m.discordTag}` : ""}</div>
                        </td>
                        <td className="px-3 text-gray-700">{m.tier || "—"}</td>
                        <td className="px-3">{m.tracks.length ? m.tracks.map(t => <span key={t} className="inline-block text-[10px] mr-1 px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-600">{t}</span>) : <span className="text-gray-400">—</span>}</td>
                        <td className="px-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${PILL[m.paymentStatus] || "bg-gray-100 text-gray-500 border-gray-200"}`}>{m.paymentStatus}</span>
                          {m.invoiced && <span className="ml-1 text-[10px] text-gray-400">🧾</span>}
                        </td>
                        <td className="px-3 text-xs whitespace-nowrap">
                          {m.accessEndDate ? <span className="text-gray-600">{m.accessEndDate.slice(0, 10)}</span> : <span className="text-gray-400">—</span>}
                          {typeof m.daysLeft === "number" && (
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full border text-[10px] ${m.daysLeft < 0 ? "bg-red-50 text-red-700 border-red-200" : m.daysLeft <= 30 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                              {m.daysLeft < 0 ? `${Math.abs(m.daysLeft)}d over` : `${m.daysLeft}d`}
                            </span>
                          )}
                          {m.plan === "monthly" && <span className="ml-1 text-[10px] text-gray-400">mo</span>}
                        </td>
                        <td className="px-3">{m.rolesAssigned ? "✅" : "⚠️"}</td>
                        <td className="px-3 text-xs">
                          {m.progress && (m.progress.done > 0 || m.progress.avg != null)
                            ? <span className="text-gray-700">{m.progress.done} done{m.progress.avg != null ? ` · ${m.progress.avg}%` : ""}</span>
                            : <span className="text-gray-400">—</span>}
                          {m.progress?.weak?.length ? <span className="ml-1 text-[10px] text-red-600">⚠{m.progress.weak.length}</span> : null}
                        </td>
                      </tr>
                      {expanded === m.email && (
                        <tr className="bg-[#f8f9fa]"><td colSpan={7} className="px-4 py-4">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5 text-xs mb-4">
                            <div><span className="text-gray-400">Name</span><div className="font-medium">{m.name || "—"}</div></div>
                            <div><span className="text-gray-400">Email</span><div className="font-medium">{m.email || "—"}</div></div>
                            <div><span className="text-gray-400">Discord</span><div className="font-medium">{m.discordTag || "—"} {m.discordId ? <span className="text-gray-400 font-mono">({m.discordId})</span> : ""}</div></div>
                            <div>
                              <span className="text-gray-400">Quiz code (login)</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium font-mono">{m.quizCode || "—"}</span>
                                <button onClick={() => resetCode(m)} className="text-[10px] px-2 py-0.5 rounded border border-[#dadce0] text-gray-600 hover:bg-gray-50">Reset</button>
                              </div>
                              {resetMsg[m.email] && <div className="text-[10px] text-green-700 mt-0.5 font-mono">{resetMsg[m.email]}</div>}
                            </div>
                            <div><span className="text-gray-400">Tracks</span><div className="font-medium">{m.tracks.join(", ") || "—"}</div></div>
                            <div><span className="text-gray-400">Roles</span><div className="font-medium">{m.roles?.length ? m.roles.join(", ") : "—"}</div></div>
                            <div><span className="text-gray-400">Certs</span><div className="font-medium">{m.certs?.length ? m.certs.join(", ") : "—"}</div></div>
                            <div><span className="text-gray-400">Phone</span><div className="font-medium">{m.phone || "—"}</div></div>
                            <div><span className="text-gray-400">Joined</span><div className="font-medium">{m.purchaseDate ? m.purchaseDate.slice(0, 10) : "—"}</div></div>
                            <div>
                              <span className="text-gray-400">Referred by</span>
                              <div className="flex gap-1 mt-0.5">
                                <input value={refDraft[m.email] ?? m.referredBy ?? ""} onChange={e => setRefDraft(s => ({ ...s, [m.email]: e.target.value }))}
                                  placeholder="name or code" className="border border-[#dadce0] rounded px-2 py-0.5 text-xs w-32 focus:outline-none focus:border-orange-500" />
                                <button onClick={() => setReferrer(m)} className="text-[10px] px-2 rounded bg-[#202124] text-white">Save</button>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mb-1.5">Quiz scores by domain</div>
                          {m.progress?.domains?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {m.progress.domains.map(d => (
                                <span key={d.domain} className={`text-xs px-2 py-1 rounded border ${d.highScore >= 75 ? "bg-green-50 border-green-200 text-green-700" : d.highScore >= 50 ? "bg-amber-50 border-amber-200 text-amber-700" : d.completed ? "bg-red-50 border-red-200 text-red-700" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
                                  {d.domain}: {d.completed || d.highScore > 0 ? `${d.highScore}%` : "—"}
                                </span>
                              ))}
                            </div>
                          ) : <span className="text-gray-500 text-xs">No quiz progress yet for this member.</span>}

                          {/* ── Actions: everything the bot can do, right here ── */}
                          <div className="mt-4 pt-3 border-t border-[#e8eaed]">
                            <div className="text-xs text-gray-400 mb-2">Actions</div>
                            <div className="flex flex-wrap items-center gap-2">
                              <button onClick={() => scheduleCall(m)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">📅 Schedule call</button>
                              <button onClick={() => viewResume(m)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">📄 {resumeView[m.email] ? "Hide" : "View"} resume</button>
                              <span className="inline-flex items-center gap-1">
                                <select value={trackDraft[m.email] || ""} onChange={e => setTrackDraft(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                  <option value="">Add track…</option>
                                  {["secplus", "csa", "aws", "secret", "ts", "tsci"].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button onClick={() => addTrack(m)} className="text-xs px-2.5 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Grant</button>
                              </span>
                              {me?.isOwner && <button onClick={() => setInvoiceFor(invoiceFor === m.email ? null : m.email)} className="text-xs px-2.5 py-1.5 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100">🧾 Send invoice</button>}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <input value={dmDraft[m.email] || ""} onChange={e => setDmDraft(s => ({ ...s, [m.email]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter") sendUpdate(m); }}
                                placeholder="Send update (DMs them in Discord)…" className="flex-1 min-w-[220px] text-xs border border-[#dadce0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-orange-500" />
                              <button onClick={() => sendUpdate(m)} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Send</button>
                            </div>
                            {invoiceFor === m.email && me?.isOwner && (
                              <div className="flex flex-wrap items-center gap-2 mt-2 bg-orange-50 border border-orange-200 rounded-lg p-2">
                                <span className="text-xs text-orange-800">Invoice {m.name || m.email}:</span>
                                <select value={invoiceService} onChange={e => setInvoiceService(e.target.value)} className="text-xs border border-orange-200 rounded-lg px-2 py-1.5 bg-white">
                                  <option value="sec-essential">Security+ — Essential</option>
                                  <option value="sec-accelerated">Security+ — Accelerated</option>
                                  <option value="csa-essential">ServiceNow CSA — Essential</option>
                                  <option value="csa-accelerated">ServiceNow CSA — Accelerated</option>
                                  <option value="aws">AWS Cloud Practitioner</option>
                                </select>
                                <button onClick={() => sendInvoice(m)} className="text-xs px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Send invoice</button>
                              </div>
                            )}
                            {actionMsg[m.email] && <div className="text-[11px] mt-1.5 text-gray-700">{actionMsg[m.email]}</div>}
                            {resumeView[m.email] && (
                              <pre className="mt-2 text-[11px] bg-white border border-[#e8eaed] rounded-lg p-3 max-h-64 overflow-auto whitespace-pre-wrap break-words text-gray-700">
                                {resumeView[m.email]?.data === "loading" ? "Loading…"
                                  : resumeView[m.email]?.data == null ? "No resume saved for this member yet."
                                  : typeof resumeView[m.email]?.data === "string" ? String(resumeView[m.email]?.data)
                                  : JSON.stringify(resumeView[m.email]?.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </td></tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && <p className="text-gray-500 text-sm py-6 text-center">No members match.</p>}
            </div>
            <p className="text-gray-400 text-xs mt-3">Prices are hidden by design — you see status (late / active / comp), invoices, and discounts, never dollar amounts.</p>
          </div>
        )}

        {/* ── Calls (Fireflies) ── */}
        {tab === "calls" && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm">Coaching calls auto-graded by Bo from your Fireflies recordings. Newest first.</p>
            {calls.length === 0 && <p className="text-gray-500 text-sm">No graded calls yet — they appear here automatically after a Fireflies call is transcribed.</p>}
            {calls.map(c => (
              <details key={c.id} className="bg-white border border-[#dadce0] rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 hover:bg-[#f8f9fa]">
                  <div>
                    <div className="font-semibold text-sm">{c.title}</div>
                    <div className="text-xs text-gray-500">
                      {c.date ? new Date(c.date).toLocaleString() : (c.gradedAt ? new Date(c.gradedAt).toLocaleDateString() : "")}
                      {c.participants?.length ? ` · ${c.participants.join(", ").slice(0, 60)}` : ""}
                    </div>
                  </div>
                  <span className="text-xs text-orange-600">view ▾</span>
                </summary>
                <div className="px-4 py-3 border-t border-[#e8eaed] text-sm text-gray-700 whitespace-pre-wrap">
                  {c.grade || "No scorecard saved for this call."}
                  {c.transcriptUrl && <div className="mt-2"><a href={c.transcriptUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline text-xs">Open transcript ↗</a></div>}
                </div>
              </details>
            ))}
          </div>
        )}

        {/* ── Schedule ── */}
        {tab === "schedule" && (
          <div className="space-y-5">
            <p className="text-gray-500 text-sm">Set your weekly availability so the team knows when you&apos;re free. You can only edit your own row.</p>
            <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]">
                  <tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Coach</th>
                    {WEEKDAYS.map(d => <th key={d} className="px-3 font-medium">{d}</th>)}
                    <th className="px-3 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 && <tr><td colSpan={9} className="py-4 px-4 text-gray-500">No availability set yet.</td></tr>}
                  {schedules.map(s => (
                    <tr key={s.discordId} className="border-b border-[#f1f3f4]">
                      <td className="py-2.5 px-4 font-medium">{s.name}{me && s.discordId === me.discordId && <span className="text-orange-600 text-xs ml-1">(you)</span>}</td>
                      {WEEKDAYS.map(d => <td key={d} className="px-3 text-gray-600 text-xs">{s.days?.[d] || "—"}</td>)}
                      <td className="px-3 text-gray-500 text-xs">{s.note || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl p-4">
              <div className="font-semibold mb-3">Your availability {me ? `— ${me.name}` : ""}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {WEEKDAYS.map(d => (
                  <div key={d}>
                    <label className="block text-xs text-gray-500 mb-1">{d}</label>
                    <input value={schedDraft.days[d] || ""} onChange={e => setSchedDraft(s => ({ ...s, days: { ...s.days, [d]: e.target.value } }))}
                      placeholder="e.g. 6–9pm ET" className="w-full bg-white border border-[#dadce0] rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-orange-500" />
                  </div>
                ))}
              </div>
              <input value={schedDraft.note} onChange={e => setSchedDraft(s => ({ ...s, note: e.target.value }))}
                placeholder="Note (e.g. ET timezone, prefer evenings)" className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-orange-500" />
              <button onClick={saveSchedule} className="px-5 py-2 bg-[#202124] text-white font-medium rounded-lg text-sm hover:bg-black">Save my availability</button>
            </div>
          </div>
        )}

        {/* ── Team Chat ── */}
        {tab === "team" && (
          <div className="bg-white border border-[#dadce0] rounded-xl flex flex-col" style={{ height: "70vh" }}>
            <div className="px-4 py-3 border-b border-[#e8eaed] flex items-center justify-between">
              <div className="font-semibold">Team Chat</div>
              <div className="text-xs text-gray-500">Just the coaches — Randy, Tyler &amp; Daquan</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chat.length === 0 && <p className="text-gray-500 text-sm">No messages yet. Say something — the team will see it here.</p>}
              {chat.map(m => {
                const mine = me && m.authorId === me.discordId;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                      {!mine && <span className="text-[11px] text-gray-500 mb-0.5 px-1">{m.authorName}</span>}
                      <div className={`px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${mine ? "bg-[#202124] text-white rounded-br-sm" : "bg-[#f1f3f4] text-[#202124] rounded-bl-sm"}`}>{m.text}</div>
                      <span className="text-[10px] text-gray-400 mt-0.5 px-1">{new Date(m.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#e8eaed] p-3 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                placeholder="Message the team…" className="flex-1 bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
              <button onClick={sendChat} className="px-5 py-2 bg-[#202124] text-white font-medium rounded-lg text-sm hover:bg-black">Send</button>
            </div>
          </div>
        )}

        {/* ── Ask Bo (CRM assistant) ── */}
        {tab === "bo" && (
          <div className="bg-white border border-[#dadce0] rounded-xl flex flex-col" style={{ height: "70vh" }}>
            <div className="px-4 py-3 border-b border-[#e8eaed] flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500" />Bo Tech — CRM Assistant</div>
              <div className="text-xs text-gray-500">{expanded ? `Looking at: ${expanded}` : "Open a member for member-specific help"}</div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {boMsgs.length === 0 && (
                <div className="text-gray-500 text-sm space-y-2">
                  <p>Ask me anything about your members or the day&apos;s work. For example:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    <li>&quot;Who&apos;s expiring in the next 30 days and hasn&apos;t been contacted?&quot;</li>
                    <li>&quot;Draft a check-in DM for the member I have open.&quot;</li>
                    <li>&quot;Who&apos;s behind on their quiz tracks?&quot;</li>
                  </ul>
                </div>
              )}
              {boMsgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${m.role === "user" ? "bg-[#202124] text-white rounded-br-sm" : "bg-[#f1f3f4] text-[#202124] rounded-bl-sm"}`}>{m.content}</div>
                </div>
              ))}
              {boBusy && <div className="text-xs text-gray-400">Bo is thinking…</div>}
            </div>
            <div className="border-t border-[#e8eaed] p-3 flex gap-2">
              <input value={boInput} onChange={e => setBoInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askBo(); } }}
                placeholder="Ask Bo about your members…" className="flex-1 bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500" />
              <button onClick={askBo} disabled={boBusy} className="px-5 py-2 bg-orange-600 text-white font-medium rounded-lg text-sm hover:bg-orange-700 disabled:opacity-50">Ask</button>
            </div>
          </div>
        )}

        {/* ── Referrals ── */}
        {tab === "referrals" && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-gray-500 text-sm">Who referred whom and what&apos;s owed. Payout = ${REFERRAL_PAYOUT} per paid referral.</p>
              <span className="text-sm font-semibold">Total owed: ${totalOwed}</span>
            </div>
            {referrers.length === 0 ? (
              <div className="bg-white border border-[#dadce0] rounded-xl p-6 text-sm text-gray-500">
                No referrals recorded yet. To track them, signups need to capture a <code className="bg-gray-100 px-1 rounded">referredBy</code> code — I can wire that into the join flow so this fills automatically.
              </div>
            ) : (
              <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]"><tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Referrer</th><th className="px-3 font-medium">Referred</th><th className="px-3 font-medium">Paid</th><th className="px-3 font-medium">Owed</th>
                  </tr></thead>
                  <tbody>
                    {referrers.map(r => (
                      <tr key={r.ref} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa]">
                        <td className="py-2.5 px-4 font-medium">{r.ref}</td>
                        <td className="px-3">{r.count}</td>
                        <td className="px-3">{r.paid}</td>
                        <td className="px-3 font-semibold">${r.paid * REFERRAL_PAYOUT}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
