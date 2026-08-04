import type { Metadata } from "next";
import FoundingSlot from "../components/FoundingSlot";
import { DiscordAccessCard } from "../components/Offers";

export const metadata: Metadata = {
  title: "Membership — Rich Off Tech",
  description: "Founder Full Membership at $375/year or $40/month, plus Discord-only access at $375 for 12 months.",
};

// MEMBERSHIP — the membership card and the Discord-only add-on side by side, so a
// buyer can see the difference between "everything" and "just the room" without
// scrolling the whole home page. Prices and checkout URLs come from lib/pricing.ts
// (membership) and lib/links.ts (Discord Access); nothing is retyped here.
export default function Membership() {
  return (
    <>
      <FoundingSlot />

      <section className="bg-zinc-950 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">JUST THE ROOM</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Discord access on its own.</h2>
            <p className="text-gray-400">
              Want the community and the AI tutors without a cert track attached? This is that.
            </p>
          </div>
          <DiscordAccessCard />
          <p className="text-gray-500 text-sm text-center mt-8">
            Looking for the full breakdown of what each tier includes?{" "}
            <a href="/pricing" className="text-orange-400 underline underline-offset-2">See the pricing page →</a>
          </p>
        </div>
      </section>
    </>
  );
}
