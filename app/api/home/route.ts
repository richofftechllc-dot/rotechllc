import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/home — everything a logged-in MEMBER needs for their Home dashboard,
// resolved from their session in ONE call: identity, access window, learning
// readiness (same math the coach CRM uses), and their upcoming 1-on-1s.
// Mirrors the session/firestore patterns in /api/me + /api/admin/members — do not fork the logic.

const SESSION_SECRET = process.env.SESSION_SECRET || "";

type Sess = { type: "code"; code: string } | { type: "discord"; userId: string; name: string };

function parseSession(token: string | undefined): Sess | null {
  if (!token || !SESSION_SECRET) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const parts = payload.split(":");
    if (parts.length !== 3) return null;
    return { type: "discord", userId: parts[1], name: Buffer.from(parts[2], "base64").toString("utf-8") };
  }
  return { type: "code", code: payload };
}

export async function GET(req: NextRequest) {
  const session = parseSession(req.cookies.get("rot_session")?.value);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  try {
    // Resolve the customer record (+ quizCode) from either session type.
    let cust: Record<string, unknown> | null = null;
    let code = "";
    if (session.type === "code") {
      code = session.code;
      const snap = await coll("customers").where("quizCode", "==", code).limit(1).get();
      if (!snap.empty) cust = snap.docs[0].data() as Record<string, unknown>;
    } else {
      const snap = await coll("customers").where("discordId", "==", session.userId).limit(1).get();
      if (!snap.empty) { cust = snap.docs[0].data() as Record<string, unknown>; code = (cust.quizCode as string) || ""; }
    }

    const name = (cust?.name as string) || (cust?.firstName as string) || (session.type === "discord" ? session.name : "Member");
    const email = String(cust?.email || "").toLowerCase();
    const tracks = (cust?.tracks as string[])?.length ? (cust!.tracks as string[]) : cust?.track ? [cust.track as string] : [];
    const track = tracks[0] || (cust?.track as string) || null;
    const certs = (cust?.certs as string[]) || [];

    // Access window (RAC enrichment by email) — same derivation as the coach CRM.
    let rac: Record<string, unknown> = {};
    if (email) {
      try {
        const racSnap = await coll("members").where("email", "==", email).limit(1).get();
        if (!racSnap.empty) rac = racSnap.docs[0].data() as Record<string, unknown>;
      } catch { /* enrichment best-effort */ }
    }
    const now = Date.now();
    const plan = (rac.billingCycle as string) || (cust?.billingCycle as string) || (cust?.plan as string) || "annual";
    let accessEnd = (rac.accessEndDate as string) || "";
    if (!accessEnd && cust?.purchaseDate) {
      const start = Date.parse(cust.purchaseDate as string);
      if (!isNaN(start)) accessEnd = new Date(start + (plan === "monthly" ? 30 : 365) * 86400000).toISOString();
    }
    const endMs = accessEnd ? Date.parse(accessEnd) : NaN;
    const daysLeft = !isNaN(endMs) ? Math.round((endMs - now) / 86400000) : null;
    const racStatus = rac.status as string | undefined;
    const accessStatus = racStatus === "comp" ? "comp"
      : racStatus === "canceled" ? "canceled"
      : daysLeft !== null && daysLeft < 0 ? "expired"
      : "active";

    // Learning readiness from quizProgress (same per-domain math as /api/admin/members).
    let progress = { done: 0, total: 0, avg: null as number | null, weak: [] as string[], strong: [] as string[] };
    let nextDomain: string | null = null;
    if (code) {
      try {
        const doc = await coll("quizProgress").doc(code).get();
        const raw = (doc.exists ? (doc.data() as { progress?: Record<string, { completed?: boolean; highScore?: number }> }).progress : null) || {};
        const entries = Object.entries(raw).map(([k, v]) => ({
          domain: k.replace(/^(secplus|csa|ai)_/, ""),
          highScore: typeof v?.highScore === "number" ? v.highScore : 0,
          completed: !!v?.completed,
        }));
        const scored = entries.filter((p) => p.completed || p.highScore > 0);
        progress = {
          total: entries.length,
          done: entries.filter((p) => p.completed).length,
          avg: scored.length ? Math.round(scored.reduce((s, p) => s + p.highScore, 0) / scored.length) : null,
          weak: entries.filter((p) => p.completed && p.highScore < 70).map((p) => p.domain),
          strong: entries.filter((p) => p.highScore >= 85).map((p) => p.domain),
        };
        nextDomain = entries.find((p) => !p.completed)?.domain ?? null;
      } catch { /* progress best-effort */ }
    }

    // This member's upcoming 1-on-1s (match the booking's userName to their name, best-effort).
    let bookings: { coach: string; slot: string; topic: string; label: string }[] = [];
    try {
      const snap = await coll("bookings").limit(300).get();
      const lname = name.toLowerCase();
      bookings = snap.docs
        .map((d) => {
          const b = d.data() as Record<string, unknown>;
          return {
            coach: (b.coachName as string) || (b.coach as string) || "",
            slot: (b.slot as string) || "",
            topic: (b.topic as string) || "",
            label: (b.label as string) || "",
            userName: ((b.userName as string) || "").toLowerCase(),
            status: (b.status as string) || "booked",
          };
        })
        .filter((b) => b.status !== "canceled" && b.userName && b.userName === lname && b.slot && Date.parse(b.slot) >= now - 3600_000)
        .sort((a, b) => Date.parse(a.slot) - Date.parse(b.slot))
        .map(({ coach, slot, topic, label }) => ({ coach, slot, topic, label }));
    } catch { /* bookings best-effort */ }

    // Is this logged-in person also a coach/admin? If so, Home offers a jump to the CRM.
    let isCoach = false;
    try { isCoach = !!(await getAuthedAdmin(req)); } catch { /* non-fatal */ }

    return NextResponse.json({
      ok: true,
      authType: session.type,
      isCoach,
      name,
      code: code || null,
      track,
      tracks,
      certs,
      hasCustomer: !!cust,
      access: { status: accessStatus, daysLeft, accessEnd, plan },
      progress,
      nextDomain,
      bookings,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
