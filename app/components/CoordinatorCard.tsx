"use client";
import Image from "next/image";
import { useState } from "react";

type Accent = "yellow" | "green" | "orange";

const ACCENT: Record<Accent, { border: string; chip: string; eyebrow: string; ringGlow: string; cta: string }> = {
  yellow: {
    border: "border-yellow-500/40 hover:border-yellow-500/70",
    chip:   "text-yellow-400 border-yellow-500/40",
    eyebrow:"text-yellow-400",
    ringGlow:"from-yellow-500/10",
    cta: "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10",
  },
  green: {
    border: "border-green-500/40 hover:border-green-500/70",
    chip:   "text-green-400 border-green-500/40",
    eyebrow:"text-green-400",
    ringGlow:"from-green-500/10",
    cta: "border-green-500/40 text-green-400 hover:bg-green-500/10",
  },
  orange: {
    border: "border-orange-500/40 hover:border-orange-500/70",
    chip:   "text-orange-400 border-orange-500/40",
    eyebrow:"text-orange-400",
    ringGlow:"from-orange-500/10",
    cta: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10",
  },
};

export type AgentOption = {
  label: string;     // "Cert" / "Clearance" / "Project Intake"
  agent_id: string;  // Fireflies agent ID
};

// Maps handle chip names → Fireflies voice agent IDs. Add new agents here as we wire them up.
export const AGENT_MAP: Record<string, AgentOption> = {
  "Cert":           { label: "Cert Qualifier",      agent_id: "69e6dec6bfc9dd72bc6df449" },
  "Clearance":      { label: "Clearance Qualifier", agent_id: "69e6d89a462191c47e54e17a" },
  "Project Intake": { label: "Project Discovery",   agent_id: "69e6e005462191c47e54e17b" },
};


export default function CoordinatorCard({
  name,
  title,
  scope,
  accent,
  photo,
  ctaHref,           // Discord fallback for "Just join Discord" button
  handles,
}: {
  name: string;
  title: string;
  scope?: string;
  accent: Accent;
  photo?: string;
  ctaHref: string;
  handles: string[];
}) {
  const a = ACCENT[accent];
  const agents: AgentOption[] = handles.map(h => AGENT_MAP[h]).filter(Boolean);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  function startCall(agent_id: string) {
    setPicked(agent_id);
  }

  function close() {
    setOpen(false);
    setPicked(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); if (agents.length === 1) setPicked(agents[0].agent_id); }}
        className={`relative block aspect-[941/1672] rounded-2xl overflow-hidden border ${a.border} bg-zinc-950 transition group w-full text-left`}
      >
        {photo && (
          <Image
            src={photo}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 transition"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${a.ringGlow} via-transparent to-black pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

        <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">R</div>
          <div className="text-white font-bold tracking-[0.18em] text-[10px]">RICH OFF TECH</div>
        </div>

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
          <div className={`${a.eyebrow} font-bold tracking-[0.22em] text-[10px] uppercase mb-3`}>{title}</div>
          {scope && <div className="text-white/70 font-semibold tracking-[0.15em] text-[9px] uppercase mb-4">· {scope} ·</div>}
          <div className="text-white font-black leading-[0.95] text-4xl md:text-5xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">{name}</div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black to-transparent">
          <div className="flex flex-wrap gap-1.5 justify-center mb-3">
            {handles.map(h => (
              <span key={h} className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${a.chip}`}>{h}</span>
            ))}
          </div>
          <div className="text-center text-white/60 text-[10px] font-bold tracking-widest uppercase">Book a Consult →</div>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onClick={close}>
          <div
            onClick={e => e.stopPropagation()}
            className={`relative bg-zinc-950 border ${a.border.split(" ")[0]} rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto`}
          >
            <button onClick={close} aria-label="Close" className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30">✕</button>

            <div className="p-5 sm:p-6 border-b border-white/10">
              <div className={`${a.eyebrow} font-bold tracking-widest text-[10px] uppercase mb-1`}>{title}</div>
              <div className="text-2xl font-black">Talk to {name.split(" ")[0]}</div>
              <p className="text-gray-400 text-sm mt-1">Start with a 5-minute AI qualification call — pick the topic that fits.</p>
            </div>

            {agents.length > 1 && (
              <div className="px-5 sm:px-6 pt-4 flex flex-wrap gap-2">
                {agents.map(ag => (
                  <button
                    key={ag.agent_id}
                    type="button"
                    onClick={() => startCall(ag.agent_id)}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold tracking-wider uppercase ${picked === ag.agent_id ? `${a.border.split(" ")[0]} bg-white/5 text-white` : `border-white/10 text-gray-400 hover:border-white/30`}`}
                  >
                    {ag.label}
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 sm:p-6">
              {!picked ? (
                <div className="text-center text-gray-400 py-12 text-sm">Pick which call you want to start above ↑</div>
              ) : (
                <>
                  <div className="rounded-lg overflow-hidden bg-zinc-950 border border-white/10">
                    <iframe
                      key={picked}
                      src={`https://agents.fireflies.ai/connect-to-agent?id=${picked}`}
                      title={`${name} qualification`}
                      className="w-full bg-zinc-950"
                      height={500}
                      allow="microphone; autoplay"
                    />
                  </div>

                  <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="text-green-400 font-bold text-xs tracking-widest uppercase mb-1">After the call</div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Instructions complete. The team will review your responses and reach out by email to schedule a live meeting with <b>{name.split(" ")[0]}</b>. Keep an eye on your inbox.
                    </p>
                  </div>

                  <div className="mt-5">
                    <a
                      href={ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm hover:opacity-90"
                    >
                      Join the Discord — Free
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
