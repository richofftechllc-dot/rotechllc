"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const EstimateBuilder = dynamic(() => import("./EstimateBuilder"), { ssr: false });

export default function EstimateBuilderTrigger() {
  const [open, setOpen] = useState(false);

  if (open) return <EstimateBuilder />;

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="bg-gradient-to-br from-orange-500/10 via-zinc-950 to-zinc-950 border border-orange-500/30 rounded-2xl p-8 md:p-10 text-center">
        <div className="text-orange-500 font-bold tracking-widest text-xs mb-3">SELF-SERVE</div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">Build your own estimate.</h2>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-6">
          30+ services, transparent prices, 8 payment plans including Afterpay.
          Pick what you want — see the total live. We send a fixed quote within 24h.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg text-base hover:opacity-90 transition"
        >
          Open the Estimate Builder ↓
        </button>
        <p className="text-gray-600 text-xs mt-4">Takes ~2 minutes · No call required · Skip ahead to a quote</p>
      </div>
    </div>
  );
}
