import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
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
  if (session.type === "discord") {
    return NextResponse.json({
      ok: true, code: null, name: session.name, track: null, authType: "discord",
    });
  }
  try {
    const snap = await coll("customers").where("quizCode", "==", session.code).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false }, { status: 401 });
    const c = snap.docs[0].data();
    return NextResponse.json({
      ok: true, code: session.code,
      name: c.name || c.firstName || "Member",
      track: c.track || null, authType: "code",
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
