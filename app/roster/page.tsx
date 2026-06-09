"use client";
import { useState, useEffect } from "react";

type Member = {
  name: string;
  role: string;
  location: string;
  clearance: string;
  certs: string[];
  linkedin: string;
  discord: string;
  status: string;
  years: string;
};

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbY0W4ln8XRMlqCmS83cvTqA_F-nLlplfd6xC7Fow6XsQrG3URbd48j_H0qCNH4NU4/exec";

const filters = ["ALL", "TS/SCI", "TS", "Secret", "Public Trust", "None"];

// Members type URLs inconsistently — "linkedin.com/in/foo", "/in/foo", "@foo", etc.
// Normalize to a fully-qualified https URL so the anchor doesn't become a relative path.
function safeUrl(u: string): string {
  if (!u) return "";
  const v = u.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (v.startsWith("/in/")) return "https://www.linkedin.com" + v;
  if (v.startsWith("in/")) return "https://www.linkedin.com/" + v;
  if (v.startsWith("linkedin.com")) return "https://www." + v.replace(/^www\./, "");
  if (v.startsWith("www.linkedin.com")) return "https://" + v;
  if (v.startsWith("@")) return "https://www.linkedin.com/in/" + v.slice(1);
  return "https://" + v;
}

export default function Roster() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(APPS_SCRIPT_URL + "?_ts=" + Date.now())
      .then(r => r.json())
      .then(data => {
        const rows = data.rows || data || [];
        if (!Array.isArray(rows) || rows.length < 2) { setLoading(false); return; }
        const headers = rows[0].map((h: string) => String(h).trim().toLowerCase());
        const idx = (n: string) => headers.indexOf(n);
        const parsed: Member[] = rows.slice(1).map((r: any[]) => ({
          name: String(r[idx("name")] || ""),
          role: String(r[idx("role")] || ""),
          location: String(r[idx("location")] || ""),
          clearance: String(r[idx("clearance")] || ""),
          certs: String(r[idx("certifications")] || r[idx("certs")] || "").split(/[,;|]/).map(c => c.trim()).filter(Boolean),
          linkedin: String(r[idx("linkedin")] || ""),
          discord: String(r[idx("discord")] || ""),
          status: String(r[idx("status")] || ""),
          years: String(r[idx("years")] || ""),
        })).filter((m: Member) => m.name);
        setMembers(parsed);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const matchesFilter = (m: Member) => {
    if (filter === "ALL") return true;
    if (filter === "TS/SCI") return m.clearance.includes("TS/SCI");
    if (filter === "TS") return m.clearance === "TS";
    if (filter === "Secret") return m.clearance === "Secret";
    if (filter === "Public Trust") return m.clearance.includes("Public Trust");
    if (filter === "None") return m.clearance.includes("None") || !m.clearance;
    return true;
  };

  const matchesSearch = (m: Member) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return [m.name, m.role, m.location, m.clearance, m.certs.join(" "), m.discord, m.status]
      .filter(Boolean).some(v => v.toLowerCase().includes(t));
  };

  const filtered = members.filter(matchesFilter).filter(matchesSearch);
  const cleared = members.filter(m => m.clearance && !m.clearance.includes("None")).length;
  const totalCerts = members.reduce((acc, m) => acc + m.certs.length, 0);

  const exportCSV = () => {
    const headers = ["name", "role", "location", "clearance", "certs", "linkedin", "discord", "status", "years"];
    const rows = filtered.map(m => headers.map(h => {
      const v = h === "certs" ? m.certs.join(";") : (m as any)[h];
      return `"${String(v || "").replace(/"/g, '""')}"`;
    }).join(","));
    const csv = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rotech_roster_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-8">
        The bridge<br />
        between <span className="text-green-500">my people</span><br />
        & the <span className="text-yellow-500">corporate world</span>
      </h1>
      <p className="text-gray-400 max-w-3xl mb-8">
        A live roster of <b>Rich Off Tech LLC</b> community members — cleared professionals, certified operators, and rising talent across cyber, cloud, ServiceNow, and federal IT. Hiring managers and recruiters: this is your shortlist.
      </p>

      <div className="bg-gradient-to-br from-orange-500/10 via-zinc-950 to-zinc-950 border border-orange-500/30 rounded-2xl p-6 mb-12">
        <div className="text-orange-500 font-bold tracking-widest text-xs mb-3">WHY THIS EXISTS</div>
        <p className="text-gray-300 leading-relaxed mb-3">
          When federal DEI programs got cancelled, a generation of cleared talent got left in the cold. This roster is the alternative — a pipeline that puts people who look like me in the door, on merit, no quotas. All races, all genders, one rule: come ready to learn.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Browse the full community freely — no login required to see who&apos;s here. To get added, request CVs, or update your own row, you need a member code.{" "}
          <a href="https://discord.gg/dtcYf8PTNa" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-bold">Join the Discord</a> to get yours.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-10 text-center">
        <div><div className="text-3xl sm:text-5xl font-black text-green-500">{members.length}</div><div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Members</div></div>
        <div><div className="text-3xl sm:text-5xl font-black text-green-500">{cleared}</div><div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Cleared</div></div>
        <div><div className="text-3xl sm:text-5xl font-black text-yellow-500">{totalCerts}</div><div className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Certs Held</div></div>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, role, cert, location..." className="flex-1 min-w-0 sm:min-w-[260px] bg-zinc-900 border border-white/10 rounded-full px-5 sm:px-6 py-3 outline-none focus:border-green-500" />
        <button onClick={exportCSV} className="px-4 sm:px-5 py-3 border border-yellow-500 text-yellow-500 rounded-full font-bold hover:bg-yellow-500/10 text-sm sm:text-base whitespace-nowrap">⇩ CSV</button>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-bold ${filter === f ? "bg-green-500 text-black" : "border border-white/20 text-gray-400 hover:bg-white/5"}`}>
            {f}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-gray-500 py-12">Loading members...</div>}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((m, i) => {
            const verified = m.status && /verified|founding|alumni/i.test(m.status);
            return (
              <div key={i} className={`bg-zinc-900 border rounded-xl p-6 transition ${verified ? "border-green-500/50" : "border-white/10 hover:border-green-500/30"}`}>
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div>
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    {verified && <span className="inline-block text-[10px] px-2 py-0.5 bg-green-500 text-black rounded font-bold tracking-wider mt-1">{m.status.toUpperCase()}</span>}
                  </div>
                  {m.clearance && <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded whitespace-nowrap">{m.clearance}</span>}
                </div>
                <div className="text-gray-400 text-sm mb-3">{m.role}{m.location && ` · ${m.location}`}{m.years && ` · ${m.years} yrs`}</div>
                {m.certs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {m.certs.map(c => <span key={c} className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">{c}</span>)}
                  </div>
                )}
                <div className="flex gap-3 text-xs text-gray-500">
                  {safeUrl(m.linkedin) && <a href={safeUrl(m.linkedin)} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400 font-bold">LinkedIn ↗</a>}
                  {m.discord && <span>@{m.discord}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && <div className="text-center text-gray-500 py-12">No members match your filters.</div>}
    </main>
  );
}
