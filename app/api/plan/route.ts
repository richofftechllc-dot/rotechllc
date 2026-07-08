import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { buildPlan, trackList, isPace, DEFAULT_PACE, PaceDays } from "@/lib/plan";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_SECRET = process.env.SESSION_SECRET || "";
const OWNER_CODE = (process.env.OWNER_LOGIN_CODE || "RANDY2026").toUpperCase();

type Session = { type: "code"; code: string } | { type: "discord"; userId: string };

function parseSession(token: string | undefined): Session | null {
  if (!token || !SESSION_SECRET) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const p = payload.split(":");
    return p.length === 3 ? { type: "discord", userId: p[1] } : null;
  }
  return { type: "code", code: payload };
}

// Resolve the caller's customer doc (may be null for the owner code or an unlinked user).
async function findCustomer(sess: Session) {
  try {
    const q = sess.type === "code"
      ? coll("customers").where("quizCode", "==", sess.code).limit(1)
      : coll("customers").where("discordId", "==", sess.userId).limit(1);
    const snap = await q.get();
    if (snap.empty) return null;
    return snap.docs[0];
  } catch { return null; }
}

function today() { return new Date().toISOString().slice(0, 10); }

export async function GET(req: NextRequest) {
  const sess = parseSession(req.cookies.get("rot_session")?.value);
  if (!sess) return NextResponse.json({ ok: false }, { status: 401 });

  const doc = await findCustomer(sess);
  const c = (doc?.data() as Record<string, unknown>) || {};
  const name = (c.name as string) || (c.firstName as string) || "Member";

  // Query overrides let the owner / anyone preview any track+pace without a saved profile.
  const qTrack = req.nextUrl.searchParams.get("trackId");
  const qPace = Number(req.nextUrl.searchParams.get("pace"));

  const trackId = qTrack || (c.track as string) || (Array.isArray(c.tracks) ? (c.tracks as string[])[0] : "") || "";
  const pace: PaceDays = isPace(qPace) ? qPace : isPace(c.pace) ? (c.pace as PaceDays) : DEFAULT_PACE;
  const startDate = (c.planStart as string) || today();

  const plan = trackId ? buildPlan(trackId, pace, startDate) : null;

  return NextResponse.json({
    ok: true,
    name,
    trackId,
    pace,
    startDate,
    saved: !!doc,
    coachSet: !!c.paceSetByCoach,
    tracks: trackList(),
    plan,
  });
}

// Student self-adjust: change your own pace and/or active track. Persists to your record.
export async function POST(req: NextRequest) {
  const sess = parseSession(req.cookies.get("rot_session")?.value);
  if (!sess) return NextResponse.json({ ok: false }, { status: 401 });

  let body: { pace?: number; trackId?: string; restart?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const doc = await findCustomer(sess);
  if (!doc) return NextResponse.json({ ok: false, error: "no_profile" }, { status: 404 });

  const update: Record<string, unknown> = {};
  if (body.pace !== undefined) {
    if (!isPace(body.pace)) return NextResponse.json({ ok: false, error: "bad_pace" }, { status: 400 });
    update.pace = body.pace;
    update.paceSetByCoach = false; // student changed it themselves
  }
  if (body.trackId) update.track = body.trackId;
  // Anchor the plan the first time (or on explicit restart) so dates are stable day to day.
  const c = doc.data() as Record<string, unknown>;
  if (!c.planStart || body.restart) update.planStart = today();

  try {
    await doc.ref.update(update);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
