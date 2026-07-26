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

  // BIRTHDAY DROP (live July 26–27, 2026) — $727 promo rate, $777.89 with the service fee.
  // Reusable quick_pay links. The bot maps their Square catalog ids in squareProducts, so a
  // paid checkout auto-provisions the track + 12 months of Discord. Keep these in sync with
  // the squareProducts docs if the links are ever regenerated.
  bdaySecPlus: "https://square.link/u/0ChAU15t",
  bdayCsa: "https://square.link/u/rdx2l5Vc",
  bdayDiscord: "https://square.link/u/ThiCFqpM", // $100 / 12 months, Discord access only
} as const;
