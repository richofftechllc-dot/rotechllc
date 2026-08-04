import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import { DEAL_DEADLINE_DEFAULT, endLabel } from "@/lib/deal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// CRM settings (Firestore `crmConfig/settings`).
//   referralPayout — $ per paid referral
//   dealDeadline   — ISO deadline for the live promo window, set by the CRM "Extend deal"
//                    button and served to the public site by GET /api/deal. Extending the
//                    deal is a data change, not a deploy.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const doc = await coll("crmConfig").doc("settings").get();
    const d = (doc.exists ? doc.data() : {}) as { referralPayout?: number; dealDeadline?: string };
    return NextResponse.json({
      ok: true,
      referralPayout: typeof d.referralPayout === "number" ? d.referralPayout : 20,
      dealDeadline: d.dealDeadline || DEAL_DEADLINE_DEFAULT,
      dealEndLabel: endLabel(d.dealDeadline || DEAL_DEADLINE_DEFAULT),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { referralPayout?: number; dealDeadline?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  try {
    const patch: Record<string, unknown> = { updatedBy: admin.name, updatedAt: new Date().toISOString() };

    // Only write the keys actually supplied, so setting the deadline can't reset the payout.
    if (body.referralPayout !== undefined) {
      patch.referralPayout = Math.max(0, Math.min(100000, Number(body.referralPayout) || 0));
    }
    if (body.dealDeadline !== undefined) {
      const t = new Date(body.dealDeadline).getTime();
      if (isNaN(t)) return NextResponse.json({ ok: false, error: "bad date" }, { status: 400 });
      // Guard rails: never more than 90 days out, never in the past. A fat-fingered year
      // would otherwise leave the promo "live" forever.
      const now = Date.now();
      if (t < now - 86400000) return NextResponse.json({ ok: false, error: "that date is in the past" }, { status: 400 });
      if (t > now + 90 * 86400000) return NextResponse.json({ ok: false, error: "more than 90 days out" }, { status: 400 });
      patch.dealDeadline = new Date(t).toISOString();
    }
    if (Object.keys(patch).length === 2) {
      return NextResponse.json({ ok: false, error: "nothing to update" }, { status: 400 });
    }

    await coll("crmConfig").doc("settings").set(patch, { merge: true });
    const doc = await coll("crmConfig").doc("settings").get();
    const d = (doc.exists ? doc.data() : {}) as { referralPayout?: number; dealDeadline?: string };
    return NextResponse.json({
      ok: true,
      referralPayout: typeof d.referralPayout === "number" ? d.referralPayout : 20,
      dealDeadline: d.dealDeadline || DEAL_DEADLINE_DEFAULT,
      dealEndLabel: endLabel(d.dealDeadline || DEAL_DEADLINE_DEFAULT),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
