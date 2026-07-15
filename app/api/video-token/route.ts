import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedCode } from "@/lib/session";
import { accessAllows } from "@/lib/access";
import { signPlaybackToken } from "@/lib/mux";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST { lessonId } → verify the EXISTING session gate, check the lesson's requiredAccess
// against the user's track, and (only if allowed) mint a 2-hour signed Mux playback JWT.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const lessonId = typeof body.lessonId === "string" ? body.lessonId.trim() : "";
    if (!lessonId) {
      return NextResponse.json({ ok: false, error: "lessonId required" }, { status: 400 });
    }

    // 1) EXISTING auth gate — validates the rot_session cookie; Discord-only → null → denied.
    const code = await getAuthedCode(req);
    if (!code) {
      return NextResponse.json({ ok: false, error: "Not logged in" }, { status: 401 });
    }

    // Resolve the customer's track (same lookup the quiz auth uses).
    const custSnap = await coll("customers").where("quizCode", "==", code).limit(1).get();
    if (custSnap.empty) {
      return NextResponse.json({ ok: false, error: "Account not found" }, { status: 401 });
    }
    const cust = custSnap.docs[0].data();
    const track: string | null = cust.track || null;
    const plan: string | null = cust.plan || null;
    const productType: string | null = cust.productType || null;
    const billingCycle: string | null = cust.billingCycle || null;

    // 2) Look up the lesson.
    const lessonSnap = await coll("lessons").where("lessonId", "==", lessonId).limit(1).get();
    if (lessonSnap.empty) {
      return NextResponse.json({ ok: false, error: "Lesson not found" }, { status: 404 });
    }
    const lesson = lessonSnap.docs[0].data();
    const playbackId: string = lesson.muxPlaybackId || "";
    const requiredAccess: string = lesson.requiredAccess || "";
    if (!playbackId) {
      return NextResponse.json({ ok: false, error: "Lesson has no video yet" }, { status: 404 });
    }

    // 3) Access check — same prefix gate as the quiz; null/empty track is denied.
    if (!accessAllows(track, requiredAccess, { plan, productType, billingCycle })) {
      return NextResponse.json({ ok: false, locked: true, error: "This lesson isn't in your plan." }, { status: 403 });
    }

    // 4) Mint the short-lived signed playback token.
    const token = signPlaybackToken(playbackId);
    return NextResponse.json({ ok: true, token, playbackId, title: lesson.title || "" });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
