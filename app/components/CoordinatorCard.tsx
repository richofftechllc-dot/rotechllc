import Image from "next/image";

type Accent = "yellow" | "green" | "orange";

const ACCENT: Record<Accent, { border: string; chip: string; eyebrow: string; ringGlow: string }> = {
  yellow: {
    border: "border-yellow-500/40 hover:border-yellow-500/70",
    chip:   "text-yellow-400 border-yellow-500/40",
    eyebrow:"text-yellow-400",
    ringGlow:"from-yellow-500/10",
  },
  green: {
    border: "border-green-500/40 hover:border-green-500/70",
    chip:   "text-green-400 border-green-500/40",
    eyebrow:"text-green-400",
    ringGlow:"from-green-500/10",
  },
  orange: {
    border: "border-orange-500/40 hover:border-orange-500/70",
    chip:   "text-orange-400 border-orange-500/40",
    eyebrow:"text-orange-400",
    ringGlow:"from-orange-500/10",
  },
};

export default function CoordinatorCard({
  name,
  title,
  scope,
  accent,
  photo,
  ctaHref,
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
  return (
    <a
      href={ctaHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block aspect-[941/1672] rounded-2xl overflow-hidden border ${a.border} bg-zinc-950 transition group`}
    >
      {/* PHOTO LAYER (optional) */}
      {photo && (
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover opacity-90 group-hover:opacity-100 transition"
        />
      )}
      {/* ACCENT GLOW */}
      <div className={`absolute inset-0 bg-gradient-to-br ${a.ringGlow} via-transparent to-black pointer-events-none`} />
      {/* CONTRAST OVERLAY for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />

      {/* TOP — Rich Off Tech brand */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">R</div>
        <div className="text-white font-bold tracking-[0.18em] text-[10px]">RICH OFF TECH</div>
      </div>

      {/* CENTER — Eyebrow + Name (no DC background by design) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center">
        <div className={`${a.eyebrow} font-bold tracking-[0.22em] text-[10px] uppercase mb-3`}>{title}</div>
        {scope && <div className="text-white/70 font-semibold tracking-[0.15em] text-[9px] uppercase mb-4">· {scope} ·</div>}
        <div className="text-white font-black leading-[0.95] text-4xl md:text-5xl drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)]">{name}</div>
      </div>

      {/* BOTTOM — Handle chips + Discord cue */}
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black to-transparent">
        <div className="flex flex-wrap gap-1.5 justify-center mb-3">
          {handles.map(h => (
            <span key={h} className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${a.chip}`}>{h}</span>
          ))}
        </div>
        <div className="text-center text-white/60 text-[10px] font-bold tracking-widest uppercase">Book a Consult →</div>
      </div>
    </a>
  );
}
