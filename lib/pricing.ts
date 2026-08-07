// SINGLE SOURCE OF TRUTH for membership pricing across the site.
//
// Aug 2 2026: the July founding window closed and founding sold out (99 cap,
// 109 members). Regular rates are now live. Before this file existed the
// numbers were retyped in ~8 components and drifted; change them HERE and the
// whole site follows.
//
// These must stay in lockstep with the bot's prices.js MEMBERSHIP block and,
// critically, with what Square actually charges. See CHECKOUT below.

export const PRICING = {
  monthly: 40, // $40 / mo   — regular rate, live since Aug 2 2026
  yearly: 375, // $375 / yr  — regular rate, live since Aug 2 2026

  // Referral tier — what somebody pays when they come in on a member's
  // /r/[code] link. This is the discount now; there is no other sale running.
  referral: {
    monthly: 27, // $27 / mo  — was the July founding monthly, now the referral rate
    yearly: 200, // $200 / yr — replaces the old $127 referral rate
  },

  // Retired rates. Kept so copy can honour people who bought at them —
  // grandfathering is a promise, not a rounding error.
  legacy: {
    foundingYearly: 227, // July founding annual — closed Jul 27 2026
    foundingMonthly: 27, // July founding monthly — closed Jul 27 2026, kept for life for those who locked it
    firstHundred: 96, // the original first-100 seat, retired Jul 21 2026
    referralYearly: 127, // old referred-friend annual rate, replaced by $200 on Aug 2 2026
  },
} as const;

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/** What a member saves by paying yearly instead of monthly. Derived, never typed:
 *  12 x $40 = $480 against $375, so $105. If either rate moves this follows. */
export const YEARLY_SAVING = PRICING.monthly * 12 - PRICING.yearly;

// ─── CHECKOUT ────────────────────────────────────────────────────────────────
// A link here MUST charge the amount shown next to it. The old $227 quick_pay
// (square.link/u/c8X7TC0z) and the $27/mo subscription are still live in Square
// and still charge the OLD prices — pointing a "$375" button at them would take
// $227 off a customer who agreed to $375.
//
// So they start BLANK. Blank means the UI shows the price and routes buyers to
// a coach instead of rendering a button that charges the wrong amount. Paste
// the new URLs here and the buttons light up everywhere at once.
//
// TO GO FULLY LIVE, create two things in the Square Dashboard:
//   1. $375/year  — a durable REUSABLE quick_pay link (never an `order` link,
//      those are single-use and bounce the second buyer to /welcome)
//   2. $40/month  — a subscription plan, then set SQUARE_MONTHLY_LINK or point
//      `monthly` at /api/checkout/monthly once that route mints the $40 plan
//   3. $200/year  — durable REUSABLE quick_pay, for referral links
//   4. $27/month  — subscription plan, for referral links
//
// The bot already routes 37500 and 4000 cents in AMOUNT_ROUTES, so roles, quiz
// codes and welcome emails fire automatically the moment those amounts land.
export const CHECKOUT = {
  // All three created AFTER the tax fix and each one verified on its live
  // checkout page — subtotal and order total identical, no tax line.
  //
  // The tax cause, for the record: Square's "Virginia (22307)" tax had
  // "Apply tax to custom amounts" ON, and payment links built as
  // "Take a payment / Exact amount" ARE custom amounts. Catalog items (the
  // certs) were never affected. That toggle is now OFF. It only applies to
  // links created after the change, which is why the first four were binned.
  yearly: "https://square.link/u/j2eiFThn", // $375.00 · one-time · verified
  monthly: "https://square.link/u/FM2S5MP0", // $40.00 · monthly · verified
  referralYearly: "https://square.link/u/rUwkBEdc", // $200.00 · one-time · verified

  // NO $27 LINK ON PURPOSE. $27/mo is grandfathered only — it belongs to
  // people already paying it as of Aug 3 2026 and their existing Square
  // subscriptions are untouched. It is not sold, not linked, and not shown
  // anywhere on the site. Public pricing is $40/mo and $375/yr; $200/yr is
  // what a member's referral link offers.
  referralMonthly: "",
} as const;

// ─── CERTS ───────────────────────────────────────────────────────────────────
// Price and URL together, for the same reason CHECKOUT above does it: they drift
// the moment they live in different files.
//
// Square is the source of truth. If a number here and a number in Square
// disagree, Square wins and this file is the bug.
//
// The bot mirrors these in prices.js SERVICES + AMOUNT_ROUTES. An amount that
// exists here but not in AMOUNT_ROUTES takes the customer's money and provisions
// nothing, so change them together.
//
// ── Aug 7 2026: all three links replaced. Read this before touching them. ──
// The previous three URLs (0ChAU15t, rdx2l5Vc, ThiCFqpM) were `order` links —
// single-use checkouts built on Jul 26 from the July Birthday Drop catalog
// items. Two things were wrong with them at once:
//
//   1. WRONG PRICE. An order link snapshots its amount at creation time, so the
//      "repriced the catalog in place" note that used to sit here was never
//      true of these links — repricing a catalog item does not move an order
//      that already exists. Sec+ charged $777.89 and CSA charged $777.89 against
//      the $1,500/$1,600 shown on the page; Discord charged $100 against $375.
//   2. SINGLE USE. The first person to pay CONSUMES the order. Every click after
//      that lands on the first buyer's "payment confirmed" receipt instead of a
//      checkout, so the button silently stops selling. That is exactly what the
//      comment in api/checkout/monthly/route.ts warns about, and Sec+ died this
//      way on Aug 7 after one buyer paid the $777.89.
//
// The replacements below are durable REUSABLE quick_pay links, verified on their
// live checkout pages: correct amount, no tax line, subtotal == order total.
//
// How to tell the two apart, because it is NOT obvious: every Square link has an
// `/order/<id>` in its long_url, quick_pay included, so the URL tells you nothing.
// The tell is what happens to that order. A quick_pay link's order is a template
// that stays DRAFT forever and is CLONED per buyer. An `order` link's order IS the
// checkout — retrieve it and you will find it OPEN/COMPLETED with a real tender
// attached, which means it has already been spent. Before putting any link here,
// pull its order: if it has ever held a payment, it is single-use. Do not use it.
export const CERTS = {
  securityPlus: { price: 1500, url: "https://square.link/u/uuFOu9k5", name: "CompTIA Security+" },
  csa: { price: 1600, url: "https://square.link/u/pITRzlG9", name: "ServiceNow CSA" },
  discordAccess: { price: 375, url: "https://square.link/u/g3UzaLOH", name: "ROT Discord Access" },
} as const;

// ─── THE REST OF THE CATALOG ─────────────────────────────────────────────────
// Security+ and ServiceNow CSA are the flagships and the only two with self-serve
// checkout — they are what people actually buy. Everything below is coached too,
// but priced per person by a coach, so these entries deliberately carry NO price
// and NO checkout link. Do not invent either: a cert with a made-up price on the
// site is a chargeback, and a made-up Square link takes money the bot cannot route.
//
// "Anything you can sit online" is the real offer. This list is the recognisable
// names, not the limit.
// The "from" price for coached certification packages. Security+ and CSA are the two
// with instant checkout, but they are options among many and leading with $1,500 makes
// the whole category look like that. $1,000 is the AWS Cloud Practitioner full track in
// COACH_SERVICES, which is the entry point for a coached package.
export const CERT_FROM_PRICE = 1000;

export const CERT_CATALOG: Array<{ group: string; certs: string[] }> = [
  { group: "CompTIA", certs: ["Network+", "A+", "CySA+", "PenTest+", "CASP+ / SecX", "Linux+", "Cloud+", "Project+"] },
  { group: "Cloud", certs: ["AWS Cloud Practitioner", "AWS Solutions Architect", "AZ-900", "AZ-104", "Google Cloud Digital Leader"] },
  { group: "ServiceNow", certs: ["CSA", "CAD (App Developer)", "CIS — ITSM", "CIS — CSM"] },
  { group: "Project & governance", certs: ["PMP", "CAPM", "CISA", "CISM", "CISSP", "ITIL 4"] },
];

// ─── COACH INVOICE MENU ──────────────────────────────────────────────────────
// FULL base prices a coach invoices from — they may apply a discount on top (the
// bot enforces the $300 cap). Amounts are CENTS to match Square and the bot.
//
// This existed in THREE places that disagreed: app/admin/page.tsx said Security+
// Essential was 150000, app/api/admin/assistant/route.ts said 85000, and the bot's
// coachinvoice.js said 85000 — so which price a client got depended on whether the
// coach clicked a button or asked Bo. One list now; the bot mirrors it in
// prices.js SERVICES.
//
// HARD RULE: every amount here, AND that amount plus the 6% invoice surcharge,
// must exist in the bot's AMOUNT_ROUTES. If it doesn't, the invoice is paid and
// the buyer is provisioned nothing.
export const COACH_SERVICES = [
  { key: "sec-essential", label: "CompTIA Security+ — Essential (voucher + coaching)", amount: 150000 },
  { key: "sec-selfguided", label: "CompTIA Security+ — Self-Guided (voucher + plan)", amount: 50000 },
  { key: "csa-essential", label: "ServiceNow CSA — Essential", amount: 160000 },
  { key: "csa-selfguided", label: "ServiceNow CSA — Self-Guided", amount: 60000 },
  { key: "csa-accelerated", label: "ServiceNow CSA — Accelerated", amount: 280000 },
  { key: "aws", label: "AWS Cloud Practitioner", amount: 100000 },
  // Clearance guidance. amount = NET; the bot's coachinvoice.breakdown() adds the 6%
  // fee on top ($4,750 net → $5,035 charged). Mirrors coachinvoice.SERVICES in the
  // bot. Clearance is a manual, high-touch service — the invoice just collects; access
  // is handled by hand. Secret/TS-SCI omitted until their current prices are confirmed.
  { key: "ts-clearance", label: "TS Clearance Guidance", amount: 475000 },
  { key: "tssci-clearance", label: "TS/SCI Clearance Guidance", amount: 550000 },
] as const;

export const CHECKOUT_LIVE = Boolean(CHECKOUT.yearly || CHECKOUT.monthly);
export const REFERRAL_LIVE = Boolean(CHECKOUT.referralYearly || CHECKOUT.referralMonthly);

/** Where to send buyers while a checkout link is blank. */
export const COACH_FALLBACK = "https://discord.gg/rotechllc";
