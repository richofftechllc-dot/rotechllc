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

export const CHECKOUT_LIVE = Boolean(CHECKOUT.yearly || CHECKOUT.monthly);
export const REFERRAL_LIVE = Boolean(CHECKOUT.referralYearly || CHECKOUT.referralMonthly);

/** Where to send buyers while a checkout link is blank. */
export const COACH_FALLBACK = "https://discord.gg/rotechllc";
