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
  // Created in the ROTECHLLC Square dashboard on Aug 3 2026. Each amount was
  // read back off the confirmation screen before saving, so the link and the
  // price beside it are known to match.
  yearly: "https://square.link/u/DD5VQP53", // $375.00 · one-time
  monthly: "https://square.link/u/wlZPawtu", // $40.00 · monthly

  // Referral tier. The old $127 link (square.link/u/bLYKQOxs) is NOT reused —
  // it charges $127 and would undercharge $73 on every referred sale.
  referralYearly: "https://square.link/u/EGus1VxS", // $200.00 · one-time
  referralMonthly: "https://square.link/u/JysS1vqh", // $27.00 · monthly
} as const;

// ── ⚠️ BLOCKER: 6% VIRGINIA SALES TAX IS ON THESE LINKS ─────────────────────
// Verified on the live checkout pages Aug 3 2026. Square adds a 6% "Virginia
// (22307)" location tax on top of every one of these:
//
//     $375  ->  $397.50   (39750 cents)
//     $200  ->  $212.00   (21200 cents)
//     $40   ->  $42.40    (4240 cents)
//     $27   ->  $28.62    (2862 cents)
//
// The bot's AMOUNT_ROUTES matches 37500 / 20000 / 4000 / 2700. NONE of the
// taxed amounts match, so routeAmount() returns null and a paying customer
// gets no role, no quiz code and no welcome email. That is worse than the
// wrong price — it is silence after a payment.
//
// This is why the old $96 links show "+$96.00" clean in Recent sales: they
// predate this tax being applied to non-physical sales.
//
// TWO WAYS OUT, and the first is the founder's stated preference:
//   1. Exempt memberships from the tax. Square Dashboard → Settings →
//      Payments → Sales taxes → Virginia (22307) → "Apply tax to" →
//      "Select items", then leave the four ROT Membership links unticked.
//      Deciding which products DO carry VA tax is a tax-liability call, so it
//      was left for the founder rather than guessed at.
//   2. Add 39750 / 21200 / 4240 / 2862 to AMOUNT_ROUTES in the bot. Works,
//      but bakes tax into every price and makes the ladder ugly.
//
// DO NOT MERGE the site PR until one of those is done.

// ── ONE THING LEFT TO VERIFY ────────────────────────────────────────────────
// The old code warned that a raw square.link SUBSCRIPTION link "binds to its
// first buyer and then freezes on that buyer's confirmation screen forever",
// which is why /api/checkout/monthly exists to mint a fresh link per click.
// The two monthly links above use Square's newer Frequency:Monthly payment
// link, which may not have that defect — but it has not been proven with two
// real buyers.
//
// TEST IT: after the first monthly sale, open the monthly link again in a
// private window. If it shows a checkout form, it is durable and we are done.
// If it shows the previous buyer's confirmation, revert `monthly` to
// "/api/checkout/monthly" and repoint the bot's mint-monthly-link at $40.
// The yearly links are quick_pay and are durable by design — no such risk.

export const CHECKOUT_LIVE = Boolean(CHECKOUT.yearly || CHECKOUT.monthly);
export const REFERRAL_LIVE = Boolean(CHECKOUT.referralYearly || CHECKOUT.referralMonthly);

/** Where to send buyers while a checkout link is blank. */
export const COACH_FALLBACK = "https://discord.gg/rotechllc";
