"use client";
import { useEffect, useState, useCallback } from "react";

type Member = {
  email: string; name: string; discordTag: string; discordId: string;
  tier: string; status: string; paymentStatus: string; invoiced: boolean;
  tracks: string[]; quizCode: string; accessEndDate: string; rolesAssigned: boolean;
  assignedTo: string; notes: string;
};
type Note = { by: string; text: string; at: string };
type Followup = {
  id: string; title: string; memberEmail?: string; source?: string;
  status: "open" | "done"; assignedTo?: string; notes?: Note[]; createdAt?: string; createdBy?: string;
};

const STATUS_COLOR: Record<string, string> = {
  late: "text-red-400 border-red-500/40 bg-red-500/10",
  active: "text-green-400 border-green-500/40 bg-green-500/10",
  comp: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  expired: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  canceled: "text-gray-400 border-white/15 bg-white/5",
};

export default function AdminCRM() {
  const [authed, setAuthed] = useState<"loading" | "yes" | "no">("loading");
  const [tab, setTab] = useState<"followups" | "members">("followups");
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<{ total: number; comped: number } | null>(null);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [q, setQ] = useState("");
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

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

  useEffect(() => { loadMembers(); loadFollowups(); }, [loadMembers, loadFollowups]);

  async function act(body: Record<string, unknown>) {
    await fetch("/api/admin/followups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    loadFollowups();
  }

  if (authed === "loading") return <main className="min-h-screen flex items-center justify-center text-gray-400">Loading CRM…</main>;
  if (authed === "no") return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-black">ROT <span className="text-orange-500">CRM</span></h1>
      <p className="text-gray-400 max-w-sm">Coaches only. Sign in with the Discord account on the admin list.</p>
      <a href="/api/auth/discord" className="px-6 py-3 font-bold rounded-lg text-white" style={{ backgroundColor: "#5865F2" }}>Sign in with Discord</a>
      <p className="text-gray-600 text-xs">Not seeing access? Ask Randy to add your Discord ID to <code>ADMIN_DISCORD_IDS</code>.</p>
    </main>
  );

  const openFollowups = followups.filter(f => f.status === "open");
  const doneFollowups = followups.filter(f => f.status === "done");
  const filteredMembers = members.filter(m =>
    !q || [m.name, m.email, m.discordTag, m.tier, m.tracks.join(",")].join(" ").toLowerCase().includes(q.toLowerCase()));
  const lateCount = members.filter(m => m.paymentStatus === "late").length;

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-4xl font-black">ROT <span className="text-orange-500">CRM</span></h1>
        <div className="flex gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded bg-zinc-900 border border-white/10">{stats?.total ?? members.length} members</span>
          <span className="px-3 py-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-300">{lateCount} late</span>
          <span className="px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">{stats?.comped ?? 0} comped</span>
          <span className="px-3 py-1.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300">{openFollowups.length} open follow-ups</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("followups")} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === "followups" ? "bg-orange-500 text-black" : "bg-zinc-900 text-gray-400 border border-white/10"}`}>Follow-ups</button>
        <button onClick={() => setTab("members")} className={`px-4 py-2 rounded-lg font-bold text-sm ${tab === "members" ? "bg-orange-500 text-black" : "bg-zinc-900 text-gray-400 border border-white/10"}`}>Members</button>
      </div>

      {tab === "followups" && (
        <div className="space-y-6">
          <button onClick={() => act({ action: "create", title: "New follow-up", source: "manual" })}
            className="text-xs px-3 py-2 rounded border border-orange-500/40 text-orange-300 hover:bg-orange-500/10">+ Add follow-up</button>

          {openFollowups.length === 0 && <p className="text-gray-500 text-sm">No open follow-ups. Completed calls drop in here automatically.</p>}
          {openFollowups.map(f => (
            <div key={f.id} className="bg-zinc-900 border border-white/10 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-bold">{f.title}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    {f.memberEmail ? f.memberEmail + " · " : ""}{f.source || "manual"}{f.createdAt ? " · " + new Date(f.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono px-2 py-1 rounded border ${f.assignedTo ? "border-green-500/40 text-green-300 bg-green-500/10" : "border-white/15 text-gray-400"}`}>
                    {f.assignedTo ? `👤 ${f.assignedTo}` : "unassigned"}
                  </span>
                  {!f.assignedTo && <button onClick={() => act({ action: "assign", id: f.id })} className="text-xs px-2 py-1 rounded bg-zinc-800 border border-white/10 hover:border-orange-500/40">Assign to me</button>}
                  <button onClick={() => act({ action: "status", id: f.id, status: "done" })} className="text-xs px-2 py-1 rounded bg-green-600/20 border border-green-500/40 text-green-300">✓ Done</button>
                </div>
              </div>
              {(f.notes || []).length > 0 && (
                <div className="mt-3 space-y-1">
                  {(f.notes || []).map((n, i) => (
                    <div key={i} className="text-xs text-gray-300 bg-zinc-800/60 rounded px-2 py-1"><span className="text-gray-500">{n.by}:</span> {n.text}</div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <input value={noteDraft[f.id] || ""} onChange={e => setNoteDraft(s => ({ ...s, [f.id]: e.target.value }))}
                  placeholder="Add a note…" className="flex-1 bg-zinc-800 border border-white/10 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-orange-500" />
                <button onClick={() => { if ((noteDraft[f.id] || "").trim()) { act({ action: "note", id: f.id, note: noteDraft[f.id] }); setNoteDraft(s => ({ ...s, [f.id]: "" })); } }}
                  className="text-sm px-3 rounded bg-orange-500 text-black font-bold">Note</button>
              </div>
            </div>
          ))}

          {doneFollowups.length > 0 && (
            <details className="text-sm">
              <summary className="text-gray-500 cursor-pointer">✓ {doneFollowups.length} completed</summary>
              <div className="mt-2 space-y-1">
                {doneFollowups.map(f => (
                  <div key={f.id} className="text-xs text-gray-500 flex items-center justify-between bg-zinc-900/50 rounded px-3 py-1.5">
                    <span className="line-through">{f.title}</span>
                    <button onClick={() => act({ action: "status", id: f.id, status: "open" })} className="text-orange-400 hover:underline">reopen</button>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {tab === "members" && (
        <div>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email, tier, track…"
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm mb-4 focus:outline-none focus:border-orange-500" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500 font-mono uppercase">
                <tr className="border-b border-white/10">
                  <th className="py-2 pr-4">Member</th><th className="pr-4">Tier</th><th className="pr-4">Tracks</th>
                  <th className="pr-4">Payment</th><th className="pr-4">Access ends</th><th className="pr-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => (
                  <tr key={m.email} className="border-b border-white/5 hover:bg-white/[.02]">
                    <td className="py-2.5 pr-4">
                      <div className="font-bold">{m.name || m.email}</div>
                      <div className="text-xs text-gray-500">{m.email}{m.discordTag ? ` · ${m.discordTag}` : ""}</div>
                    </td>
                    <td className="pr-4 text-gray-300">{m.tier || "—"}</td>
                    <td className="pr-4">{m.tracks.length ? m.tracks.map(t => <span key={t} className="inline-block text-[10px] font-mono mr-1 px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10">{t}</span>) : <span className="text-gray-600">—</span>}</td>
                    <td className="pr-4">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded border ${STATUS_COLOR[m.paymentStatus] || "text-gray-400 border-white/15"}`}>{m.paymentStatus}</span>
                      {m.invoiced && <span className="ml-1 text-[10px] text-gray-500">🧾 invoiced</span>}
                    </td>
                    <td className="pr-4 text-gray-400 text-xs font-mono">{m.accessEndDate ? m.accessEndDate.slice(0, 10) : "—"}</td>
                    <td className="pr-4">{m.rolesAssigned ? "✅" : "⚠️"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMembers.length === 0 && <p className="text-gray-500 text-sm py-6 text-center">No members match.</p>}
          </div>
          <p className="text-gray-600 text-xs mt-4">💲 Prices are hidden by design — you see status (late / active / comp), invoices, and discounts, not dollar amounts.</p>
        </div>
      )}
    </main>
  );
}
