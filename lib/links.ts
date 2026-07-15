// Single source of truth for public checkout links used across the SITE.
// Mirrors the bot's prices.js `LINKS`. Keep these REUSABLE quick_pay / hosted-checkout
// URLs only — never `order`-based single-use links (those die after one payment and
// bounce buyers to /welcome).
//
// `foundingMonthly` stays "" until Randy creates the durable REUSABLE $27/mo subscription
// checkout in the Square Dashboard. While it's "", the homepage shows NO monthly button
// and Bo routes monthly buyers to a coach — so a dead link can never appear. The moment
// the URL is pasted here (one edit) + redeployed, the monthly button and Bo's hand-off
// light up automatically. Also mirror the same URL into the bot's prices.js LINKS.
export const LINKS = {
  // $27/mo: our own route that mints a FRESH Square subscription link per click. A raw
  // square.link subscription link binds to its first buyer and then freezes on that
  // buyer's confirmation screen forever (single-use) — the per-click route is the only
  // way to keep it durable. See app/api/checkout/monthly/route.ts.
  foundingMonthly: "/api/checkout/monthly",
  foundingYearly: "https://square.link/u/c8X7TC0z", // $227/yr durable quick_pay
} as const;
