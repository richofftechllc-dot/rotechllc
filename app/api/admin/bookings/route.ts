import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/bookings — 1-on-1s booked via Bo's DM flow (Firestore `bookings`),
// so a confirmed booking shows up in the CRM (it also DMs the coach when it's made).
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("bookings").limit(300).get();
    const now = Date.now();
    const bookings = snap.docs
      .map((d) => {
        const b = d.data() as Record<string, unknown>;
        return {
          id: d.id,
          coach: (b.coachName as string) || (b.coach as string) || "",
          slot: (b.slot as string) || "",
          label: (b.label as string) || "",
          topic: (b.topic as string) || "",
          userName: (b.userName as string) || "",
          status: (b.status as string) || "booked",
          bookedAt: (b.bookedAt as string) || "",
        };
      })
      .filter((b) => b.status !== "canceled")
      .sort((a, b) => Date.parse(a.slot || "0") - Date.parse(b.slot || "0"));
    const upcoming = bookings.filter((b) => !b.slot || Date.parse(b.slot) >= now - 3600_000);
    return NextResponse.json({ ok: true, bookings: upcoming.length ? upcoming : bookings.slice(-20) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
