import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

// Public booking endpoint. A member books a 1-on-1 from the website; we write it to
// the SAME `bookings` collection the Discord flow uses, tagged source:"web", with NO
// Meet link yet. The Discord bot (which holds the Google OAuth creds in Railway) picks
// up web bookings, mints the Google Meet + Fireflies invite, emails the member the link,
// and pings the coach. This keeps all secrets in the bot — the site never sees them.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COACHES: Record<string, string> = { randy: "Randy", tyler: "Tyler", daquan: "Daquan" };

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
