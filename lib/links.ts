// Public checkout links used across the SITE.
//
// Membership prices and their URLs live together in lib/pricing.ts, because a
// link and the price it charges drifting apart is how a customer gets billed
// the wrong amount. The cert/Discord product links stay here — they are their
// own products, not membership tiers.
import { CHECKOUT } from "./pricing";

export const LINKS = {
  foundingMonthly: CHECKOUT.monthly, // $40/mo
  foundingYearly: CHECKOUT.yearly, // $375/yr

  // Cert + Discord products. Aug 4 2026: the Birthday Drop closed and the Square
  // CATALOG was repriced IN PLACE — same links, new amounts. These now charge the
  // regular rates below, which is why the site quotes them as the price and not
  // as a discount. Square is the source of truth; if a number here and a number
  // in Square disagree, Square wins and this file is the bug.
  certSecPlus: "https://square.link/u/0ChAU15t", // $1,500 · CompTIA Security+ Certification Coaching
  certCsa: "https://square.link/u/rdx2l5Vc", // $1,600 · ServiceNow CSA Certification Coaching
  discordAccess: "https://square.link/u/ThiCFqpM", // $375 · ROT Discord Access, 12 months
} as const;
