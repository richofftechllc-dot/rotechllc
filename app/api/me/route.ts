import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

function verify(token: string | undefined): string | null {
  if (!token || !SESSION_SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [code, sig] = parts;
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(code).digest("hex");
  if (sig !== expected) return null;
  return code;
}

export async function GET(req: NextRequest) {
  const code = verify(req.cookies.get("rot_session")?.value);
  if (!code) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    const snap = await db.collection("customers").where("quizCode", "==", code).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false }, { status: 401 });
    const c = snap.docs[0].data();
    return NextResponse.json({
      ok: true,
      code,
      name: c.name || c.firstName || "Member",
      track: c.track || null,
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
