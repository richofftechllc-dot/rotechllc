import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

type Session =
  | { type: "code"; code: string }
  | { type: "discord"; userId: string; name: string };

function parseSession(token: string | undefined): Session | null {
  if (!token || !SESSION_SECRET) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const parts = payload.split(":");
    if (parts.length !== 3) return null;
    const name = Buffer.from(parts[2], "base64").toString("utf-8");
    return { type: "discord", userId: parts[1], name };
  }
  return { type: "code", code: payload };
}

export async function GET(req: NextRequest) {
  const session = parseSession(req.cookies.get("rot_session")?.value);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  // Coach flag reuses the SAME detection the CRM uses (ROT Coach role / owner code /
  // admin allowlist) — role-based, never a special quiz code. Coaches → all tracks.
  let isCoach = false;
  try { isCoach = !!(await getAuthedAdmin(req)); } catch { isCoach = false; }

  if (session.type === "discord") {
    // Resolve their member record by Discord ID so Discord logins get their real track
    // (previously always null → wrongly fell through to full access).
    try {
      const snap = await coll("customers").where("discordId", "==", session.userId).limit(1).get();
      const c = snap.empty ? null : snap.docs[0].data();
      return NextResponse.json({
        ok: true, code: (c?.quizCode as string) || null,
        name: c?.name || c?.firstName || session.name,
        track: (c?.track as string) || null, authType: "discord", isCoach,
      });
    } catch {
      return NextResponse.json({ ok: true, code: null, name: session.name, track: null, authType: "discord", isCoach });
    }
  }
  try {
    const snap = await coll("customers").where("quizCode", "==", session.code).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false }, { status: 401 });
    const c = snap.docs[0].data();
    return NextResponse.json({
      ok: true, code: session.code,
      name: c.name || c.firstName || "Member",
      track: c.track || null, authType: "code", isCoach,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
