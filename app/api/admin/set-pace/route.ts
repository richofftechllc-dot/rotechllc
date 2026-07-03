import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import { isPace } from "@/lib/plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/set-pace  { email, pace, trackId? }
// Coach sets a student's plan pace (30/60/90) and optionally their active track.
// Marks it coachSet so the student's plan page shows "set by your coach" (they can still adjust).
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { email?: string; pace?: number; trackId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  if (!body.email) return NextResponse.json({ ok: false, error: "need email" }, { status: 400 });
  if (!isPace(body.pace)) return NextResponse.json({ ok: false, error: "bad_pace" }, { status: 400 });

  try {
    const snap = await coll("customers").where("email", "==", body.email.toLowerCase()).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });

    const ref = snap.docs[0].ref;
    const cur = snap.docs[0].data() as Record<string, unknown>;
    const update: Record<string, unknown> = {
      pace: body.pace,
      paceSetByCoach: true,
      paceSetBy: admin.name,
      paceSetAt: new Date().toISOString(),
    };
    if (body.trackId) update.track = body.trackId;
    if (!cur.planStart) update.planStart = new Date().toISOString().slice(0, 10);

    await ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
