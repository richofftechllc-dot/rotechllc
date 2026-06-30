import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/book/me — prefill identity for the booking form from the session, so a
// logged-in member never re-types their name/email. Returns { ok:false } when there's
// no session (the /book page just falls back to manual entry — it stays public).
// Mirrors the session parsing in /api/me; do not fork the logic.

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
  if (!session) return NextResponse.json({ ok: false });
  try {
    let cust: Record<string, unknown> | null = null;
    if (session.type === "code") {
      const snap = await coll("customers").where("quizCode", "==", session.code).limit(1).get();
      if (!snap.empty) cust = snap.docs[0].data() as Record<string, unknown>;
    } else {
      const snap = await coll("customers").where("discordId", "==", session.userId).limit(1).get();
      if (!snap.empty) cust = snap.docs[0].data() as Record<string, unknown>;
    }
    const name = (cust?.name as string) || (cust?.firstName as string) || (session.type === "discord" ? session.name : "");
    const email = (cust?.email as string) || "";
    return NextResponse.json({ ok: true, name, email, authType: session.type });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
