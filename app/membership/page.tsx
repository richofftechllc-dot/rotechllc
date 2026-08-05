import type { Metadata } from "next";
import Reveal from "../components/Reveal";
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
      <Reveal><FoundingSlot /></Reveal>

      <section className="bg-rot-sunken py-20 border-t border-rot-line">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">JUST THE ROOM</div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Discord access on its own.</h2>
            <p className="text-rot-muted">
              Want the community and the AI tutors without a cert track attached? This is that.
            </p>
          </div>
          {/* No "see the pricing page" link under this. The Just the Room card
              already states the price and what it does and does not include, so
              the link only offered a second opinion on a question already
              answered — and it sent people away from the buy button they were
              sitting on. */}
          <DiscordAccessCard />
        </div>
      </section>
    </>
  );
}
