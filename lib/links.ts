// Public checkout links used across the SITE.
//
// These now come from lib/pricing.ts, which is the single source of truth for
// both the PRICE and the URL that charges it. Keeping them together is the
// whole point: a link and a price that live in different files drift, and when
// they drift a customer gets charged the wrong amount.
//
// Aug 2 2026: the $227/yr and $27/mo links still exist in Square and still
// charge those amounts. They are NOT reused for the $375/$40 rates. See the
// CHECKOUT block in lib/pricing.ts for what to create.
import { CHECKOUT } from "./pricing";

export const LINKS = {
  foundingMonthly: CHECKOUT.monthly,
  foundingYearly: CHECKOUT.yearly,
} as const;
