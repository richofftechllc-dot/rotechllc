import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/checkout/monthly — the durable $27/mo checkout entry point.
//
// Square subscription payment links BIND to their first buyer and then permanently show
// that buyer's "payment confirmed" screen — so a single static square.link only ever
// works for one person (confirmed live: the old link froze on the first subscriber's
// confirmation). To make the $27/mo button truly durable we mint a NEW subscription link
// on every click (via the bot, which holds the Square token) and redirect the buyer to it.
//
// If the bot is unreachable, fall back to a last-known-good static link so a click never
// dead-ends — that fallback is itself single-use, but it covers a brief bot outage.
const FALLBACK = "https://square.link/u/TUEJN1Oc";

export async function GET() {
  const base = process.env.BOT_NOTIFY_URL?.replace(/\/notify-estimate\/?$/, "") || "";
  if (base && process.env.NOTIFY_SECRET) {
    try {
      const r = await fetch(`${base}/mint-monthly-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-notify-secret": process.env.NOTIFY_SECRET },
        signal: AbortSignal.timeout(8000), // never hang the buyer on a slow bot
      });
      const data = (await r.json().catch(() => ({}))) as { url?: string };
      if (r.ok && data?.url) return NextResponse.redirect(data.url, 302);
    } catch {
      /* fall through to the static fallback */
    }
  }
  return NextResponse.redirect(FALLBACK, 302);
}
