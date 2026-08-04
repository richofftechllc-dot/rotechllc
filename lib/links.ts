// Public checkout links used across the SITE.
//
// Every price and the URL that charges it now live together in lib/pricing.ts,
// because a link and its price drifting apart is how a customer gets billed the
// wrong amount. This file is the thin, stable alias the components import — it
// deliberately holds no URLs of its own any more.
import { CHECKOUT, CERTS } from "./pricing";

export const LINKS = {
  foundingMonthly: CHECKOUT.monthly, // $40/mo
  foundingYearly: CHECKOUT.yearly, // $375/yr

  certSecPlus: CERTS.securityPlus.url, // $1,500
  certCsa: CERTS.csa.url, // $1,600
  discordAccess: CERTS.discordAccess.url, // $375 / 12 months
} as const;
