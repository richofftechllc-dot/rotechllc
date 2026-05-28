"use client";
import Image from "next/image";
import { useState } from "react";

export default function BoAvatarFlip() {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <button
        type="button"
        onClick={() => setFlipped(f => !f)}
        aria-label={flipped ? "Show photo" : "Show illustrated"}
        aria-pressed={flipped}
        className="relative w-full block cursor-pointer perspective-distant focus:outline-none"
      >
        <div
          className={`relative transform-3d transition-transform duration-700 ease-out ${flipped ? "rotate-y-180" : ""}`}
        >
          <Image
            src="/bo-avatar.png"
            alt="Bo"
            width={500}
            height={500}
            priority
            className="rounded-full backface-hidden"
          />
          <Image
            src="/bo-cartoon.png"
            alt="Bo, illustrated"
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full rounded-full backface-hidden rotate-y-180"
          />
        </div>
      </button>
    </div>
  );
}
