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
  let b: { email?: string; tracks?: string[] };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const email = String(b.email || "").toLowerCase().trim();
  if (!email.includes("@")) return NextResponse.json({ ok: false, error: "need valid email" }, { status: 400 });
  if (!Array.isArray(b.tracks)) return NextResponse.json({ ok: false, error: "need tracks[]" }, { status: 400 });
  // Normalize: trim, drop blanks, de-dupe, cap length.
  const tracks = Array.from(new Set(b.tracks.map((t) => String(t).trim()).filter(Boolean))).slice(0, 12);
  try {
    const snap = await coll("customers").where("email", "==", email).get();
    if (snap.empty) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });
    const now = new Date().toISOString();
    for (const doc of snap.docs) {
      await doc.ref.set({ tracks, tracksEditedAt: now, tracksEditedBy: admin.name }, { merge: true });
    }
    return NextResponse.json({ ok: true, tracks, docs: snap.size });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
