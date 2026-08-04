"use client";

// ORBIT — the platforms ROT coaches you into, circling Bo like a solar system.
//
// TRADEMARK NOTE, deliberate: these are set as wordmarks in our own type, not
// the companies' brand assets. Dropping Apple/Google/Microsoft/AWS/OpenAI/
// Anthropic logo files onto a commercial page implies a partnership ROT doesn't
// have, and most of those brand guidelines forbid exactly that. The caption says
// outright that we prepare people for these platforms and are not affiliated.
// If Randy has rights to a given mark, swap that entry's `label` for an <Image>.
//
// Motion is CSS only: each ring rotates, and every chip counter-rotates at the
// same duration so the text stays upright while it travels. No JS per frame.
// prefers-reduced-motion parks every ring.

type Body = { label: string; hint: string };

const RINGS: { size: number; duration: number; reverse?: boolean; bodies: Body[] }[] = [
  {
    size: 260,
    duration: 34,
    bodies: [
      { label: "AWS", hint: "Cloud Practitioner · Solutions Architect · AI Practitioner" },
      { label: "Microsoft", hint: "AZ-900 · AZ-104" },
      { label: "Google", hint: "Cloud Digital Leader" },
    ],
  },
  {
    size: 420,
    duration: 52,
    reverse: true,
    bodies: [
      { label: "CompTIA", hint: "Security+ · Network+ · CySA+ · CASP+" },
      { label: "ServiceNow", hint: "CSA · CAD · CIS" },
      { label: "Claude", hint: "The engine behind Bo Tech" },
      { label: "ChatGPT", hint: "Tooling we teach you to work with" },
    ],
  },
];

export default function Orbit() {
  return (
    <div className="relative mx-auto w-full max-w-[460px] aspect-square select-none" aria-hidden="false">
      {/* Centre — Bo. Everything else is in orbit around the tutor. */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="rot-orbit-core grid place-items-center text-center">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-rot-faint">Bo Tech</div>
            <div className="text-sm font-semibold mt-1">Your AI tutor</div>
          </div>
        </div>
      </div>

      {RINGS.map((ring) => (
        <div
          key={ring.size}
          className="rot-orbit-ring"
          style={{
            width: ring.size,
            height: ring.size,
            animationDuration: `${ring.duration}s`,
            animationDirection: ring.reverse ? "reverse" : "normal",
          }}
        >
          {ring.bodies.map((b, i) => {
            const angle = (360 / ring.bodies.length) * i;
            return (
              <div
                key={b.label}
                className="rot-orbit-slot"
                style={{ transform: `rotate(${angle}deg) translateY(${-ring.size / 2}px)` }}
              >
                <div
                  className="rot-orbit-chip"
                  style={{
                    animationDuration: `${ring.duration}s`,
                    animationDirection: ring.reverse ? "normal" : "reverse",
                  }}
                  title={b.hint}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
