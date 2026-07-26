// lib/deal.ts — SINGLE SOURCE OF TRUTH for the live promo window and the Birthday Drop
// products. Before this file the deadline was hardcoded in six places (homepage banner,
// founding card, pricing page, Bo's chat prompt, the offer sheet, the bot), so extending
// the deal meant six edits and a deploy — and one of them always got missed.
//
// HOW THE DEADLINE WORKS NOW
//   default  → DEAL_DEADLINE_DEFAULT below (code, needs a deploy to change)
//   override → crmConfig/settings.dealDeadline in Firestore, set by the CRM "Extend deal"
//              button, served to the public site by GET /api/deal (no deploy needed)
// Client components fetch /api/deal and fall back to the default if the fetch fails, so a
// Firestore hiccup can never blank out the countdown.

// Bo's 30th Birthday Drop. Extended from July 27 to July 28 (Randy, 2026-07-26).
// -04:00 = ET, which is the clock every piece of ROT copy quotes.
export const DEAL_DEADLINE_DEFAULT = "2026-07-28T23:59:59-04:00";

// Human labels. Keep these in sync with the deadline above.
export const DEAL_WINDOW_LABEL = "July 26–28, 2026";
export const DEAL_END_LABEL = "July 28";

export type BirthdayDeal = {
  key: string;
  /** squareProducts `product` field — the bot routes payments on this. */
  product: string;
  name: string;
  /** Promo price in whole dollars. */
  price: number;
  /** Total including Square's service fee, as shown at checkout. */
  total: string;
  /** Normal price, struck through in the UI. Matches the offer sheet's "Regular" column. */
  regular: string;
  months: number;
  /** Reusable Square quick_pay link. */
  link: string;
  /** Short line for Bo and the CRM invoice buttons. */
  includes: string;
};

// The three deals that went live in the drop. Mirrors the six squareProducts docs
// (item + variation id per product) the bot routes on.
export const BIRTHDAY_DEALS: BirthdayDeal[] = [
  {
    key: "bday-secplus",
    product: "bday-secplus",
    name: "Security+ Birthday Drop",
    price: 727,
    total: "$777.89",
    regular: "$1,500",
    months: 12,
    link: "https://square.link/u/0ChAU15t",
    includes:
      "exam voucher, ROT quiz + lesson system (5 Sec+ domains), 30/60/90-day study plan, 30-min 1-on-1, resume rebuild in ROT format, 12 months ROT Discord",
  },
  {
    key: "bday-csa",
    product: "bday-csa",
    name: "ServiceNow CSA Birthday Drop",
    price: 727,
    total: "$777.89",
    regular: "$1,600",
    months: 12,
    link: "https://square.link/u/rdx2l5Vc",
    includes:
      "exam voucher, ROT quiz + lesson system (8 CSA modules), 30/60/90-day study plan, 30-min 1-on-1, resume rebuild in ROT format, 12 months ROT Discord",
  },
  {
    key: "discord-addon",
    product: "discord-addon",
    name: "ROT Discord Access",
    price: 100,
    total: "$100",
    regular: "$227",
    months: 12,
    link: "https://square.link/u/ThiCFqpM",
    includes: "12 months of ROT Discord — community, AI tutors, weekly calls, job drops. No exam voucher, no cert track.",
  },
];

/** Format a deadline ISO string as the short label Bo and the site use ("July 28"). */
export function endLabel(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return DEAL_END_LABEL;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "America/New_York" });
}

/** True while the promo window is still open. */
export function dealIsLive(iso: string = DEAL_DEADLINE_DEFAULT, now: number = Date.now()): boolean {
  const t = new Date(iso).getTime();
  return isNaN(t) ? false : now <= t;
}
