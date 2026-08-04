// Public checkout links used across the SITE.
//
// Membership prices and their URLs live together in lib/pricing.ts, because a
// link and the price it charges drifting apart is how a customer gets billed
// the wrong amount. The birthday-drop cert links stay here — they are their own
// products, not membership tiers.
import { CHECKOUT } from "./pricing";

export const LINKS = {
  foundingMonthly: CHECKOUT.monthly, // $40/mo
  foundingYearly: CHECKOUT.yearly, // $375/yr

  // Birthday Drop cert bundles. The drop closed Jul 27 2026 — these links still
  // charge the drop prices, so anything still pointing at them is selling a
  // closed promo. See BirthdayDrop.tsx.
  bdaySecPlus: "https://square.link/u/0ChAU15t",
  bdayCsa: "https://square.link/u/rdx2l5Vc",
  bdayDiscord: "https://square.link/u/ThiCFqpM", // $100 / 12 months, Discord access only
} as const;
