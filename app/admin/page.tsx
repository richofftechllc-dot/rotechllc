"use client";
import { useEffect, useState, useCallback, Fragment } from "react";
import Image from "next/image";

type Member = {
  id: string; email: string; name: string; discordTag: string; discordId: string;
  tier: string; status: string; paymentStatus: string; invoiced: boolean;
  tracks: string[]; roles: string[]; certs?: string[]; phone?: string; quizCode: string; accessEndDate: string; daysLeft?: number | null; plan?: string; referredBy?: string; rolesAssigned: boolean;
  sentLog?: { type?: string; title?: string; detail?: string; at?: string }[];
  referralEligible?: boolean;
  referralCode?: string;
  foundingTier?: number;
  assignedTo: string; notes: string; purchaseDate?: string;
  progress?: { domains: { domain: string; highScore: number; completed: boolean }[]; done: number; avg: number | null; weak: string[] };
};
type Note = { by: string; text: string; at: string };
type Followup = {
  id: string; title: string; memberEmail?: string; source?: string;
  status: "open" | "done"; assignedTo?: string; notes?: Note[]; createdAt?: string; createdBy?: string; archived?: boolean;
};
type Schedule = { id?: string; discordId: string; name: string; days: Record<string, string>; note?: string; updatedAt?: string };
type Call = { id: string; title: string; date: string | null; type?: string; summary?: string; actionItems?: string; keywords?: string; participants: string[]; grade: string; transcriptUrl: string; gradedAt: number | null };
// Coach-invoice programs (mirror coachinvoice.SERVICES in the bot). Click one to invoice.
const COACH_SERVICES = [
  { key: "sec-essential", label: "Security+ Essential", amount: 150000 },
  { key: "sec-accelerated", label: "Security+ Accelerated", amount: 240000 },
  { key: "csa-essential", label: "CSA Essential", amount: 160000 },
  { key: "csa-accelerated", label: "CSA Accelerated", amount: 280000 },
  { key: "aws", label: "AWS Cloud Practitioner", amount: 100000 },
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTS = ["", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm"];
// Parse "9am–5pm ET" → {start, end}; compose back on change. Keeps the stored string format.
function parseDay(s: string): { start: string; end: string } {
  const [a, b] = (s || "").replace(/\s*ET\s*$/i, "").split(/[–-]/).map(x => x.trim());
  return { start: a || "", end: b || "" };
}

// Light, professional palette (Google Admin / Zoho feel): white surfaces, near-black
// text, gray borders, status pills in muted tones, one orange accent for the brand.
// Referral payout per paid referral (configurable). Drives the "owed" total.
const PILL: Record<string, string> = {
  late: "bg-red-50 text-red-700 border-red-200",
  active: "bg-green-50 text-green-700 border-green-200",
  comp: "bg-blue-50 text-blue-700 border-blue-200",
  expired: "bg-amber-50 text-amber-700 border-amber-200",
  canceled: "bg-gray-100 text-gray-500 border-gray-200",
};
const CALL_PILL: Record<string, string> = {
  coaching: "bg-green-50 text-green-700 border-green-200",
  interview: "bg-purple-50 text-purple-700 border-purple-200",
  discovery: "bg-blue-50 text-blue-700 border-blue-200",
  voice: "bg-orange-50 text-orange-700 border-orange-200",
  team: "bg-gray-100 text-gray-600 border-gray-200",
  other: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function AdminCRM() {
  const [authed, setAuthed] = useState<"loading" | "yes" | "no">("loading");
  const [tab, setTab] = useState<"home" | "followups" | "members" | "calls" | "schedule" | "referrals" | "team" | "bo" | "sops" | "resources" | "vouchers">("home");
  const [chat, setChat] = useState<{ id: string; authorId: string; authorName: string; text: string; createdAt: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [boMsgs, setBoMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [boInput, setBoInput] = useState("");
  const [boBusy, setBoBusy] = useState(false);
  const [bookings, setBookings] = useState<{ id: string; coach: string; slot: string; label: string; topic: string; userName: string }[]>([]);
  const [sops, setSops] = useState<{ id: string; title: string; body: string; updatedBy?: string }[]>([]);
  const [sopDraft, setSopDraft] = useState<Record<string, string>>({});
  const [newSop, setNewSop] = useState({ title: "", body: "" });
  const [referralPayout, setReferralPayoutState] = useState(20);
  const [payoutDraft, setPayoutDraft] = useState("");
  const [payouts, setPayouts] = useState<{ referrer: string; amount: number; method: string; at: string }[]>([]);
  const [vouchers, setVouchers] = useState<{ id: string; code: string; cert: string; expiry?: string; assignedTo?: string; forClient?: string; status: string; source?: string; sentAt?: string; confirmedByCoach?: boolean; confirmedAt?: string; confirmedBy?: string }[]>([]);
  const [vForm, setVForm] = useState({ code: "", cert: "CompTIA Security+ (SY0-701)", expiry: "", assignedTo: "", source: "" });
  const [vClientDraft, setVClientDraft] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState("");
  const [referralBlastMsg, setReferralBlastMsg] = useState("");
  const [igText, setIgText] = useState("");
  const [igStatus, setIgStatus] = useState("");
  const [igDrafts, setIgDrafts] = useState<{ id: string; imageUrl: string; caption: string; status: string }[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [callType, setCallType] = useState("all");
  const [callAssignee, setCallAssignee] = useState<Record<string, string>>({});
  const [callMsg, setCallMsg] = useState<Record<string, string>>({});
  const [newCall, setNewCall] = useState(false);
  const [newCallKind, setNewCallKind] = useState("Community");
  const [newCallEmail, setNewCallEmail] = useState("");
  const [newCallText, setNewCallText] = useState("");
  const [newCallStatus, setNewCallStatus] = useState("");
  const [fTier, setFTier] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [resetMsg, setResetMsg] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<{ total: number; comped: number; paid?: number; free?: number; expiringSoon: number } | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [me, setMe] = useState<{ discordId: string; name: string; isOwner?: boolean } | null>(null);
  const [schedDraft, setSchedDraft] = useState<{ days: Record<string, string>; note: string }>({ days: {}, note: "" });
  const [schedTarget, setSchedTarget] = useState<{ discordId: string; name: string } | null>(null); // owner editing another coach; null = self
  const [q, setQ] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refDraft, setRefDraft] = useState<Record<string, string>>({});
  const [dmDraft, setDmDraft] = useState<Record<string, string>>({});
  const [trackDraft, setTrackDraft] = useState<Record<string, string>>({});
  const [actionMsg, setActionMsg] = useState<Record<string, string>>({});
  const [resumeView, setResumeView] = useState<Record<string, { name?: string; data: unknown; updatedAt?: string } | null>>({});
  const [invoiceFor, setInvoiceFor] = useState<string | null>(null);
  const [invoiceService, setInvoiceService] = useState("");
  const [invoiceDiscount, setInvoiceDiscount] = useState("");
  const [catalog, setCatalog] = useState<{ id: string; name: string; priceCents: number }[]>([]);
  const [scheduleType, setScheduleType] = useState<Record<string, string>>({});
  const [scheduleFor, setScheduleFor] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<Record<string, string>>({});
  const [paceDraft, setPaceDraft] = useState<Record<string, string>>({});
  const [adminCode, setAdminCode] = useState("");
  const [adminCodeErr, setAdminCodeErr] = useState("");
  const [bookFor, setBookFor] = useState<string | null>(null);
  const [bookCoach, setBookCoach] = useState<Record<string, string>>({});
  const [bookSlot, setBookSlot] = useState<Record<string, string>>({});
  const [bookTopic, setBookTopic] = useState<Record<string, string>>({});

  const loadMembers = useCallback(async () => {
    const r = await fetch("/api/admin/members");
    if (r.status === 403) { setAuthed("no"); return; }
    setAuthed("yes");
    const d = await r.json();
    if (d.ok) { setMembers(d.members); setStats(d.stats); if (d.isOwner !== undefined) setMe(prev => ({ discordId: prev?.discordId ?? "", name: prev?.name ?? "Randy", isOwner: d.isOwner })); }
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
  const loadCatalog = useCallback(async () => {
    const r = await fetch("/api/admin/catalog");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) { setCatalog(d.items); if (d.items[0]) setInvoiceService(prev => prev || d.items[0].id); }
  }, []);
  const loadBookings = useCallback(async () => {
    const r = await fetch("/api/admin/bookings");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) setBookings(d.bookings);
  }, []);
  const loadSops = useCallback(async () => {
    const r = await fetch("/api/admin/sops");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) setSops(d.sops);
  }, []);
  const loadConfig = useCallback(async () => {
    const r = await fetch("/api/admin/config");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) setReferralPayoutState(d.referralPayout);
  }, []);
  const loadPayouts = useCallback(async () => {
    const r = await fetch("/api/admin/referral-payout");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) setPayouts(d.payouts);
  }, []);
  const loadVouchers = useCallback(async () => {
    const r = await fetch("/api/admin/vouchers");
    if (!r.ok) return;
    const d = await r.json();
    if (d.ok) setVouchers(d.vouchers);
  }, []);
  async function addVoucher() {
    if (!vForm.code.trim()) return;
    const r = await fetch("/api/admin/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...vForm, status: vForm.assignedTo ? "assigned" : "available" }) });
    if ((await r.json()).ok) { setVForm({ ...vForm, code: "" }); loadVouchers(); }
  }
  async function updateVoucher(id: string, patch: { status?: string; forClient?: string; assignedTo?: string }) {
    const r = await fetch("/api/admin/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) });
    if ((await r.json()).ok) loadVouchers();
  }
  async function saveSop(id: string, title: string) {
    const bodyText = sopDraft[id] ?? sops.find(s => s.id === id)?.body ?? "";
    await fetch("/api/admin/sops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, title, body: bodyText }) });
    loadSops();
  }
  async function addSop() {
    if (!newSop.title.trim()) return;
    await fetch("/api/admin/sops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSop) });
    setNewSop({ title: "", body: "" }); loadSops();
  }
  async function deleteSop(id: string) {
    if (!confirm("Delete this SOP?")) return;
    await fetch("/api/admin/sops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delete: id }) });
    loadSops();
  }
  async function loadIgDrafts() {
    try { const r = await fetch("/api/admin/ig-latest"); const d = await r.json(); if (d.ok) setIgDrafts(d.drafts); } catch { /* ignore */ }
  }
  async function postIg() {
    const intelText = igText.trim();
    setIgStatus("Building the graphic… (~15s)");
    const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "igdraft", payload: { intelText } }) });
    const d = await r.json();
    setIgStatus(r.ok && d.ok ? "✓ Generating — the image appears below + in #ig-drafts to approve." : `Error: ${d.error}`);
    if (r.ok && d.ok) { setIgText(""); setTimeout(loadIgDrafts, 12000); setTimeout(loadIgDrafts, 22000); }
  }
  async function genReferralCodes() {
    await fetch("/api/admin/gen-referral-codes", { method: "POST" });
    loadMembers();
  }
  async function blastReferralLinks() {
    const referrers = eligibleReferrers.filter(m => m.discordId && m.referralCode).map(m => ({ discordId: m.discordId, name: m.name || m.email, code: m.referralCode }));
    if (!referrers.length) { setReferralBlastMsg("No eligible referrers with a linked Discord + code yet. Click 'Generate links' first."); return; }
    setReferralBlastMsg(`Sending ${referrers.length} links…`);
    const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "referralBlast", payload: { referrers } }) });
    const d = await r.json();
    setReferralBlastMsg(r.ok && d.ok ? `✓ Queued — the bot is DMing ${referrers.length} referrers their links now.` : `Error: ${d.error || r.status}`);
  }
  async function blockReferrer(m: Member) {
    await fetch("/api/admin/referral-block", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: m.email, name: m.name, blocked: true }) });
    loadMembers();
  }
  async function savePayout() {
    const v = Number(payoutDraft);
    if (isNaN(v)) return;
    const r = await fetch("/api/admin/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ referralPayout: v }) });
    const d = await r.json();
    if (d.ok) { setReferralPayoutState(d.referralPayout); setPayoutDraft(""); }
  }
  // Record a payout against a referrer (cash or store credit). Enforces the cap by
  // logging what was actually paid — the rollup then shows owed minus paid.
  async function markPaid(referrer: string, amount: number, method: "cash" | "credit") {
    if (!amount || amount <= 0) return;
    if (!confirm(`Record ${method === "credit" ? "$" + amount + " store credit" : "$" + amount + " cash"} paid to ${referrer}?`)) return;
    const r = await fetch("/api/admin/referral-payout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ referrer, amount, method }) });
    const d = await r.json();
    if (d.ok) loadPayouts();
  }
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
  function assignRole(m: Member) {
    const roleName = roleDraft[m.email];
    if (!roleName) return;
    doAction(m.email, "assignRole", { email: m.email, discordId: m.discordId, roleName }, `✓ Assigning "${roleName}" — bot adds the Discord role.`);
  }
  async function bookMember(m: Member) {
    const coach = bookCoach[m.email];
    const slotLocal = bookSlot[m.email];
    const topic = bookTopic[m.email] || "General / not sure yet";
    if (!coach || !slotLocal) { setActionMsg(s => ({ ...s, [m.email]: "Pick a coach + time." })); return; }
    const slot = `${slotLocal}:00-04:00`; // treat picked time as ET
    const label = new Date(slot).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + " ET";
    setActionMsg(s => ({ ...s, [m.email]: "…" }));
    const r = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coach, slot, label, topic, name: m.name || m.email, email: m.email }) });
    const d = await r.json();
    setActionMsg(s => ({ ...s, [m.email]: r.ok && d.ok ? "✓ Booked — bot creates the Meet + emails them." : `Error: ${d.error || r.status}` }));
    if (r.ok && d.ok) setBookFor(null);
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
  async function setPace(m: Member) {
    const pace = Number(paceDraft[m.email]);
    if (!pace) return;
    setActionMsg(s => ({ ...s, [m.email]: "…" }));
    const trackId = m.tracks[0] || undefined;
    const r = await fetch("/api/admin/set-pace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: m.email, pace, trackId }) });
    const d = await r.json();
    setActionMsg(s => ({ ...s, [m.email]: r.ok && d.ok ? `✓ ${pace}-day plan set — they see the dated roadmap on /plan.` : `Error: ${d.error || r.status}` }));
  }
  function scheduleCall(m: Member) {
    const type = scheduleType[m.email] || "Intro";
    const blurb: Record<string, string> = {
      Intro: "Welcome aboard! Let's get you on a quick **intro call** so we can map your path.",
      Coaching: "Time to lock in your **1-on-1 coaching call**.",
      "Interview prep": "Let's get you ready — booking your **interview prep** session.",
      "Project discovery": "Let's dig into your project — booking a **discovery call**.",
    };
    doAction(m.email, "dm", { email: m.email, discordId: m.discordId, message: `📅 ${blurb[type] || blurb.Intro} DM me the word **book** here and I'll show you open times (pick your coach + a slot). See you soon!` }, `✓ Sent them the ${type.toLowerCase()} booking prompt in Discord.`);
  }
  function sendInvoice(m: Member, service: { key: string; label: string; amount: number }) {
    if (!m.email) { setActionMsg(s => ({ ...s, [m.id]: "No email on file — add one before invoicing." })); return; }
    const discountCents = Math.max(0, Math.round((parseFloat(invoiceDiscount.replace(/[^0-9.]/g, "")) || 0) * 100));
    if (discountCents >= service.amount) { setActionMsg(s => ({ ...s, [m.id]: "Discount can't be ≥ the price." })); return; }
    const fee = Math.round((service.amount - discountCents) * 0.06);
    const total = service.amount - discountCents + fee;
    const offNote = discountCents > 0 ? ` (−$${(discountCents / 100).toFixed(0)} off)` : "";
    // Confirm step — prevents accidental / duplicate sends.
    if (!confirm(`Send ${service.label}${offNote} to ${m.name || m.email}?\n\nThey'll be billed $${(total / 100).toFixed(2)} (includes 6% card fee).`)) return;
    doAction(m.email, "invoice", { clientName: m.name || m.email, clientEmail: m.email, service: service.key, discountCents }, `✓ Invoice sent: ${service.label}${offNote} → ${m.name || m.email}.`);
    setInvoiceFor(null); setInvoiceDiscount("");
  }
  function revokeAccess(m: Member) {
    if (!confirm(`Remove access for ${m.name || m.email}? They'll lose their tier + roles.`)) return;
    doAction(m.email, "revoke", { email: m.email, notify: true }, "✓ Access removal queued.");
  }
  function changeTier(m: Member, tier: string) {
    if (!tier) return;
    doAction(m.email, "setTier", { email: m.email, tier }, `✓ Changing role → ${tier}.`);
  }
  async function removeCall(c: Call) {
    if (!confirm(`Remove "${c.title}" from the CRM? It stays out on future syncs too.`)) return;
    await fetch("/api/admin/call-exclude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: c.id }) });
    setCalls(cs => cs.filter(x => x.id !== c.id));
  }
  async function deleteChat(id: string) {
    await fetch("/api/admin/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delete: id }) });
    setChat(c => c.filter(m => m.id !== id));
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
      const roster = members.slice(0, 200).map(m => {
        const pr = m.progress;
        const prog = pr ? `${pr.done} quizzes done${pr.avg != null ? `, avg ${pr.avg}%` : ""}${pr.weak?.length ? `, weak: ${pr.weak.join("/")}` : ""}` : "no quiz activity";
        return `${m.name || m.email} | ${m.tier || "—"} | ${m.paymentStatus} | ${m.daysLeft ?? "—"}d left | tracks: ${m.tracks.join("/") || "none"} | ${prog}`;
      }).join("\n");
      const focus = expanded ? members.find(m => m.id === expanded) : null;
      const r = await fetch("/api/admin/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, roster, focus }) });
      const reply = await r.text();
      setBoMsgs(m => [...m, { role: "assistant", content: reply }]);
    } catch {
      setBoMsgs(m => [...m, { role: "assistant", content: "Couldn't reach Bo just now — try again." }]);
    } finally { setBoBusy(false); }
  }

  // Schedule a call from the Calls tab — a community announcement, or a booking invite to one person.
  async function scheduleNewCall() {
    setNewCallStatus("…");
    if (newCallKind === "Community") {
      const msg = newCallText.trim() || "📣 Community call coming up! Drop in — details soon.";
      const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "announce", payload: { message: msg } }) });
      const d = await r.json();
      setNewCallStatus(r.ok && d.ok ? "✓ Posted to the announcements channel." : `Error: ${d.error}`);
    } else {
      const email = newCallEmail.trim();
      if (!email) { setNewCallStatus("Enter the person's email."); return; }
      const msg = `📅 Let's get you on a ${newCallKind.toLowerCase()} call. DM me the word **book** here and pick a coach + an open time. ${newCallText.trim()}`.trim();
      const r = await fetch("/api/admin/action", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "dm", payload: { email, message: msg } }) });
      const d = await r.json();
      setNewCallStatus(r.ok && d.ok ? `✓ Booking invite queued for ${email}.` : `Error: ${d.error}`);
    }
  }

  // Turn a call into a follow-up (optionally pre-assigned to a coach), straight from the Calls tab.
  async function createFollowupFromCall(c: Call) {
    const assignedTo = callAssignee[c.id] || "";
    setCallMsg(s => ({ ...s, [c.id]: "…" }));
    const r = await fetch("/api/admin/followups", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", title: `Follow-up: ${c.title}`, source: c.type || "call", assignedTo, note: c.actionItems ? c.actionItems.slice(0, 800) : "" }) });
    const d = await r.json();
    setCallMsg(s => ({ ...s, [c.id]: r.ok && d.ok ? `✓ Added${assignedTo ? ` for ${assignedTo}` : ""} — see Follow-ups` : `Error: ${d.error}` }));
    if (d.ok) loadFollowups();
  }

  useEffect(() => { loadMembers(); loadFollowups(); loadSchedule(); loadCalls(); loadChat(); loadCatalog(); loadBookings(); loadSops(); loadConfig(); loadPayouts(); loadVouchers(); loadIgDrafts(); }, [loadMembers, loadFollowups, loadSchedule, loadCalls, loadChat, loadCatalog, loadBookings, loadSops, loadConfig, loadPayouts, loadVouchers]);
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
    const payload = schedTarget ? { ...schedDraft, targetDiscordId: schedTarget.discordId, targetName: schedTarget.name } : schedDraft;
    await fetch("/api/admin/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
      <p className="text-gray-500 max-w-sm">Coaches only. Sign in with your Discord coach account, or your access code.</p>
      <a href="/api/auth/discord?redirect=/admin" className="px-6 py-3 font-semibold rounded-lg text-white" style={{ backgroundColor: "#5865F2" }}>Sign in with Discord</a>
      <div className="flex items-center gap-3 w-full max-w-xs my-1"><div className="flex-1 h-px bg-gray-300" /><span className="text-gray-400 text-xs">or access code</span><div className="flex-1 h-px bg-gray-300" /></div>
      <div className="flex gap-2 w-full max-w-xs">
        <input
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key !== "Enter" || !adminCode.trim()) return;
            setAdminCodeErr("");
            const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: adminCode.trim().toUpperCase() }) });
            if (r.ok) window.location.reload(); else setAdminCodeErr("Invalid code");
          }}
          placeholder="ACCESS CODE"
          className="flex-1 border border-[#dadce0] rounded-lg px-3 py-2.5 text-sm uppercase tracking-wide focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={async () => {
            if (!adminCode.trim()) return;
            setAdminCodeErr("");
            const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: adminCode.trim().toUpperCase() }) });
            if (r.ok) window.location.reload(); else setAdminCodeErr("Invalid code");
          }}
          className="px-4 py-2.5 rounded-lg bg-[#202124] text-white font-semibold text-sm hover:bg-black"
        >Sign In</button>
      </div>
      {adminCodeErr && <div className="text-red-500 text-sm">{adminCodeErr}</div>}
    </main>
  );

  const openFollowups = followups.filter(f => f.status === "open" && !f.archived);
  const doneFollowups = followups.filter(f => f.status === "done" && !f.archived);
  const archivedFollowups = followups.filter(f => f.archived);
  const filteredMembers = members.filter(m =>
    (!q || [m.name, m.email, m.discordTag, m.tier, m.tracks.join(",")].join(" ").toLowerCase().includes(q.toLowerCase())) &&
    (!fTier || m.tier === fTier) &&
    (!fStatus || m.paymentStatus === fStatus));
  const lateCount = members.filter(m => m.paymentStatus === "late" || m.paymentStatus === "expired").length;

  // Referral rollup: group by who referred them, count paid, compute payout owed.
  const referrerMap: Record<string, Member[]> = {};
  members.forEach(m => { if (m.referredBy) (referrerMap[m.referredBy] ||= []).push(m); });
  // Only ACTIVE/COMP referrals count toward payout — a refunded or churned referral
  // flips to expired/canceled and drops out, so you never pay on money you gave back.
  // Cash is capped at $500/person ($50 × 10). At the cap they can take $1,000 store
  // credit instead; below it, credit = 2× the cash owed.
  const CAP_PER_PERSON = 500;
  // Look up each referrer's founding tier by their code → tier-based rate.
  // Tier 1 (first 100 paid founders) = $50/referral · Tier 2 (joined after) = $25/referral.
  const byRefCode: Record<string, Member> = {};
  members.forEach(m => { if (m.referralCode) byRefCode[m.referralCode.toLowerCase()] = m; });
  // Payout LEDGER: sum what's actually been paid per referrer so the rollup shows
  // owed MINUS paid = remaining (and the $500 cap is enforced, not just displayed).
  const paidCashByRef: Record<string, number> = {};
  const tookCreditByRef: Record<string, boolean> = {};
  payouts.forEach(p => {
    const k = String(p.referrer || "").toLowerCase();
    if (p.method === "credit") tookCreditByRef[k] = true;
    else paidCashByRef[k] = (paidCashByRef[k] || 0) + (Number(p.amount) || 0);
  });
  const referrers = Object.entries(referrerMap).map(([ref, list]) => {
    const paid = list.filter(x => x.paymentStatus === "active" || x.paymentStatus === "comp").length;
    const refMember = byRefCode[String(ref).toLowerCase()];
    const tier = refMember?.foundingTier === 2 ? 2 : 1;
    const rate = tier === 2 ? 25 : 50;
    const owedRaw = paid * rate;
    const owed = Math.min(owedRaw, CAP_PER_PERSON);
    const k = String(ref).toLowerCase();
    const paidOut = paidCashByRef[k] || 0;
    const tookCredit = !!tookCreditByRef[k];
    // Credit closes out the whole balance; otherwise remaining = owed − cash already paid.
    const remaining = tookCredit ? 0 : Math.max(0, owed - paidOut);
    const settled = remaining === 0 && (paidOut > 0 || tookCredit);
    return { ref, tier, rate, count: list.length, paid, owed, paidOut, tookCredit, remaining, settled, capped: owedRaw > CAP_PER_PERSON, creditOption: owed >= CAP_PER_PERSON ? 1000 : owed * 2 };
  }).sort((a, b) => b.remaining - a.remaining || b.owed - a.owed || b.count - a.count);
  const totalOwed = referrers.reduce((s, r) => s + r.remaining, 0);
  const eligibleReferrers = members.filter(m => m.referralEligible).sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email));

  // ── Coach Home (command center) — derived from already-loaded state, no new fetch ──
  const homeOpenFollowups = followups.filter(f => f.status === "open" && !f.archived);
  const atRiskMembers = members
    .filter(m => m.daysLeft != null && m.daysLeft >= 0 && m.daysLeft <= 7)
    .sort((a, b) => (a.daysLeft ?? 999) - (b.daysLeft ?? 999));
  const todayStr = new Date().toDateString();
  const todayBookings = bookings
    .filter(b => b.slot && new Date(b.slot).toDateString() === todayStr)
    .sort((a, b) => Date.parse(a.slot) - Date.parse(b.slot));

  const TABS: { id: typeof tab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "followups", label: "Follow-ups" },
    { id: "members", label: "Members" },
    { id: "calls", label: "Calls" },
    { id: "schedule", label: "Schedule" },
    { id: "team", label: "Team Chat" },
    { id: "bo", label: "Ask Bo" },
    { id: "sops", label: "SOPs" },
    { id: "resources", label: "Resources" },
    { id: "vouchers", label: "Vouchers" },
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
              <button onClick={async () => { await fetch("/api/logout", { method: "POST" }); window.location.href = "/login"; }} className="text-[11px] text-gray-500 hover:text-red-600 border border-[#dadce0] rounded-lg px-2.5 py-1">Sign out</button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Members", value: stats?.total ?? members.length, tone: "text-[#202124]" },
            ...(me?.isOwner ? [{ label: "Paid", value: stats?.paid ?? 0, tone: "text-green-700" }] : []),
            ...(me?.isOwner ? [{ label: "Free (Discord)", value: stats?.free ?? 0, tone: "text-gray-500" }] : []),
            { label: "Expiring ≤30d", value: stats?.expiringSoon ?? 0, tone: "text-amber-600" },
            { label: "Late / expired", value: lateCount, tone: "text-red-600" },
            ...(me?.isOwner ? [{ label: "Comped (you only)", value: stats?.comped ?? 0, tone: "text-blue-600" }] : []),
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

        {/* ── Home / Command Center ── */}
        {tab === "home" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-3">
              <button onClick={() => setTab("followups")} className="text-left bg-white border border-[#dadce0] rounded-xl p-5 hover:border-[#202124] transition">
                <div className="text-3xl font-semibold text-[#202124]">{homeOpenFollowups.length}</div>
                <div className="text-sm text-gray-600 mt-1">Open follow-ups</div>
                <div className="text-xs text-orange-600 mt-2 font-medium">Work the list →</div>
              </button>
              <button onClick={() => setTab("members")} className="text-left bg-white border border-[#dadce0] rounded-xl p-5 hover:border-[#202124] transition">
                <div className="text-3xl font-semibold text-amber-600">{atRiskMembers.length}</div>
                <div className="text-sm text-gray-600 mt-1">Expiring ≤ 7 days</div>
                <div className="text-xs text-orange-600 mt-2 font-medium">Save the revenue →</div>
              </button>
              <button onClick={() => setTab("referrals")} className="text-left bg-white border border-[#dadce0] rounded-xl p-5 hover:border-[#202124] transition">
                <div className="text-3xl font-semibold text-green-600">${totalOwed}</div>
                <div className="text-sm text-gray-600 mt-1">Referral payouts due</div>
                <div className="text-xs text-orange-600 mt-2 font-medium">Review payouts →</div>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-[#dadce0] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#202124]">Today&rsquo;s 1-on-1s</h3>
                  <button onClick={() => setTab("schedule")} className="text-xs text-gray-500 hover:text-[#202124]">Schedule →</button>
                </div>
                {todayBookings.length > 0 ? (
                  <div className="space-y-2">
                    {todayBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between text-sm border border-[#e8eaed] rounded-lg px-3 py-2">
                        <span className="font-medium text-[#202124]">{new Date(b.slot).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · {b.userName || "Member"}</span>
                        <span className="text-gray-500">{b.topic || b.label || ""}{b.coach ? ` · ${b.coach}` : ""}</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">Nothing booked today.</p>}
              </div>

              <div className="bg-white border border-[#dadce0] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#202124]">Revenue at risk</h3>
                  <button onClick={() => setTab("members")} className="text-xs text-gray-500 hover:text-[#202124]">Members →</button>
                </div>
                {atRiskMembers.length > 0 ? (
                  <div className="space-y-2">
                    {atRiskMembers.slice(0, 6).map(m => (
                      <div key={m.email} className="flex items-center justify-between text-sm border border-[#e8eaed] rounded-lg px-3 py-2">
                        <span className="font-medium text-[#202124]">{m.name || m.email}</span>
                        <span className="text-amber-600 font-medium">{m.daysLeft}d left</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">No one expiring this week. 🎉</p>}
              </div>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#202124]">Follow-ups to work</h3>
                <button onClick={() => setTab("followups")} className="text-xs text-gray-500 hover:text-[#202124]">All follow-ups →</button>
              </div>
              {homeOpenFollowups.length > 0 ? (
                <div className="space-y-2">
                  {homeOpenFollowups.slice(0, 5).map(f => (
                    <div key={f.id} className="flex items-center justify-between text-sm border border-[#e8eaed] rounded-lg px-3 py-2">
                      <span className="text-[#202124]">{f.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${f.assignedTo ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>{f.assignedTo || "unassigned"}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">Inbox zero — nothing open.</p>}
            </div>
          </div>
        )}

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
                    <button onClick={() => act({ action: "delete", id: f.id })} className="text-xs px-2 py-1 rounded-lg border border-[#dadce0] text-gray-500 hover:bg-gray-50" title="Archives it — restore anytime, never deleted">Archive</button>
                  </div>
                </div>
                {(Array.isArray(f.notes) ? f.notes : []).length > 0 && (
                  <div className="mt-3 space-y-1">
                    {(Array.isArray(f.notes) ? f.notes : []).map((n, i) => (
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

            {archivedFollowups.length > 0 && (
              <details className="text-sm">
                <summary className="text-gray-500 cursor-pointer">🗄 {archivedFollowups.length} archived (nothing is ever deleted — restore anytime)</summary>
                <div className="mt-2 space-y-1">
                  {archivedFollowups.map(f => (
                    <div key={f.id} className="text-xs text-gray-500 flex items-center justify-between bg-white border border-[#e8eaed] rounded px-3 py-1.5">
                      <span>{f.title}{f.assignedTo ? ` · ${f.assignedTo}` : ""}</span>
                      <button onClick={() => act({ action: "restore", id: f.id })} className="text-green-600 hover:underline font-medium">Restore</button>
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
                    <Fragment key={m.id}>
                      <tr className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa] cursor-pointer" onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                        <td className="py-2.5 px-4">
                          <div className="font-medium">{m.name || m.email}</div>
                          <div className="text-xs text-gray-500">{m.email}{m.discordTag ? ` · ${m.discordTag}` : ""}</div>
                        </td>
                        <td className="px-3 text-gray-700">{m.tier || "—"} <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded font-bold ${m.foundingTier === 2 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`} title={m.foundingTier === 2 ? "Founding Tier 2 — joined after the first 100 ($25/referral)" : "Founding Tier 1 — first 100 ($50/referral)"}>Founding T{m.foundingTier || 1}</span></td>
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
                      {expanded === m.id && (
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
                          <div className="text-xs text-gray-400 mb-1.5">What was sent to this member</div>
                          {m.sentLog?.length ? (
                            <div className="space-y-1 mb-4">
                              {[...m.sentLog].reverse().slice(0, 12).map((e, i) => (
                                <div key={i} className="text-xs bg-[#f8f9fa] border border-[#e8eaed] rounded px-2 py-1 flex items-center justify-between gap-2">
                                  <span><span className="inline-block px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 text-[10px] mr-1.5">{e.type === "email" ? "✉️ email" : e.type === "dm" ? "💬 DM" : e.type}</span>{e.title}{e.detail ? <span className="text-gray-400"> — {e.detail}</span> : ""}</span>
                                  <span className="text-gray-400 whitespace-nowrap">{e.at ? new Date(e.at).toLocaleDateString() : ""}</span>
                                </div>
                              ))}
                            </div>
                          ) : <div className="text-gray-500 text-xs mb-4">Nothing logged yet — welcome emails + onboarding DMs will appear here as they go out.</div>}

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
                              <button onClick={() => setScheduleFor(scheduleFor === m.id ? null : m.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">📅 Schedule call</button>
                              <button onClick={() => viewResume(m)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">📄 {resumeView[m.email] ? "Hide" : "View"} resume</button>
                              <span className="inline-flex items-center gap-1">
                                <select value={trackDraft[m.email] || ""} onChange={e => setTrackDraft(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                  <option value="">Add track…</option>
                                  {["secplus", "csa", "aws", "secret", "ts", "tsci"].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button onClick={() => addTrack(m)} className="text-xs px-2.5 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Grant</button>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <select value={roleDraft[m.email] || ""} onChange={e => setRoleDraft(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                  <option value="">Assign role…</option>
                                  {["ROT Client", "Founding Member", "Security+", "ServiceNow CSA", "AWS AI Practitioner"].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <button onClick={() => assignRole(m)} className="text-xs px-2.5 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Assign</button>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <select value={paceDraft[m.email] || ""} onChange={e => setPaceDraft(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                  <option value="">Study pace…</option>
                                  <option value="30">30-day</option>
                                  <option value="60">60-day</option>
                                  <option value="90">90-day</option>
                                </select>
                                <button onClick={() => setPace(m)} className="text-xs px-2.5 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Set plan</button>
                              </span>
                              <button onClick={() => setBookFor(bookFor === m.id ? null : m.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">📆 Book</button>
                              <button onClick={() => setInvoiceFor(invoiceFor === m.id ? null : m.id)} className="text-xs px-2.5 py-1.5 rounded-lg border border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100">🧾 Send invoice</button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <input value={dmDraft[m.email] || ""} onChange={e => setDmDraft(s => ({ ...s, [m.email]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter") sendUpdate(m); }}
                                placeholder="Send update (DMs them in Discord)…" className="flex-1 min-w-[220px] text-xs border border-[#dadce0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-orange-500" />
                              <button onClick={() => sendUpdate(m)} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Send</button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Manage:</span>
                              <select defaultValue="" onChange={e => { changeTier(m, e.target.value); e.target.value = ""; }} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                <option value="">Change role…</option>
                                {["founding", "secplus", "csa", "aws", "secret", "ts", "tsci", "comp"].map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <button onClick={() => revokeAccess(m)} className="text-xs px-2.5 py-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100">Remove access</button>
                            </div>
                            {invoiceFor === m.id && (
                              <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-2.5">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="text-xs text-orange-800 font-medium">Invoice {m.name || m.email}</span>
                                  {!m.email && <span className="text-[11px] text-red-600 font-medium">⚠ no email on file — add one first</span>}
                                  <label className="ml-auto text-[11px] text-orange-800 flex items-center gap-1">$ off <input value={invoiceDiscount} onChange={e => setInvoiceDiscount(e.target.value)} placeholder="0" title="Discount in dollars (coaches capped at $300)" className="text-xs border border-orange-200 rounded-lg px-2 py-1 bg-white w-14" /></label>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {COACH_SERVICES.map(s => (
                                    <button key={s.key} disabled={!m.email} onClick={() => sendInvoice(m, s)} className="text-xs px-2.5 py-1.5 rounded-lg bg-white border border-orange-300 text-orange-800 hover:bg-orange-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed">{s.label} · ${(s.amount / 100).toFixed(0)}</button>
                                  ))}
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1.5">Click a program → confirm → sends (6% card fee added; coach discount ≤$300).</p>
                              </div>
                            )}
                            {scheduleFor === m.id && (
                              <div className="mt-2 bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs text-gray-700">Meeting type:</span>
                                  <select value={scheduleType[m.email] || "Intro"} onChange={e => setScheduleType(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500">
                                    {["Intro", "Coaching", "Interview prep", "Project discovery"].map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <button onClick={() => { scheduleCall(m); setScheduleFor(null); }} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Send booking invite</button>
                                  <button onClick={() => setScheduleFor(null)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] text-gray-600 hover:bg-white">Cancel</button>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1.5">This DMs {m.name || "them"} in Discord to book a {(scheduleType[m.email] || "Intro").toLowerCase()} call — they pick a coach + an open time (tomorrow 11–5 ET) in the bot. It doesn&apos;t reserve a slot here or charge anything.</p>
                              </div>
                            )}
                            {bookFor === m.id && (
                              <div className="mt-2 bg-[#f8f9fa] border border-[#dadce0] rounded-lg p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs text-gray-700">Book a 1-on-1:</span>
                                  <select value={bookCoach[m.email] || ""} onChange={e => setBookCoach(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white">
                                    <option value="">Coach…</option>
                                    {[["randy", "Randy"], ["tyler", "Tyler"], ["daquan", "Daquan"]].map(([k, n]) => <option key={k} value={k}>{n}</option>)}
                                  </select>
                                  <input type="datetime-local" value={bookSlot[m.email] || ""} onChange={e => setBookSlot(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white" />
                                  <select value={bookTopic[m.email] || ""} onChange={e => setBookTopic(s => ({ ...s, [m.email]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white">
                                    {["General / not sure yet", "Certifications / studying", "Career / resume", "Clearance"].map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                  <button onClick={() => bookMember(m)} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Book it</button>
                                  <button onClick={() => {
                                    const params = new URLSearchParams();
                                    if (bookCoach[m.email]) params.set("coach", bookCoach[m.email]);
                                    if (bookTopic[m.email]) params.set("topic", bookTopic[m.email]);
                                    const url = `${window.location.origin}/book${params.toString() ? `?${params}` : ""}`;
                                    navigator.clipboard?.writeText(url).then(
                                      () => setActionMsg(s => ({ ...s, [m.email]: `📋 Booking link copied — paste it to ${m.name || "them"} (they pick their own time).` })),
                                      () => setActionMsg(s => ({ ...s, [m.email]: url })),
                                    );
                                  }} className="text-xs px-3 py-1.5 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50">📋 Copy send-link</button>
                                  <button onClick={() => setBookFor(null)} className="text-xs px-2.5 py-1.5 rounded-lg border border-[#dadce0] text-gray-600 hover:bg-white">Cancel</button>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1.5"><b>Book it</b> = you set the time now. <b>Copy send-link</b> = send {m.name || "them"} a link (preset to the coach) so they pick their own time. Either way the bot makes the Meet, adds Fireflies, and emails the link.</p>
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
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-gray-500 text-sm mr-auto">Every call from Fireflies — coaching, interview prep, project discovery, voice-agent. Newest first.</p>
              <button onClick={() => { setNewCall(v => !v); setNewCallStatus(""); }} className="text-xs px-3 py-1.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700">+ Schedule a call</button>
            </div>
            {newCall && (
              <div className="bg-[#f8f9fa] border border-[#dadce0] rounded-xl p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <select value={newCallKind} onChange={e => setNewCallKind(e.target.value)} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white">
                    {["Community", "Intro", "Coaching", "Interview prep", "Project discovery"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {newCallKind !== "Community" && (
                    <input value={newCallEmail} onChange={e => setNewCallEmail(e.target.value)} placeholder="member email" className="text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white min-w-[180px] focus:outline-none focus:border-orange-500" />
                  )}
                  <button onClick={scheduleNewCall} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">{newCallKind === "Community" ? "Post community call" : "Send booking invite"}</button>
                </div>
                <textarea value={newCallText} onChange={e => setNewCallText(e.target.value)} rows={2}
                  placeholder={newCallKind === "Community" ? "Community call message (posted to the announcements channel)…" : "Optional extra note for the booking invite…"}
                  className="w-full text-xs border border-[#dadce0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500" />
                <p className="text-[11px] text-gray-500">{newCallKind === "Community" ? "Posts an announcement to your Discord so the whole community sees it." : "DMs that member in Discord to book a coach + time. Doesn't reserve a slot here."}</p>
                {newCallStatus && <div className="text-[11px] text-green-700">{newCallStatus}</div>}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {["all", "coaching", "interview", "discovery", "voice", "team", "other"].map(t => (
                <button key={t} onClick={() => setCallType(t)} className={`text-xs px-2.5 py-1 rounded-full border ${callType === t ? "bg-[#202124] text-white border-[#202124]" : "bg-white text-gray-600 border-[#dadce0] hover:bg-gray-50"}`}>{t}</button>
              ))}
            </div>
            {calls.length === 0 && <p className="text-gray-500 text-sm">No calls synced yet. They appear here automatically once the bot syncs Fireflies (needs <span className="font-mono">FIREFLIES_API_KEY</span> on Railway). New calls land within the hour.</p>}
            {calls.filter(c => callType === "all" || (c.type || "other") === callType).map(c => (
              <details key={c.id} className="bg-white border border-[#dadce0] rounded-xl overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer flex items-center justify-between gap-3 hover:bg-[#f8f9fa]">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${CALL_PILL[c.type || "other"] || "bg-gray-100 text-gray-600 border-gray-200"}`}>{c.type || "other"}</span>
                      <span className="truncate">{c.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.date ? new Date(c.date).toLocaleString() : (c.gradedAt ? new Date(c.gradedAt).toLocaleDateString() : "")}
                      {c.participants?.length ? ` · ${c.participants.join(", ").slice(0, 60)}` : ""}
                    </div>
                  </div>
                  <span className="text-xs text-orange-600 shrink-0">view ▾</span>
                </summary>
                <div className="px-4 py-3 border-t border-[#e8eaed] text-sm text-gray-700 space-y-3">
                  {c.summary && <div><div className="text-xs text-gray-400 mb-0.5">Summary</div><div className="whitespace-pre-wrap">{c.summary}</div></div>}
                  {c.actionItems && <div><div className="text-xs text-gray-400 mb-0.5">Action items</div><div className="whitespace-pre-wrap text-[13px]">{c.actionItems}</div></div>}
                  {c.grade && <div><div className="text-xs text-gray-400 mb-0.5">Coaching scorecard</div><div className="whitespace-pre-wrap text-[13px]">{c.grade}</div></div>}
                  {!c.summary && !c.actionItems && !c.grade && <div className="text-gray-500">No summary saved for this call.</div>}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {c.transcriptUrl && <a href={c.transcriptUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline text-xs">Open transcript ↗</a>}
                    <button onClick={() => createFollowupFromCall(c)} className="text-xs px-2.5 py-1 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">+ Follow-up</button>
                    <button onClick={() => removeCall(c)} className="text-xs px-2.5 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                    <select value={callAssignee[c.id] || ""} onChange={e => setCallAssignee(s => ({ ...s, [c.id]: e.target.value }))} className="text-xs border border-[#dadce0] rounded-lg px-2 py-1 bg-white">
                      <option value="">Assign to…</option>
                      {["Randy", "Tyler", "Daquan"].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    {callMsg[c.id] && <span className="text-[11px] text-green-700">{callMsg[c.id]}</span>}
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}

        {/* ── Schedule ── */}
        {tab === "schedule" && (
          <div className="space-y-5">
            {/* Upcoming 1-on-1s booked via Bo's DM flow */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4">
              <div className="font-semibold mb-2">📅 Upcoming bookings</div>
              {bookings.length === 0 ? <p className="text-gray-500 text-sm">No upcoming 1-on-1s. They show here the moment someone books via Bo.</p> : (
                <div className="space-y-1.5">
                  {bookings.map(b => (
                    <div key={b.id} className="flex flex-wrap items-center gap-2 text-sm border-b border-[#f1f3f4] pb-1.5">
                      <span className="font-medium">{b.userName || "Member"}</span>
                      <span className="text-gray-400">→</span>
                      <span>{b.coach}</span>
                      <span className="text-gray-500">· {b.label}</span>
                      {b.topic && <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{b.topic}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">Set your weekly availability so the team knows when you&apos;re free.{me?.isOwner ? " As owner, you can edit any coach's row — hit Edit on their line. Coaches can only edit their own (not yours)." : " You can only edit your own row."}</p>
            <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]">
                  <tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Coach</th>
                    {WEEKDAYS.map(d => <th key={d} className="px-3 font-medium">{d}</th>)}
                    <th className="px-3 font-medium">Note</th>
                    {me?.isOwner && <th className="px-3 font-medium">Edit</th>}
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 && <tr><td colSpan={10} className="py-4 px-4 text-gray-500">No availability set yet.</td></tr>}
                  {schedules.map(s => (
                    <tr key={s.discordId} className="border-b border-[#f1f3f4]">
                      <td className="py-2.5 px-4 font-medium">{s.name}{me && s.discordId === me.discordId && <span className="text-orange-600 text-xs ml-1">(you)</span>}</td>
                      {WEEKDAYS.map(d => <td key={d} className="px-3 text-gray-600 text-xs">{s.days?.[d] || "—"}</td>)}
                      <td className="px-3 text-gray-500 text-xs">{s.note || ""}</td>
                      {me?.isOwner && <td className="px-3"><button onClick={() => { setSchedTarget(s.discordId === me.discordId ? null : { discordId: s.discordId, name: s.name }); setSchedDraft({ days: { ...(s.days || {}) }, note: s.note || "" }); }} className="text-xs text-orange-600 hover:underline">Edit</button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-[#dadce0] rounded-xl p-4">
              <div className="font-semibold mb-3 flex items-center gap-2 flex-wrap">
                <span>{schedTarget ? `Editing ${schedTarget.name}'s availability` : `Your availability${me ? ` — ${me.name}` : ""}`}</span>
                {schedTarget && <button onClick={() => { setSchedTarget(null); const mine = schedules.find(s => !!me && s.discordId === me.discordId); setSchedDraft(mine ? { days: { ...mine.days }, note: mine.note || "" } : { days: {}, note: "" }); }} className="text-xs text-gray-500 hover:text-orange-600 underline">← back to mine</button>}
              </div>
              <div className="space-y-2 mb-3">
                {WEEKDAYS.map(d => {
                  const cur = parseDay(schedDraft.days[d] || "");
                  const setPart = (part: "start" | "end", val: string) => setSchedDraft(s => {
                    const next = { ...parseDay(s.days[d] || ""), [part]: val };
                    // Retain a start-only pick (end still empty) so the start sticks and the
                    // END dropdown un-disables. Before, picking a start saved "" — which snapped
                    // it back to Off and left End disabled forever (couldn't set any time).
                    const composed = next.start
                      ? (next.end ? `${next.start}–${next.end} ET` : `${next.start}– ET`)
                      : "";
                    return { ...s, days: { ...s.days, [d]: composed } };
                  });
                  return (
                    <div key={d} className="flex items-center gap-2 text-sm">
                      <span className="w-10 text-gray-500">{d}</span>
                      <select value={cur.start} onChange={e => setPart("start", e.target.value)} className="border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white text-sm focus:outline-none focus:border-orange-500">
                        {TIME_OPTS.map(t => <option key={t} value={t}>{t || "Off"}</option>)}
                      </select>
                      <span className="text-gray-400">to</span>
                      <select value={cur.end} onChange={e => setPart("end", e.target.value)} disabled={!cur.start} className="border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white text-sm disabled:opacity-40 focus:outline-none focus:border-orange-500">
                        {TIME_OPTS.map(t => <option key={t} value={t}>{t || "—"}</option>)}
                      </select>
                      {cur.start && cur.end && <span className="text-xs text-green-600">✓</span>}
                    </div>
                  );
                })}
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
            {/* Post tech intel to Instagram (goes to #ig-drafts for approval — never auto-posts) */}
            <div className="px-4 py-3 border-b border-[#e8eaed] bg-[#f8f9fa]">
              <div className="text-xs font-semibold text-[#202124] mb-1.5">📣 Post tech intel to Instagram</div>
              <div className="flex flex-wrap gap-2">
                <input value={igText} onChange={e => setIgText(e.target.value)} placeholder="Optional: paste/short the intel (blank = auto from latest tech-news)" className="flex-1 min-w-[220px] text-xs border border-[#dadce0] rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-orange-500" />
                <button onClick={postIg} className="text-xs px-3 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Build IG draft</button>
              </div>
              {igStatus && <div className="text-[11px] text-gray-600 mt-1">{igStatus}</div>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-gray-400">Recent graphics (approve/post in #ig-drafts):</span>
                <button onClick={loadIgDrafts} className="text-[11px] text-orange-600 hover:underline">↻ Refresh</button>
              </div>
              {igDrafts.length === 0 ? <div className="text-[11px] text-gray-400 mt-1">None yet — build one above.</div> : (
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {igDrafts.map(d => (
                    <a key={d.id} href={d.imageUrl} target="_blank" rel="noreferrer" title={d.caption} className="shrink-0">
                      <img src={d.imageUrl} alt="IG draft" className="h-28 w-auto rounded-lg border border-[#dadce0] hover:border-orange-500" />
                      <div className="text-[10px] text-gray-400 mt-0.5 text-center">{d.status}</div>
                    </a>
                  ))}
                </div>
              )}
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
                      <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                        {new Date(m.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        <button onClick={() => deleteChat(m.id)} className="ml-2 text-red-400 hover:text-red-600">delete</button>
                      </span>
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
              <div className="text-xs text-gray-500">{expanded ? `Looking at: ${members.find(m => m.id === expanded)?.name || members.find(m => m.id === expanded)?.email || "member"}` : "Open a member for member-specific help"}</div>
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

        {/* ── SOPs ── */}
        {tab === "sops" && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">Team guides for every service. Edit any SOP and save — everyone sees the latest.</p>
            {sops.map(s => (
              <div key={s.id} className="bg-white border border-[#dadce0] rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-semibold">{s.title}</div>
                  <div className="flex items-center gap-2">
                    {s.updatedBy && <span className="text-[11px] text-gray-400">updated by {s.updatedBy}</span>}
                    <button onClick={() => saveSop(s.id, s.title)} className="text-xs px-3 py-1 rounded-lg bg-[#202124] text-white hover:bg-black">Save</button>
                    <button onClick={() => deleteSop(s.id)} className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </div>
                <textarea value={sopDraft[s.id] ?? s.body} onChange={e => setSopDraft(d => ({ ...d, [s.id]: e.target.value }))} rows={4}
                  className="w-full text-sm border border-[#dadce0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500" />
              </div>
            ))}
            <div className="bg-[#f8f9fa] border border-dashed border-[#dadce0] rounded-xl p-4 space-y-2">
              <div className="font-semibold text-sm">+ New SOP</div>
              <input value={newSop.title} onChange={e => setNewSop(s => ({ ...s, title: e.target.value }))} placeholder="Title (e.g. AWS Track)" className="w-full text-sm border border-[#dadce0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500" />
              <textarea value={newSop.body} onChange={e => setNewSop(s => ({ ...s, body: e.target.value }))} rows={3} placeholder="The guide…" className="w-full text-sm border border-[#dadce0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-orange-500" />
              <button onClick={addSop} className="text-xs px-4 py-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700">Add SOP</button>
            </div>
          </div>
        )}

        {/* ── Vouchers ── */}
        {tab === "vouchers" && (
          <div>
            <div className="bg-white border border-[#dadce0] rounded-xl p-4 mb-5">
              <div className="font-semibold text-sm mb-1">🎟️ Add a voucher</div>
              <p className="text-xs text-gray-500 mb-3">Log exam vouchers ROT buys (e.g. GC4L). Assign to a coach to hand out — then mark which client got it + when it&apos;s used. Nothing gets lost.</p>
              <div className="flex flex-wrap gap-2 items-end">
                <input value={vForm.code} onChange={e => setVForm({ ...vForm, code: e.target.value })} placeholder="Voucher code" className="text-xs border border-[#dadce0] rounded-lg px-2.5 py-2 font-mono w-40" />
                <input value={vForm.cert} onChange={e => setVForm({ ...vForm, cert: e.target.value })} placeholder="Cert" className="text-xs border border-[#dadce0] rounded-lg px-2.5 py-2 w-56" />
                <input value={vForm.expiry} onChange={e => setVForm({ ...vForm, expiry: e.target.value })} placeholder="Expiry (12/30/2026)" className="text-xs border border-[#dadce0] rounded-lg px-2.5 py-2 w-32" />
                <input value={vForm.assignedTo} onChange={e => setVForm({ ...vForm, assignedTo: e.target.value })} placeholder="Assign to coach" className="text-xs border border-[#dadce0] rounded-lg px-2.5 py-2 w-36" />
                <input value={vForm.source} onChange={e => setVForm({ ...vForm, source: e.target.value })} placeholder="Source (GC4L #…)" className="text-xs border border-[#dadce0] rounded-lg px-2.5 py-2 w-36" />
                <button onClick={addVoucher} className="text-xs px-3 py-2 rounded-lg bg-[#202124] text-white hover:bg-black">Add</button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
              <span><b className="text-[#202124]">{vouchers.length}</b> total</span>
              <span><b className="text-green-700">{vouchers.filter(v => v.status !== "used").length}</b> live</span>
              <span><b className="text-gray-500">{vouchers.filter(v => v.status === "used").length}</b> used</span>
            </div>
            {vouchers.length === 0 ? (
              <div className="bg-white border border-[#dadce0] rounded-xl p-6 text-sm text-gray-500">No vouchers logged yet. Add one above.</div>
            ) : (
              <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]"><tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Code</th><th className="px-3 font-medium">Cert</th><th className="px-3 font-medium">Expiry</th><th className="px-3 font-medium">Coach</th><th className="px-3 font-medium">Receipt</th><th className="px-3 font-medium">For client</th><th className="px-3 font-medium">Status</th>
                  </tr></thead>
                  <tbody>
                    {vouchers.map(v => (
                      <tr key={v.id} className={`border-b border-[#f1f3f4] hover:bg-[#f8f9fa] ${v.status === "used" ? "opacity-50" : ""}`}>
                        <td className="py-2.5 px-4 font-mono text-xs">{v.code}</td>
                        <td className="px-3 text-gray-600">{v.cert}</td>
                        <td className="px-3 text-gray-500">{v.expiry || "—"}</td>
                        <td className="px-3">{v.assignedTo || "—"}</td>
                        <td className="px-3 whitespace-nowrap">
                          {v.confirmedByCoach
                            ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-semibold" title={v.confirmedAt ? `Confirmed ${new Date(v.confirmedAt).toLocaleString()}` : ""}>✓ confirmed{v.confirmedBy ? ` · ${v.confirmedBy}` : ""}</span>
                            : v.sentAt
                            ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold" title={`Sent ${new Date(v.sentAt).toLocaleString()}`}>sent · awaiting</span>
                            : <span className="text-[10px] text-gray-400">not sent</span>}
                        </td>
                        <td className="px-3">
                          <input value={vClientDraft[v.id] ?? v.forClient ?? ""} onChange={e => setVClientDraft({ ...vClientDraft, [v.id]: e.target.value })} onBlur={e => { const val = e.target.value.trim(); if (val !== (v.forClient || "")) updateVoucher(v.id, { forClient: val, status: val && v.status === "assigned" ? "given" : v.status }); }} placeholder="client name" className="text-xs border border-[#e8eaed] rounded px-2 py-1 w-28" />
                        </td>
                        <td className="px-3">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${v.status === "used" ? "bg-gray-100 text-gray-500" : v.status === "given" ? "bg-blue-100 text-blue-700" : v.status === "assigned" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{v.status}</span>
                            {v.status !== "used" && <button onClick={() => updateVoucher(v.id, { status: "used" })} className="text-[11px] px-2 py-0.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50">Mark used</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Referrals ── */}
        {tab === "referrals" && (
          <div>
            {/* Who is allowed to refer — active founding members + coaches. Share the $127 link with these people. */}
            <div className="bg-white border border-[#dadce0] rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="font-semibold text-sm">✅ Eligible referrers <span className="text-gray-400 font-normal">({eligibleReferrers.length}) — each gets a unique link</span></div>
                <div className="flex gap-2">
                  <button onClick={genReferralCodes} className="text-xs px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">Generate links</button>
                  <button onClick={blastReferralLinks} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">📨 DM everyone their link</button>
                </div>
              </div>
              {referralBlastMsg && <div className="text-xs text-green-700 mb-2">{referralBlastMsg}</div>}
              <p className="text-xs text-gray-500 mb-3">Paid founding members + coaches. Each person&apos;s <b>rotechllc.com/r/[code]</b> link auto-credits them by the buyer&apos;s email — no typing, bulletproof. Click a link to copy it and send it to them.</p>
              {eligibleReferrers.length === 0 ? (
                <div className="text-xs text-gray-400">No eligible referrers yet.</div>
              ) : (
                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {eligibleReferrers.map(m => (
                    <div key={m.email} className="flex items-center justify-between gap-2 text-xs border-b border-[#f1f3f4] py-1.5">
                      <span className="font-medium truncate">{m.name || m.email}</span>
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        {m.referralCode ? (
                          <button onClick={() => { navigator.clipboard.writeText(`https://rotechllc.com/r/${m.referralCode}`); setCopied(m.email); setTimeout(() => setCopied(""), 1500); }} className="text-[11px] px-2 py-1 rounded bg-gray-100 border border-gray-200 hover:border-orange-400 font-mono">{copied === m.email ? "✓ copied!" : `rotechllc.com/r/${m.referralCode}`}</button>
                        ) : <span className="text-gray-400">— click Generate links</span>}
                        <button onClick={() => blockReferrer(m)} title="Remove — they can't refer" className="text-[13px] px-1.5 py-0.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50">✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-gray-500 text-sm mr-auto">Auto-captured from referral links. <b>${referralPayout}</b>/cleared referral, <b>capped at $500/person</b> (or $1,000 store credit). Only active (non-refunded) referrals count — pay out after 5 business days. <b>Program runs until 200 members</b> {(stats?.total ?? members.length) >= 200 ? <span className="text-red-600 font-semibold">— ENDED (200 reached)</span> : <span className="text-gray-600">(currently {stats?.total ?? members.length}/200)</span>}.</p>
                <input value={payoutDraft} onChange={e => setPayoutDraft(e.target.value)} placeholder={`${referralPayout}`} type="number" className="w-24 text-xs border border-[#dadce0] rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-orange-500" />
                <button onClick={savePayout} className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white hover:bg-black">Set payout</button>
              </div>
              <span className="text-sm font-semibold">Still owed: ${totalOwed}</span>
            </div>
            {referrers.length === 0 ? (
              <div className="bg-white border border-[#dadce0] rounded-xl p-6 text-sm text-gray-500">
                No referrals yet. This fills <b>automatically</b> — anyone who buys through the <b>$127 referral link</b> (square.link/u/jSF7J4zp) and types who referred them shows up here, and the referrer gets DM&apos;d that their $50 is coming.
              </div>
            ) : (
              <div className="bg-white border border-[#dadce0] rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-gray-500 bg-[#f8f9fa]"><tr className="border-b border-[#e8eaed]">
                    <th className="py-2.5 px-4 font-medium">Referrer</th><th className="px-3 font-medium">Tier / rate</th><th className="px-3 font-medium">Referred</th><th className="px-3 font-medium">Paid (cleared)</th><th className="px-3 font-medium">Cash owed</th><th className="px-3 font-medium">Paid out</th><th className="px-3 font-medium">Remaining</th><th className="px-3 font-medium">Record</th>
                  </tr></thead>
                  <tbody>
                    {referrers.map(r => (
                      <tr key={r.ref} className={`border-b border-[#f1f3f4] hover:bg-[#f8f9fa] ${r.settled ? "opacity-60" : ""}`}>
                        <td className="py-2.5 px-4 font-medium">{r.ref}</td>
                        <td className="px-3"><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${r.tier === 2 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>T{r.tier}</span> <span className="text-gray-500">${r.rate}/ref</span></td>
                        <td className="px-3">{r.count}</td>
                        <td className="px-3">{r.paid}</td>
                        <td className="px-3 font-semibold">${r.owed}{r.capped && <span className="ml-1 text-[10px] px-1 rounded bg-orange-100 text-orange-700">$500 cap</span>}</td>
                        <td className="px-3 text-gray-600">{r.tookCredit ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-semibold">$1,000 credit</span> : r.paidOut > 0 ? `$${r.paidOut}` : "—"}</td>
                        <td className="px-3 font-semibold">{r.settled ? <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700">✓ settled</span> : `$${r.remaining}`}</td>
                        <td className="px-3">
                          {!r.settled && r.remaining > 0 && (
                            <div className="flex gap-1 whitespace-nowrap">
                              <button onClick={() => markPaid(r.ref, r.remaining, "cash")} className="text-[11px] px-2 py-1 rounded bg-[#202124] text-white hover:bg-black">Paid ${r.remaining} cash</button>
                              <button onClick={() => markPaid(r.ref, r.creditOption, "credit")} title={`Log $${r.creditOption} store credit instead of cash`} className="text-[11px] px-2 py-1 rounded border border-purple-300 text-purple-700 hover:bg-purple-50">${r.creditOption} credit</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "resources" && (
          <div>
            <p className="text-gray-500 text-sm mb-4">Send-to-client resources. Open to preview, or copy the link to send a client (Discord, email, text). These are the things we hand clients by hand until the bot delivers them automatically — more get added here as we build them.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: "ROT July 2026 Offers", tag: "July Promo · Bo's 30th Birthday Drop", desc: "The full July offer sheet — membership, ServiceNow CSA, Security+ ($850), and the clearance birthday-drop pricing, plus the referral program. Client-facing — send it to a warm lead or pull it up on a call.", path: "/resources/rot-july-2026-offers.html" },
                { title: "ServiceNow CSA — Study Plan + PDI Setup", tag: "ServiceNow · Client Study Plan", desc: "The full CSA roadmap: free PDI setup, the exam domains, a 30/60/90-day plan with study hours, and exam-day tips. Send to any CSA client.", path: "/resources/rot-csa-study-plan.html" },
                { title: "Security+ — Study Plan", tag: "CompTIA · Client Study Plan", desc: "The Security+ (SY0-701) roadmap: the 5 domains with weights, a 30/60/90-day plan with study hours, acronym drills, and PBQ exam tips. Send to any Sec+ client.", path: "/resources/rot-secplus-study-plan.html" },
                { title: "AWS AI Practitioner — Study Plan", tag: "AWS · Client Study Plan", desc: "The AIF-C01 roadmap (founding members get this track): the 5 exam domains, a 30/60/90-day plan with study hours, the AWS service map, and what's proven to pass fast. Send to any AWS AI client.", path: "/resources/rot-aws-ai-study-plan.html" },
                { title: "FAQ — Onboarding, Billing, Add-ons, Referrals", tag: "General · Send to anyone", desc: "The member FAQ: getting in (auto-role), how the $27/$96 billing works, what's included vs paid add-ons (cert/clearance), studying/pace, and referrals. Send to any prospect or new member.", path: "/resources/rot-faq.html" },
                { title: "How Rich Off Tech Works — Founding Member Guide", tag: "Onboarding · Send to founding members", desc: "The full breakdown: the 3 places (Discord/site/AI tutors), how the Discord runs (auto-role, channels, Bo Tech, calls, job drops), how the quiz/study engine works (domains, 75-80% target, labs, 30/60/90 plan), and a first-week checklist.", path: "/resources/rot-how-it-works.html" },
                { title: "PB&J Challenge", tag: "Business Analyst · Requirements Lab", desc: "Interactive lab that teaches how a BA writes requirements. The client builds the steps, then runs it live with a coach (who plays the “machine”). No answer included — the lesson is them finding their own gaps.", path: "/labs/pbj-challenge.html" },
                { title: "ServiceNow CSA Study Guide", tag: "ServiceNow CSA · Client Study Plan", desc: "The full CSA path, mapped to our 8 quiz domains + free PDI (developer instance) setup. 30/60/90-day pace the client picks with their coach on the call — never longer. Send it right after the intro/intake.", path: "/labs/servicenow-csa-study-guide.html" },
                { title: "Transcribe a Call with Gemini", tag: "Coach Tool · Call notes + follow-ups", desc: "For any coach when Fireflies wasn't on the call. Ready-to-paste Gemini prompts that scope each call type (intake, coaching, interview prep, clearance) + consistent follow-up templates so every client gets the same Rich Off Tech voice.", path: "/labs/coach-call-transcription-gemini.html" },
              ].map(r => (
                <div key={r.path} className="bg-white border border-[#dadce0] rounded-xl p-4 flex flex-col">
                  <div className="text-[11px] uppercase tracking-wide text-orange-600 font-medium">{r.tag}</div>
                  <div className="font-semibold text-[15px] mt-0.5">{r.title}</div>
                  <p className="text-sm text-gray-600 mt-1 flex-1">{r.desc}</p>
                  <div className="flex gap-2 mt-3">
                    <a href={r.path} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-[#dadce0] bg-white hover:bg-gray-50">Open / preview</a>
                    <button onClick={(e) => { const url = `${window.location.origin}${r.path}`; navigator.clipboard?.writeText(url); const b = e.currentTarget; const t = b.textContent; b.textContent = "Copied link!"; setTimeout(() => { b.textContent = t; }, 1500); }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#202124] text-white font-medium hover:bg-black">Copy link to send</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
