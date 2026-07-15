import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/set-tracks { email, tracks: string[] } — set a member's access tracks
// to EXACTLY this list, across all of their customer docs. This is the source of truth
// the quiz + roster read from. Only touches `tracks` (+ an audit trail); never deletes a
// doc (that would drop /api/founding-count). Pass an empty array to clear all tracks.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let b: { email?: string; quizCode?: string; discordId?: string; tracks?: string[] };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const email = String(b.email || "").toLowerCase().trim();
  const quizCode = String(b.quizCode || "").toUpperCase().trim();
  const discordId = String(b.discordId || "").trim();
  if (!Array.isArray(b.tracks)) return NextResponse.json({ ok: false, error: "need tracks[]" }, { status: 400 });
  if (!email.includes("@") && !quizCode && !discordId) {
    return NextResponse.json({ ok: false, error: "need email, quizCode, or discordId" }, { status: 400 });
  }
  // Normalize: trim, drop blanks, de-dupe, cap length.
  const tracks = Array.from(new Set(b.tracks.map((t) => String(t).trim()).filter(Boolean))).slice(0, 12);
  try {
    // Match by ANY identifier — clobbered docs can lose their email but keep a quizCode /
    // discordId, so email-only matching silently misses them. Union across all matches.
    const refs = new Map<string, FirebaseFirestore.DocumentReference>();
    if (email.includes("@")) (await coll("customers").where("email", "==", email).get()).forEach((d) => refs.set(d.id, d.ref));
    if (quizCode) (await coll("customers").where("quizCode", "==", quizCode).get()).forEach((d) => refs.set(d.id, d.ref));
    if (discordId) (await coll("customers").where("discordId", "==", discordId).get()).forEach((d) => refs.set(d.id, d.ref));
    if (!refs.size) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });
    const now = new Date().toISOString();
    // Write BOTH shapes: `tracks` (array, for the roster display) AND `track` (singular
    // string) — the quiz/access layer (lib/access.ts) reads the SINGULAR `track` via
    // substring match, and the roster falls back to it when the array is empty. Writing
    // only the array left the stale singular field silently granting access. Join with
    // " + " so the substring matcher still sees each cert name.
    const trackStr = tracks.join(" + ") || "General Access";
    for (const ref of refs.values()) {
      await ref.set({ tracks, track: trackStr, tracksEditedAt: now, tracksEditedBy: admin.name }, { merge: true });
    }
    return NextResponse.json({ ok: true, tracks, docs: refs.size });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
