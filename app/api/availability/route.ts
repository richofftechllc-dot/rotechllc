import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/availability — PUBLIC, read-only view of the hours coaches set for
// themselves in the CRM (`crmSchedule`, written by /api/admin/schedule and editable
// over Discord). Surfaces those hours on the public /book page so members book inside
// real availability. Matched to the booking page's coach slugs by name.

const SLUG_BY_NAME: Record<string, string> = { randy: "randy", tyler: "tyler", daquan: "daquan" };
// Coaches also match by their crmSchedule doc key (Discord ID / "owner"), because the
// display name captured at login can differ from the slug — e.g. Randy's account name is
// "richofftech", so a name-only match dropped his schedule. IDs are the reliable key.
const SLUG_BY_ID: Record<string, string> = {
  [(process.env.RANDY_DISCORD_ID || "").trim()]: "randy",
  "1484048489695678475": "randy",
  owner: "randy",
  "1465828992014876834": "tyler",
  "694452462676869122": "daquan",
};

export async function GET() {
  try {
    const snap = await coll("crmSchedule").limit(100).get();
    const coaches = snap.docs
      .map((d) => {
        const s = d.data() as { name?: string; days?: Record<string, string>; note?: string; coachKey?: string };
        const slug = SLUG_BY_NAME[String(s.name || "").toLowerCase().trim()] || SLUG_BY_ID[d.id] || (s.coachKey as string | undefined);
        if (!slug) return null;
        const days = s.days || {};
        // Keep only days the coach actually filled in.
        const setDays: Record<string, string> = {};
        for (const [k, v] of Object.entries(days)) if (String(v || "").trim()) setDays[k] = String(v).trim();
        return { slug, name: s.name || slug, days: setDays, note: String(s.note || "").trim() };
      })
      .filter(Boolean);
    return NextResponse.json({ ok: true, coaches });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error", coaches: [] }, { status: 200 });
  }
}
