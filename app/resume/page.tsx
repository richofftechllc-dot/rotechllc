"use client";
import { useEffect, useState } from "react";
import { renderMarkdownToHtml, PRINT_CSS } from "@/lib/resume/format-spec";
import type {
  StructuredResume,
  TargetJob,
  GeneratedResume,
  ExperienceEntry,
  EducationEntry,
  SkillsGroup,
  CertificationEntry,
  ClearanceEntry,
} from "@/lib/resume/types";

const EMPTY_RESUME: StructuredResume = {
  contact: { name: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  clearances: [],
};

const LS_RESUME = "rot.resume.v1";
const LS_HISTORY = "rot.resume.history.v1";

function loadResume(): StructuredResume {
  if (typeof window === "undefined") return EMPTY_RESUME;
  try {
    const raw = localStorage.getItem(LS_RESUME);
    return raw ? (JSON.parse(raw) as StructuredResume) : EMPTY_RESUME;
  } catch { return EMPTY_RESUME; }
}
function saveResume(r: StructuredResume) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_RESUME, JSON.stringify(r));
}
function loadHistory(): GeneratedResume[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_HISTORY);
    return raw ? (JSON.parse(raw) as GeneratedResume[]) : [];
  } catch { return []; }
}
function saveHistory(h: GeneratedResume[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_HISTORY, JSON.stringify(h.slice(0, 25)));
}

type Tab = "resume" | "tailor" | "history";

type Me = { ok: true; code: string | null; name: string; track: string | null } | { ok: false };
type RosterMember = { name: string; role: string; location: string; clearance: string; certs: string[]; linkedin: string; discord: string; status: string; years: string };

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwbY0W4ln8XRMlqCmS83cvTqA_F-nLlplfd6xC7Fow6XsQrG3URbd48j_H0qCNH4NU4/exec";

export default function ResumePage() {
  const [tab, setTab] = useState<Tab>("resume");
  const [resume, setResume] = useState<StructuredResume>(EMPTY_RESUME);
  const [history, setHistory] = useState<GeneratedResume[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [rosterPulling, setRosterPulling] = useState(false);
  const [rosterMsg, setRosterMsg] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<"idle" | "loading" | "loaded" | "saving" | "saved" | "no_account" | "error">("idle");
  const [cloudLoadedAt, setCloudLoadedAt] = useState<string | null>(null);

  useEffect(() => {
    setResume(loadResume());
    setHistory(loadHistory());
    setHydrated(true);
    fetch("/api/me").then(r => r.json()).then(setMe).catch(() => setMe({ ok: false }));
  }, []);

  // When logged in, try to load saved resume from Firestore (via Zapier).
  // If cloud copy is newer than localStorage, it overrides; otherwise localStorage wins.
  useEffect(() => {
    if (!hydrated || !me || !me.ok || !me.code) return;
    setCloudStatus("loading");
    fetch("/api/resume/load", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: me.code }),
    })
      .then(r => r.json())
      .then(data => {
        if (!data.ok) { setCloudStatus("error"); return; }
        if (data.found && data.resume) {
          setResume(data.resume);
          setCloudLoadedAt(data.updated_at || null);
          setCloudStatus("loaded");
        } else {
          setCloudStatus("no_account");
        }
      })
      .catch(() => setCloudStatus("error"));
  }, [hydrated, me]);

  // Persist locally on every change; debounce-save to cloud when logged in.
  useEffect(() => { if (hydrated) saveResume(resume); }, [resume, hydrated]);
  useEffect(() => {
    if (!hydrated || !me || !me.ok || !me.code) return;
    if (cloudStatus === "loading") return;
    const code = me.code;
    const name = me.name;
    setCloudStatus("saving");
    const t = setTimeout(() => {
      fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, resume }),
      })
        .then(r => r.json())
        .then(data => setCloudStatus(data.persisted ? "saved" : "no_account"))
        .catch(() => setCloudStatus("error"));
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume, hydrated, me]);

  async function pullFromRoster() {
    if (!me || !me.ok) return;
    setRosterPulling(true);
    setRosterMsg(null);
    try {
      const r = await fetch(APPS_SCRIPT_URL + "?_ts=" + Date.now());
      const data = await r.json();
      const rows = data.rows || data || [];
      if (!Array.isArray(rows) || rows.length < 2) { setRosterMsg("Roster returned no rows."); return; }
      const headers = rows[0].map((h: string) => String(h).trim().toLowerCase());
      const idx = (n: string) => headers.indexOf(n);
      const meName = (me.name || "").toLowerCase().trim();
      const members: RosterMember[] = rows.slice(1).map((r: string[]) => ({
        name: String(r[idx("name")] || ""),
        role: String(r[idx("role")] || ""),
        location: String(r[idx("location")] || ""),
        clearance: String(r[idx("clearance")] || ""),
        certs: String(r[idx("certifications")] || r[idx("certs")] || "").split(/[,;|]/).map(c => c.trim()).filter(Boolean),
        linkedin: String(r[idx("linkedin")] || ""),
        discord: String(r[idx("discord")] || ""),
        status: String(r[idx("status")] || ""),
        years: String(r[idx("years")] || ""),
      }));
      const row = members.find(m => m.name.toLowerCase().trim() === meName) || members.find(m => m.name.toLowerCase().includes(meName));
      if (!row) { setRosterMsg(`Couldn't find "${me.name}" on the roster. Edit fields manually.`); return; }

      setResume(r => ({
        ...r,
        contact: {
          ...r.contact,
          name: r.contact.name || row.name,
          city: r.contact.city || row.location,
          links: { ...r.contact.links, linkedin: r.contact.links?.linkedin || row.linkedin },
        },
        summary: r.summary || (row.role ? `${row.role}${row.years ? ` · ${row.years} years experience` : ""}${row.clearance ? ` · ${row.clearance} cleared` : ""}.` : r.summary),
        certifications: r.certifications.length > 0
          ? r.certifications
          : row.certs.map(c => ({ name: c })),
        clearances: r.clearances.length > 0
          ? r.clearances
          : (row.clearance ? [{ level: row.clearance, status: "Active" }] : []),
        experience: r.experience.length > 0
          ? r.experience
          : (row.role ? [{ title: row.role, company: "", location: row.location, start: "", end: "Present", bullets: [] }] : []),
      }));
      setRosterMsg(`Pulled ${row.name}'s row. Existing fields preserved; blanks filled from roster.`);
    } catch (e) {
      setRosterMsg("Roster fetch failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setRosterPulling(false);
    }
  }

  const [job, setJob] = useState<TargetJob>({ title: "", description: "" });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<GeneratedResume | null>(null);

  async function generate() {
    setError(null);
    if (!resume.contact.name.trim()) { setError("Add your name first (Resume tab)."); setTab("resume"); return; }
    if (!job.title.trim() || !job.description.trim()) { setError("Title and description required."); return; }
    setGenerating(true);
    try {
      const r = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });
      const data = await r.json();
      if (!data.ok) { setError(data.message || data.error || "Generation failed"); return; }
      const gen: GeneratedResume = {
        generated_at: data.generated_at,
        target_job: job,
        content_markdown: data.content_markdown,
        flagged_unverifiable: data.flagged_unverifiable || [],
      };
      const next = [gen, ...history];
      setHistory(next); saveHistory(next);
      setActive(gen);
      setTab("history");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGenerating(false);
    }
  }

  function deleteGeneration(idx: number) {
    const next = history.filter((_, i) => i !== idx);
    setHistory(next); saveHistory(next);
    if (active && history[idx] === active) setActive(null);
  }

  // Auth gate — Resume Builder is members-only
  if (me === null) {
    return <main className="max-w-2xl mx-auto px-6 py-24 text-center"><h1 className="text-4xl font-black">Loading…</h1></main>;
  }
  if (!me.ok) {
    if (typeof window !== "undefined") window.location.href = "/login?next=/resume";
    return null;
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-orange-500 font-bold tracking-widest text-sm mb-3">ROT RESUME BUILDER</div>
      <h1 className="text-4xl md:text-5xl font-black mb-4">Tailor your resume.</h1>
      <p className="text-gray-400 max-w-2xl mb-8">
        Fill the structured form once. Paste a target job description. Bo Tech generates an ATS-safe Rich Off Tech-format resume — using only the facts you provided.
        Until your account is wired up, drafts stay on this device.
      </p>

      {me?.ok && (
        <div className="bg-gradient-to-br from-orange-500/10 to-zinc-950 border border-orange-500/30 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-orange-400 font-bold text-sm">Signed in as {me.name}{me.code ? <span className="text-gray-500 font-mono text-xs ml-2">{me.code}</span> : null}</div>
            <div className="text-gray-400 text-xs mt-0.5">{rosterMsg || "Pull your roster row to prefill the form. Existing entries won't be overwritten."}</div>
            <div className="text-[10px] mt-1 font-mono">
              {cloudStatus === "loading" && <span className="text-gray-500">↻ Loading saved version…</span>}
              {cloudStatus === "loaded" && <span className="text-green-500">✓ Saved version loaded{cloudLoadedAt ? ` (${new Date(cloudLoadedAt).toLocaleDateString()})` : ""}</span>}
              {cloudStatus === "saving" && <span className="text-gray-500">↻ Syncing…</span>}
              {cloudStatus === "saved" && <span className="text-green-500">✓ Synced to your account</span>}
              {cloudStatus === "no_account" && <span className="text-gray-600">Local-only · Cloud sync not configured yet</span>}
              {cloudStatus === "error" && <span className="text-yellow-500">⚠ Sync error — still saved locally</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={pullFromRoster}
            disabled={rosterPulling}
            className="px-4 py-2 bg-orange-500 text-black font-bold rounded-lg text-sm hover:opacity-90 disabled:opacity-50"
          >
            {rosterPulling ? "Pulling…" : "↓ Pull from roster"}
          </button>
        </div>
      )}

      <div className="flex gap-1 mb-8 border-b border-white/10">
        {(["resume", "tailor", "history"] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition ${
              tab === t ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {t === "history" ? `History (${history.length})` : t}
          </button>
        ))}
      </div>

      {tab === "resume" && <ResumeForm resume={resume} onChange={setResume} />}

      {tab === "tailor" && (
        <TailorForm job={job} setJob={setJob} onGenerate={generate} generating={generating} error={error} resumeReady={!!resume.contact.name.trim()} />
      )}

      {tab === "history" && (
        <HistoryView history={history} active={active} setActive={setActive} onDelete={deleteGeneration} />
      )}
    </main>
  );
}

/* ===================== FORM ===================== */

function ResumeForm({ resume, onChange }: { resume: StructuredResume; onChange: (r: StructuredResume) => void }) {
  return (
    <div className="space-y-10">
      <FormBlock title="Contact">
        <div className="grid md:grid-cols-2 gap-3">
          <Input label="Full name *" value={resume.contact.name} onChange={v => onChange({ ...resume, contact: { ...resume.contact, name: v } })} />
          <Input label="Email" value={resume.contact.email || ""} onChange={v => onChange({ ...resume, contact: { ...resume.contact, email: v } })} />
          <Input label="Phone" value={resume.contact.phone || ""} onChange={v => onChange({ ...resume, contact: { ...resume.contact, phone: v } })} />
          <Input label="City" value={resume.contact.city || ""} onChange={v => onChange({ ...resume, contact: { ...resume.contact, city: v } })} />
          <Input label="LinkedIn URL" value={resume.contact.links?.linkedin || ""} onChange={v => onChange({ ...resume, contact: { ...resume.contact, links: { ...resume.contact.links, linkedin: v } } })} />
          <Input label="GitHub URL" value={resume.contact.links?.github || ""} onChange={v => onChange({ ...resume, contact: { ...resume.contact, links: { ...resume.contact.links, github: v } } })} />
        </div>
      </FormBlock>

      <FormBlock title="Summary" subtitle="A few sentences about who you are professionally. Bo Tech may rephrase this for the target role.">
        <Textarea value={resume.summary} onChange={v => onChange({ ...resume, summary: v })} rows={4} placeholder="e.g., Cleared cyber engineer with 4+ years in federal IT..." />
      </FormBlock>

      <ListBlock<ExperienceEntry>
        title="Experience"
        items={resume.experience}
        onChange={items => onChange({ ...resume, experience: items })}
        newEntry={() => ({ title: "", company: "", location: "", start: "", end: "", bullets: [] })}
        renderItem={(e, set) => (
          <div className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Job title *" value={e.title} onChange={v => set({ ...e, title: v })} />
              <Input label="Company *" value={e.company} onChange={v => set({ ...e, company: v })} />
              <Input label="Location" value={e.location || ""} onChange={v => set({ ...e, location: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start (e.g. Jan 2022)" value={e.start} onChange={v => set({ ...e, start: v })} />
                <Input label="End or Present" value={e.end} onChange={v => set({ ...e, end: v })} />
              </div>
            </div>
            <BulletEditor bullets={e.bullets} onChange={b => set({ ...e, bullets: b })} />
          </div>
        )}
      />

      <ListBlock<SkillsGroup>
        title="Skills"
        items={resume.skills}
        onChange={items => onChange({ ...resume, skills: items })}
        newEntry={() => ({ category: "", items: [] })}
        renderItem={(g, set) => (
          <div className="space-y-3">
            <Input label="Category (e.g. Languages, Cloud, AI/ML)" value={g.category} onChange={v => set({ ...g, category: v })} />
            <Textarea label="Items (comma-separated)" value={g.items.join(", ")} onChange={v => set({ ...g, items: v.split(",").map(s => s.trim()).filter(Boolean) })} rows={2} />
          </div>
        )}
      />

      <ListBlock<CertificationEntry>
        title="Certifications"
        items={resume.certifications}
        onChange={items => onChange({ ...resume, certifications: items })}
        newEntry={() => ({ name: "" })}
        renderItem={(c, set) => (
          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Name *" value={c.name} onChange={v => set({ ...c, name: v })} />
            <Input label="Issuer" value={c.issuer || ""} onChange={v => set({ ...c, issuer: v })} />
            <Input label="Date earned" value={c.date || ""} onChange={v => set({ ...c, date: v })} />
            <Input label="Credential ID" value={c.id || ""} onChange={v => set({ ...c, id: v })} />
          </div>
        )}
      />

      <ListBlock<ClearanceEntry>
        title="Clearances"
        items={resume.clearances}
        onChange={items => onChange({ ...resume, clearances: items })}
        newEntry={() => ({ level: "", status: "Active" })}
        renderItem={(c, set) => (
          <div className="grid md:grid-cols-2 gap-3">
            <Input label="Level *" value={c.level} onChange={v => set({ ...c, level: v })} placeholder="TS/SCI w/ Full Scope Poly" />
            <Input label="Status" value={c.status} onChange={v => set({ ...c, status: v })} placeholder="Active / Eligible / Expired" />
            <Input label="Type" value={c.type || ""} onChange={v => set({ ...c, type: v })} placeholder="DoD, IC, ..." />
            <Input label="Granted date" value={c.granted_date || ""} onChange={v => set({ ...c, granted_date: v })} />
          </div>
        )}
      />

      <ListBlock<EducationEntry>
        title="Education"
        items={resume.education}
        onChange={items => onChange({ ...resume, education: items })}
        newEntry={() => ({ school: "" })}
        renderItem={(e, set) => (
          <div className="grid md:grid-cols-2 gap-3">
            <Input label="School *" value={e.school} onChange={v => set({ ...e, school: v })} />
            <Input label="Degree" value={e.degree || ""} onChange={v => set({ ...e, degree: v })} />
            <Input label="Field" value={e.field || ""} onChange={v => set({ ...e, field: v })} />
            <Input label="Honors" value={e.honors || ""} onChange={v => set({ ...e, honors: v })} />
            <Input label="Start" value={e.start || ""} onChange={v => set({ ...e, start: v })} />
            <Input label="End" value={e.end || ""} onChange={v => set({ ...e, end: v })} />
          </div>
        )}
      />

      <p className="text-gray-600 text-xs">Autosaved to this device.</p>
    </div>
  );
}

/* ===================== TAILOR ===================== */

function TailorForm({ job, setJob, onGenerate, generating, error, resumeReady }: {
  job: TargetJob;
  setJob: (j: TargetJob) => void;
  onGenerate: () => void;
  generating: boolean;
  error: string | null;
  resumeReady: boolean;
}) {
  return (
    <div className="space-y-6">
      <FormBlock title="Target job">
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <Input label="Job title *" value={job.title} onChange={v => setJob({ ...job, title: v })} />
          <Input label="Company" value={job.company || ""} onChange={v => setJob({ ...job, company: v })} />
        </div>
        <Textarea label="Paste the full job description *" value={job.description} onChange={v => setJob({ ...job, description: v })} rows={12} placeholder="Paste the entire job posting here..." />
      </FormBlock>

      {!resumeReady && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-300 text-sm">
          Add your name and details on the <b>Resume</b> tab first.
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">{error}</div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating || !resumeReady}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generating ? "Bo Tech is tailoring…" : "Generate with Bo Tech"}
        </button>
        <span className="text-gray-500 text-xs">Sonnet 4.6 · temp 0.2 · 5/day per IP</span>
      </div>
    </div>
  );
}

/* ===================== HISTORY ===================== */

function HistoryView({ history, active, setActive, onDelete }: {
  history: GeneratedResume[];
  active: GeneratedResume | null;
  setActive: (g: GeneratedResume | null) => void;
  onDelete: (idx: number) => void;
}) {
  if (history.length === 0) {
    return <p className="text-gray-500">No generations yet. Build a resume on the <b>Resume</b> tab, then paste a job on the <b>Tailor</b> tab.</p>;
  }
  return (
    <div className="grid lg:grid-cols-[1fr_2fr] gap-6 resume-no-print">
      <div className="space-y-2">
        {history.map((g, i) => {
          const isActive = active === g;
          return (
            <div
              key={i}
              className={`border rounded-lg p-4 cursor-pointer transition ${isActive ? "border-orange-500 bg-orange-500/5" : "border-white/10 hover:border-white/30"}`}
              onClick={() => setActive(g)}
            >
              <div className="font-bold text-sm">{g.target_job.title}</div>
              {g.target_job.company && <div className="text-xs text-gray-400 mt-0.5">{g.target_job.company}</div>}
              <div className="text-xs text-gray-500 mt-2">{new Date(g.generated_at).toLocaleString()}</div>
              {g.flagged_unverifiable.length > 0 && (
                <div className="text-xs text-yellow-400 mt-1">⚠ {g.flagged_unverifiable.length} flagged claim{g.flagged_unverifiable.length > 1 ? "s" : ""}</div>
              )}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onDelete(i); }}
                className="text-xs text-gray-600 hover:text-red-400 mt-2"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      <div>
        {!active && <p className="text-gray-500 text-sm">Select a generation to preview.</p>}
        {active && <PrintView gen={active} />}
      </div>
    </div>
  );
}

function PrintView({ gen }: { gen: GeneratedResume }) {
  const html = renderMarkdownToHtml(gen.content_markdown);
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 resume-no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-5 py-2.5 bg-orange-500 text-black font-bold rounded-lg hover:opacity-90 text-sm"
        >
          🖨 Print / Save as PDF
        </button>
        <span className="text-gray-500 text-xs">Browser print → "Save as PDF" → choose Letter, no scaling.</span>
      </div>
      {gen.flagged_unverifiable.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4 text-yellow-300 text-sm resume-no-print">
          <b>⚠ Verify these claims</b> — the audit pass couldn't trace them back to your source resume:
          <ul className="list-disc ml-5 mt-2">
            {gen.flagged_unverifiable.map(f => <li key={f}><code className="bg-black/30 px-1.5 py-0.5 rounded">{f}</code></li>)}
          </ul>
        </div>
      )}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="resume-print" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

/* ===================== UI primitives ===================== */

function FormBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-orange-500 font-bold tracking-widest text-xs mb-2">{title.toUpperCase()}</div>
      {subtitle && <p className="text-gray-500 text-sm mb-4 max-w-2xl">{subtitle}</p>}
      {children}
    </section>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-1.5">{label}</div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder }: { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      {label && <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-1.5">{label}</div>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-orange-500 focus:outline-none font-mono"
      />
    </label>
  );
}

function BulletEditor({ bullets, onChange }: { bullets: string[]; onChange: (b: string[]) => void }) {
  return (
    <div>
      <div className="text-xs text-gray-400 font-bold tracking-wider uppercase mb-1.5">Bullets — one accomplishment per line</div>
      <Textarea
        value={bullets.join("\n")}
        onChange={v => onChange(v.split("\n").map(s => s.trim()).filter(Boolean))}
        rows={5}
        placeholder={"Built X that reduced Y by Z\nShipped A used by B users\nLed C migration..."}
      />
    </div>
  );
}

function ListBlock<T>({ title, items, onChange, newEntry, renderItem }: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  newEntry: () => T;
  renderItem: (item: T, set: (item: T) => void) => React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="text-orange-500 font-bold tracking-widest text-xs">{title.toUpperCase()}</div>
        <button
          type="button"
          onClick={() => onChange([...items, newEntry()])}
          className="text-xs text-orange-500 hover:text-orange-300 font-bold tracking-wider uppercase"
        >
          + Add
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="border border-white/10 rounded-xl p-4 bg-zinc-950 relative">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="absolute top-3 right-3 text-xs text-gray-600 hover:text-red-400"
            >
              ✕
            </button>
            {renderItem(item, (next: T) => {
              const copy = items.slice();
              copy[idx] = next;
              onChange(copy);
            })}
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-600 text-xs italic">None yet — click + Add.</p>}
      </div>
    </section>
  );
}
