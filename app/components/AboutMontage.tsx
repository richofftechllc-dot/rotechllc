import Image from "next/image";

const BASE = "/about/knowledge-2026";

// All photos from ServiceNow Knowledge 2026, Las Vegas. Partner attribution applies to the whole set.
const k26Thumbs = [
  { src: "k26-badge-hero.jpg",    alt: "Randy Allen — K26 Partner badge held at the venue" },
  { src: "k26-infosys-robot.jpg", alt: "Bo at the Infosys booth, Knowledge 2026" },
  { src: "k26-smile.jpg",         alt: "Bo at K26, Rich Off Tech jacket" },
  { src: "k26-laptop.jpg",        alt: "Bo working at the laptop, K26" },
  { src: "k26-phone.jpg",         alt: "Bo on the phone at K26" },
  { src: "k26-oncam.jpg",         alt: "Bo on camera at K26" },
  { src: "k26-portrait-a.jpg",    alt: "Bo at K26, portrait" },
  { src: "k26-portrait-b.jpg",    alt: "Bo at K26, portrait" },
  { src: "k26-letterbox.jpg",     alt: "Bo at K26, behind-the-scenes frame" },
];

export default function AboutMontage() {
  return (
    <div className="mt-16">
      <div className="text-orange-500 font-bold tracking-widest text-[11px] mb-4">SERVICENOW KNOWLEDGE 2026 · LAS VEGAS · PARTNER</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* HERO — K26 badge */}
        <div className="relative aspect-[4/5] md:row-span-2 md:col-span-2 rounded-xl overflow-hidden border border-orange-500/30">
          <Image
            src={`${BASE}/k26-badge-card.jpg`}
            alt="Randy Allen — ServiceNow Knowledge 2026 Partner badge + Challenger Level 2 card, Rich Off Tech LLC"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
            <div className="text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-1">Knowledge 2026</div>
            <div className="text-white text-sm font-bold leading-tight">Partner · Rich Off Tech LLC</div>
          </div>
        </div>

        {k26Thumbs.map((p) => (
          <div key={p.src} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
            <Image
              src={`${BASE}/${p.src}`}
              alt={p.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
