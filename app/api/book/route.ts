import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { isValidSlot } from "@/lib/scheduleSlots";

// Read a coach's day→range map from crmSchedule. Match by name (Randy/Tyler/Daquan) OR
// by the known doc key (Discord ID, or the literal "owner" doc used for the code login),
// so it resolves regardless of how the doc got keyed. {} if the coach has nothing set.
const IDS_BY_SLUG: Record<string, string[]> = {
  randy: [(process.env.RANDY_DISCORD_ID || "").trim(), "1484048489695678475", "owner"].filter(Boolean),
  tyler: ["1465828992014876834"],
  daquan: ["694452462676869122"],
};
async function coachDays(slug: string): Promise<Record<string, string>> {
  try {
    const snap = await coll("crmSchedule").limit(100).get();
    for (const d of snap.docs) {
      const data = d.data() as { name?: string; days?: Record<string, string>; coachKey?: string };
      const byName = String(data.name || "").toLowerCase().trim() === slug;
      const byId = (IDS_BY_SLUG[slug] || []).includes(d.id);
      if (byName || byId || data.coachKey === slug) return data.days || {};
    }
  } catch { /* fall through to empty */ }
  return {};
}

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

  // Authoritative gate: the time must be a real slot on THIS coach's CRM schedule — the
  // same source the /book page and Discord read. Blocks a stale page or a direct POST.
  if (!isValidSlot(await coachDays(coach), slot)) {
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
  // Ping the booked coach in Discord via the bot's command queue (best-effort — the
  // booking stands even if the ping write fails). Owner ID fallback matches crmSchedule.
  try {
    const coachDiscordId = coach === "randy"
      ? (process.env.RANDY_DISCORD_ID || "1484048489695678475")
      : coach === "daquan" ? "694452462676869122" : "1465828992014876834";
    await coll("botCommands").add({
      type: "dm",
      payload: { discordId: coachDiscordId, message: `📅 NEW BOOKING — ${name} (${email}) booked you: ${String(b.label || slot)} · Topic: ${topic}` },
      status: "pending", requestedByName: "web-booking", createdAt: now,
    });
  } catch {}
  return NextResponse.json({ ok: true });
}
