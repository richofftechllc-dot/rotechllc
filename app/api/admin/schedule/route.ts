import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Team availability — coaches set their own weekly hours; everyone sees the team's.
// In-platform for now (Firebase); a Google Calendar free/busy sync can layer on later.
// Each coach = one doc in `crmSchedule` keyed by their Discord ID.

// GET /api/admin/schedule — all coaches' availability + who you are (for edit rights).
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("crmSchedule").limit(100).get();
    const schedules = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      .sort((a, b) => String((a as { name?: string }).name || "").localeCompare(String((b as { name?: string }).name || "")));
    const isOwner = admin.discordId === (process.env.RANDY_DISCORD_ID || "").trim();
    return NextResponse.json({ ok: true, schedules, me: { ...admin, isOwner } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST /api/admin/schedule — upsert ONLY the caller's own availability.
// Body: { days: { Mon, Tue, ... }, note }
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { days?: Record<string, string>; note?: string; targetDiscordId?: string; targetName?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days: Record<string, string> = {};
  for (const d of DAYS) days[d] = String(body.days?.[d] || "").slice(0, 60);

  // The OWNER (Randy) can set ANY coach's schedule; every other coach can only set their
  // own. A non-owner's targetDiscordId is ignored → they can never edit Randy's (or anyone
  // else's) row. Use the auth layer's isOwner (true for the RANDY2026 code login) so the
  // owner works even when RANDY_DISCORD_ID isn't set on this host.
  const isOwner = admin.isOwner;
  const targetId = (isOwner && body.targetDiscordId) ? String(body.targetDiscordId) : admin.discordId;
  const targetName = (isOwner && body.targetName) ? String(body.targetName) : admin.name;

  // Stable coachKey so BOTH the bot and the website read this schedule the same way,
  // regardless of how the doc is keyed (real Discord ID vs the literal "owner" for a
  // code login). This is what keeps Discord !book, the CRM, and the site in sync.
  const KEY_BY_ID: Record<string, string> = { "1465828992014876834": "tyler", "694452462676869122": "daquan" };
  let coachKey: string | null = KEY_BY_ID[targetId] || null;
  if (!coachKey && isOwner && (!body.targetDiscordId || body.targetDiscordId === admin.discordId)) coachKey = "randy";

  try {
    await coll("crmSchedule").doc(targetId).set({
      discordId: targetId,
      name: targetName,
      days,
      note: String(body.note || "").slice(0, 200),
      ...(coachKey ? { coachKey } : {}),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    // Tell the bot to (re)post the booking card ONCE — replaces the old morning
    // auto-send. It posts within a few minutes, then clears this flag. No update = no post.
    try {
      await coll("jobMeta").doc("scheduleAnnounce").set({
        pending: true, by: admin.name, at: new Date().toISOString(),
      }, { merge: true });
    } catch { /* non-fatal */ }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
