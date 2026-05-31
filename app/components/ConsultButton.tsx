"use client";
import { useState } from "react";

type Accent = "yellow" | "green" | "orange";

const ACCENT: Record<Accent, { border: string; cta: string }> = {
  yellow: { border: "border-yellow-500/40", cta: "border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10" },
  green:  { border: "border-green-500/40",  cta: "border-green-500/40 text-green-400 hover:bg-green-500/10" },
  orange: { border: "border-orange-500/40", cta: "border-orange-500/40 text-orange-400 hover:bg-orange-500/10" },
};

type AgentOption = { label: string; agent_id: string };

const AGENT_MAP: Record<string, AgentOption> = {
  "Cert":           { label: "Cert Qualifier",      agent_id: "69e6dec6bfc9dd72bc6df449" },
  "Clearance":      { label: "Clearance Qualifier", agent_id: "69e6d89a462191c47e54e17a" },
  "Project Intake": { label: "Project Discovery",   agent_id: "69e6e005462191c47e54e17b" },
};

const FOUNDING_HREF = "https://square.link/u/7P6knSUK";

export default function ConsultButton({
  name,
  title,
  handles,
  accent,
  discordInvite,
  className,
  children,
}: {
  name: string;
  title?: string;
  handles: string[];
  accent: Accent;
  discordInvite: string;
  className?: string;
  children: React.ReactNode;
}) {
  const agents: AgentOption[] = handles.map(h => AGENT_MAP[h]).filter(Boolean);
  const a = ACCENT[accent];
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  function openModal() {
    setOpen(true);
    if (agents.length === 1) setPicked(agents[0].agent_id);
  }
  function close() {
    setOpen(false);
    setPicked(null);
  }

  return (
    <>
      <button type="button" onClick={openModal} className={className}>{children}</button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onClick={close}>
          <div
            onClick={e => e.stopPropagation()}
            className={`relative bg-zinc-950 border ${a.border} rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto`}
          >
            <button onClick={close} aria-label="Close" className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-zinc-900 border border-white/10 text-gray-400 hover:text-white hover:border-white/30">✕</button>

            <div className="p-5 sm:p-6 border-b border-white/10">
              {title && <div className="font-bold tracking-widest text-[10px] uppercase mb-1 opacity-70">{title}</div>}
              <div className="text-2xl font-black">Talk to {name.split(" ")[0]}</div>
              <p className="text-gray-400 text-sm mt-1">Start with a 5-minute AI qualification call — pick the topic that fits.</p>
            </div>

            {agents.length > 1 && (
              <div className="px-5 sm:px-6 pt-4 flex flex-wrap gap-2">
                {agents.map(ag => (
                  <button
                    key={ag.agent_id}
                    type="button"
                    onClick={() => setPicked(ag.agent_id)}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold tracking-wider uppercase ${picked === ag.agent_id ? `${a.border} bg-white/5 text-white` : `border-white/10 text-gray-400 hover:border-white/30`}`}
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

                  <div className="mt-5 grid sm:grid-cols-2 gap-2.5">
                    <a
                      href={FOUNDING_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm hover:opacity-90"
                    >
                      Become Founding Member — $96
                    </a>
                    <a
                      href={discordInvite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-center px-5 py-3 rounded-lg text-sm font-bold border ${a.cta}`}
                    >
                      Just join Discord
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
