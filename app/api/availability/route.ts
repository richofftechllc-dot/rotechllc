import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/availability — PUBLIC, read-only view of the hours coaches set for
// themselves in the CRM (`crmSchedule`, written by /api/admin/schedule and editable
// over Discord). Surfaces those hours on the public /book page so members book inside
// real availability. Matched to the booking page's coach slugs by name.

const SLUG_BY_NAME: Record<string, string> = { randy: "randy", tyler: "tyler", daquan: "daquan" };

export async function GET() {
  try {
    const snap = await coll("crmSchedule").limit(100).get();
    const coaches = snap.docs
      .map((d) => {
        const s = d.data() as { name?: string; days?: Record<string, string>; note?: string };
        const slug = SLUG_BY_NAME[String(s.name || "").toLowerCase().trim()];
        if (!slug) return null;
        const days = s.days || {};
        // Keep only days the coach actually filled in.
        const setDays: Record<string, string> = {};
        for (const [k, v] of Object.entries(days)) if (String(v || "").trim()) setDays[k] = String(v).trim();
        return { slug, name: s.name || slug, days: setDays, note: String(s.note || "").trim() };
      })
      .filter(Boolean);

    // Already-booked FUTURE slots per coach, so the /book page can grey them out and
    // a member never picks a time that's taken. Only slot timestamps are exposed — no
    // names, emails, or topics (no PII).
    const booked: Record<string, string[]> = {};
    try {
      const bsnap = await coll("bookings").limit(500).get();
      const now = Date.now();
      bsnap.docs.forEach((d) => {
        const b = d.data() as { coach?: string; slot?: string; status?: string };
        const slug = String(b.coach || "").toLowerCase().trim();
        const slot = String(b.slot || "");
        if (!slug || !slot || b.status === "canceled") return;
        if (Date.parse(slot) < now) return; // past slots don't matter
        (booked[slug] ||= []).push(slot);
      });
    } catch { /* booked is best-effort */ }

    return NextResponse.json({ ok: true, coaches, booked });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error", coaches: [], booked: {} }, { status: 200 });
  }
}
