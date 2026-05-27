import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";

async function getCode(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get("rot_session")?.value;
  const secret = process.env.SESSION_SECRET;
  if (!token || !secret) return null;
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const expected = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const parts = payload.split(":");
    const discordId = parts[1];
    if (!discordId) return null;
    try {
      const snap = await coll("customers").where("discordId", "==", discordId).limit(1).get();
      if (snap.empty) return null;
      return (snap.docs[0].data().quizCode as string) || null;
    } catch { return null; }
  }
  return payload;
}

export async function GET(req: NextRequest) {
  const code = await getCode(req);
  if (!code) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const doc = await coll("quizProgress").doc(code).get();
    const data = doc.exists ? doc.data() : null;
    return NextResponse.json({ progress: data?.progress || null });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const code = await getCode(req);
  if (!code) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    // Old quiz schema exact: { progress: <flat-map-of-prefixed-domain-keys>, updatedAt }
    // Body shape: { secplus_sp1: {completed, highScore}, csa_csa1: {...}, ai_ai1: {...} }
    // merge:true deep-merges into existing progress map - preserves old entries
    await coll("quizProgress").doc(code).set({
      progress: body,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
