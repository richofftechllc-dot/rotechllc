// lib/deal.ts — SINGLE SOURCE OF TRUTH for the coach-extendable promo window. Before
// this file the deadline was hardcoded in six places (homepage banner, founding card,
// pricing page, Bo's chat prompt, the offer sheet, the bot), so extending the deal meant
// six edits and a deploy — and one of them always got missed.
//
// Aug 4 2026: no promo is running. Nothing on the public site reads this any more; it is
// kept for the CRM and the next drop.
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

// The BIRTHDAY_DEALS product table lived here and was removed Aug 4 2026 when the drop
// was retired: it carried the $727 / $777.89 promo prices and had no importers left.
// Current product prices and links live in lib/links.ts (certs + Discord) and
// lib/pricing.ts (membership). The deadline machinery below stays — the CRM still uses
// it to drive a coach-extendable window, and it is promo-agnostic.

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
