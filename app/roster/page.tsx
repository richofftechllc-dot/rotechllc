"use client";
import { useState } from "react";

const members = [
  { name: "Randy Allen", role: "Sr. ServiceNow Dev", certs: ["Sec+", "CSA", "AWS AI"], clearance: "TS/SCI FSP", location: "DMV" },
  { name: "Malik Kelley", role: "IT Specialist", certs: ["Sec+"], clearance: "Secret", location: "VA" },
  { name: "Daquan Knight", role: "ServiceNow CSA", certs: ["Sec+", "CSA"], clearance: "Secret", location: "DC" },
  { name: "Tyler", role: "Cyber Analyst", certs: ["Sec+", "CSA", "AWS AI"], clearance: "TS/SCI", location: "MD" },
  { name: "Detron Phillips", role: "Cloud Engineer", certs: ["AWS AI", "CSA"], clearance: "Public Trust", location: "DC" },
  { name: "Cue B", role: "SOC Analyst", certs: ["Sec+"], clearance: "Eligible", location: "VA" },
];

const filters = ["ALL", "TS/SCI", "TS", "SECRET", "PUBLIC TRUST", "NONE / ELIGIBLE"];

export default function Roster() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = members.filter(m => {
    if (filter !== "ALL") {
      if (filter === "TS/SCI" && !m.clearance.includes("TS/SCI")) return false;
      if (filter === "TS" && (m.clearance === "Secret" || m.clearance === "Public Trust" || m.clearance === "Eligible" || m.clearance.includes("TS/SCI"))) return false;
      if (filter === "SECRET" && m.clearance !== "Secret") return false;
      if (filter === "PUBLIC TRUST" && m.clearance !== "Public Trust") return false;
      if (filter === "NONE / ELIGIBLE" && m.clearance !== "Eligible") return false;
    }
    if (search && !`${m.name} ${m.role} ${m.certs.join(" ")} ${m.location}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cleared = members.filter(m => m.clearance !== "Eligible").length;
  const totalCerts = members.reduce((sum, m) => sum + m.certs.length, 0);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-8">
        The bridge<br />
        between <span className="text-green-500">my people</span><br />
        & the <span className="text-yellow-500">corporate world</span>
      </h1>
      <p className="text-gray-400 max-w-3xl mb-16">
        A live roster of <b>Rich Off Tech LLC</b> community members — cleared professionals, certified operators, and rising talent across cyber, cloud, ServiceNow, and federal IT. Hiring managers and recruiters: this is your shortlist.
      </p>

      <div className="grid grid-cols-3 gap-8 mb-12 text-center">
        <div><div className="text-5xl font-black text-green-500">{members.length}</div><div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Members</div></div>
        <div><div className="text-5xl font-black text-green-500">{cleared}</div><div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Cleared</div></div>
        <div><div className="text-5xl font-black text-yellow-500">{totalCerts}</div><div className="text-gray-500 text-xs uppercase tracking-wider mt-1">Certs Held</div></div>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, role, cert, location..."
        className="w-full bg-zinc-900 border border-white/10 rounded-full px-6 py-3 mb-6 outline-none focus:border-green-500" />

      <div className="flex flex-wrap gap-3 mb-12">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-bold ${filter === f ? "bg-green-500 text-black" : "border border-white/20 text-gray-400 hover:bg-white/5"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((m, i) => (
          <div key={i} className="bg-zinc-900 border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold">{m.name}</h3>
              <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded">{m.clearance}</span>
            </div>
            <div className="text-gray-400 text-sm mb-3">{m.role} · {m.location}</div>
            <div className="flex flex-wrap gap-2">
              {m.certs.map(c => <span key={c} className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">{c}</span>)}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center text-gray-500 py-12">No members match your filters.</div>}

      <div className="text-gray-500 text-sm text-center mt-16 italic">
        Full roster moving to Firebase soon — this is a preview. Join the Discord for live access.
      </div>
    </main>
  );
}
