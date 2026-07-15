import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import { allowedPrefixes } from "@/lib/access";
import { TRACKS, LESSONS, LIVE_SESSION } from "@/lib/quizData";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SERVER-SIDE quiz gate. The client no longer imports quizData — it fetches this.
// Locked tracks return metadata ONLY (name/price/blurb) with ZERO questions in the
// payload, so a member can never see content for a track they didn't buy. Coaches
// (role-based, via getAuthedAdmin) get all three tracks.
const SESSION_SECRET = process.env.SESSION_SECRET || "";

// Upgrade-card copy for locked tracks. Buy links are the durable member-only cert links.
const LOCKED_META: Record<string, { name: string; price: string; blurb: string; buyUrl: string }> = {
  sp:  { name: "CompTIA Security+", price: "$901", blurb: "Voucher + guaranteed-pass coaching. Unlocks the full Security+ quiz track.", buyUrl: "https://square.link/u/Lh7MBczC" },
  csa: { name: "ServiceNow CSA", price: "$1,113", blurb: "Voucher + retake + coaching. Unlocks the full ServiceNow CSA quiz track.", buyUrl: "https://square.link/u/Gas5gOVh" },
  ai:  { name: "AWS AI Practitioner", price: "$227/yr", blurb: "Join founding to unlock the AWS AI track — free with membership.", buyUrl: "https://square.link/u/c8X7TC0z" },
};

function verify(token: string | undefined): { kind: "code"; code: string } | { kind: "discord"; userId: string } | null {
  if (!token || !SESSION_SECRET) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i), sig = token.slice(i + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const p = payload.split(":");
    return p.length === 3 ? { kind: "discord", userId: p[1] } : null;
  }
  return { kind: "code", code: payload };
}

export async function GET(req: NextRequest) {
  const sess = verify(req.cookies.get("rot_session")?.value);
  if (!sess) return NextResponse.json({ ok: false }, { status: 401 });

  let isCoach = false;
  try { isCoach = !!(await getAuthedAdmin(req)); } catch { isCoach = false; }

  // Resolve the member's track + tier server-side (never trust the client). Tier gates
  // the AWS AI founding perk: $27/mo (monthly) and free members don't get it.
  let track: string | null = null;
  let plan: string | null = null;
  let productType: string | null = null;
  try {
    const snap = sess.kind === "code"
      ? await coll("customers").where("quizCode", "==", sess.code).limit(1).get()
      : await coll("customers").where("discordId", "==", sess.userId).limit(1).get();
    if (!snap.empty) {
      const d = snap.docs[0].data();
      track = (d.track as string) || null;
      plan = (d.plan as string) || null;
      productType = (d.productType as string) || null;
    }
  } catch { /* fall through — no track */ }

  const allowed = isCoach ? new Set(["sp", "csa", "ai"]) : allowedPrefixes(track, { plan, productType });

  // Full content for allowed tracks; metadata-only cards for locked ones.
  const tracks = TRACKS.filter((t) => allowed.has(t.id));
  const lockedCards = TRACKS.filter((t) => !allowed.has(t.id)).map((t) => ({
    id: t.id, name: LOCKED_META[t.id]?.name || t.name,
    price: LOCKED_META[t.id]?.price || "", blurb: LOCKED_META[t.id]?.blurb || "",
    buyUrl: LOCKED_META[t.id]?.buyUrl || "",
  }));

  // Lessons only for allowed domain prefixes (keys look like ai1, csa3, sp2).
  const lessons: Record<string, string> = {};
  for (const [k, v] of Object.entries(LESSONS)) {
    const prefix = k.startsWith("sp") ? "sp" : k.startsWith("csa") ? "csa" : k.startsWith("ai") ? "ai" : "";
    if (allowed.has(prefix)) lessons[k] = v;
  }

  return NextResponse.json({ ok: true, isCoach, tracks, lockedCards, lessons, liveSession: LIVE_SESSION });
}
