import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { coachSlots, isValidSlot } from "@/lib/scheduleSlots";

// Public booking endpoint. A member books a 1-on-1 from the website; we write it to
// the SAME `bookings` collection the Discord flow uses, tagged source:"web", with NO
// Meet link yet. The Discord bot (which holds the Google OAuth creds in Railway) picks
// up web bookings, mints the Google Meet + Fireflies invite, emails the member the link,
// and pings the coach. This keeps all secrets in the bot — the site never sees them.
//
// The times offered come STRAIGHT from the coach's CRM schedule (same source as Discord).
// No schedule set = no slots = the page shows "closed". One source of truth, no drift.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COACHES: Record<string, string> = { randy: "Randy", tyler: "Tyler", daquan: "Daquan" };

// GET /api/book?coach=randy — the coach's real open slots (next 7 days) from the CRM
// schedule. No coach → per-coach availability so the page can gray out empty coaches.
export async function GET(req: Request) {
  const coach = new URL(req.url).searchParams.get("coach")?.toLowerCase() || "";
  if (coach && COACHES[coach]) {
    const slots = await coachSlots(coach);
    return NextResponse.json({ ok: true, coach, slots, open: slots.length > 0 });
  }
  const avail: Record<string, boolean> = {};
  for (const key of Object.keys(COACHES)) avail[key] = (await coachSlots(key)).length > 0;
  return NextResponse.json({ ok: true, availability: avail, open: Object.values(avail).some(Boolean) });
}

export async function POST(req: Request) {
  let b: { coach?: string; slot?: string; label?: string; topic?: string; name?: string; email?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const coach = String(b.coach || "").toLowerCase();
  const coachName = COACHES[coach];
  const slot = String(b.slot || "");
  const name = String(b.name || "").trim().slice(0, 80);
  const email = String(b.email || "").trim().slice(0, 160);
  const topic = String(b.topic || "General").slice(0, 120);

  if (!coachName) return NextResponse.json({ ok: false, error: "Pick a coach." }, { status: 400 });
  if (!slot || isNaN(Date.parse(slot))) return NextResponse.json({ ok: false, error: "Pick a time." }, { status: 400 });
  if (Date.parse(slot) < Date.now()) return NextResponse.json({ ok: false, error: "That time has passed — pick another." }, { status: 400 });
  if (!name) return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ ok: false, error: "Add a valid email." }, { status: 400 });

  // Authoritative gate: the time must be a real slot on THIS coach's CRM schedule. Blocks
  // a stale page or a direct POST from booking a time the coach never actually offered.
  if (!(await isValidSlot(coach, slot))) {
    return NextResponse.json({ ok: false, error: "That time isn't open — refresh and pick from the current times.", closed: true }, { status: 409 });
  }

  const now = new Date().toISOString();
  const id = `${coach}_${slot}`;
  try {
    await coll("bookings").doc(id).create({
      coach, coachName, slot, label: String(b.label || "").slice(0, 80), topic,
      userName: name, email, status: "booked", source: "web",
      bookedAt: now, createdAt: now,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "That time was just taken — pick another." }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
