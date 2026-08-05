"use client";

// ORBIT — the platforms ROT coaches you into, circling Bo like a solar system.
//
// Emblems are drawn in app/components/PlatformMarks.tsx as inline SVG and set
// into 3D milled discs. They are trademarks of their owners; the caption says
// outright that ROT prepares people for these platforms and is not affiliated
// with, endorsed by, or partnered with any of them. Keep that caption.
//
// Motion is CSS only: each ring rotates and every body counter-rotates at the
// same duration so it stays upright while it travels. No JS per frame.
// prefers-reduced-motion parks every ring.

import Image from "next/image";
import { MARKS } from "./PlatformMarks";

type Body = { label: string; hint: string };

const RINGS: { size: number; duration: number; reverse?: boolean; bodies: Body[] }[] = [
  {
    size: 236,
    duration: 34,
    bodies: [
      { label: "AWS", hint: "Cloud Practitioner · Solutions Architect · AI Practitioner" },
      { label: "Microsoft", hint: "AZ-900 · AZ-104" },
      { label: "Google", hint: "Cloud Digital Leader" },
    ],
  },
  {
    size: 404,
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
    <div className="relative mx-auto w-full max-w-[480px] aspect-square select-none">
      {/* Centre — Bo. Everything else is in orbit around the tutor. */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="rot-orbit-core grid place-items-center text-center">
          <div className="relative z-10 px-4">
            <Image
              src="/rot-mark-ink.png"
              alt=""
              width={34}
              height={32}
              className="w-[30px] h-auto mx-auto mb-2 opacity-90"
            />
            <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-rot-faint">Bo Tech</div>
            <div className="text-[15px] font-semibold leading-tight mt-1 text-rot-fg">Your AI tutor</div>
            <div className="text-[10px] text-rot-muted mt-1.5 leading-snug">Answers at 3&nbsp;AM</div>
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
            const Mark = MARKS[b.label];
            return (
              <div
                key={b.label}
                className="rot-orbit-slot"
                style={{ transform: `rotate(${angle}deg) translateY(${-ring.size / 2}px)` }}
              >
                <div
                  className="rot-orbit-body"
                  style={{
                    animationDuration: `${ring.duration}s`,
                    animationDirection: ring.reverse ? "normal" : "reverse",
                    // Cancels the slot's own rotate(angle). The animation above
                    // only undoes the RING's spin; without this every emblem sits
                    // permanently tilted by however far around the ring it is,
                    // which is how ServiceNow ended up on its side and Claude
                    // upside down. `transform` is free here because the
                    // counter-spin uses the separate `rotate` property.
                    transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                  }}
                  title={b.hint}
                >
                  {Mark ? <Mark /> : <span className="text-xs font-bold">{b.label}</span>}
                  <span className="rot-orbit-name">{b.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
