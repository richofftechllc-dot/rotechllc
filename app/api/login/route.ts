import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import crypto from "crypto";

export const runtime = "nodejs";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

function sign(code: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  if (!SESSION_SECRET) {
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }
  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ ok: false, error: "Code required" }, { status: 400 });
    }
    const c = code.trim().toUpperCase();
    if (c.length < 4) {
      return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 401 });
    }
    // Owner master code — Randy gets a valid session with RANDY2026 without a customer
    // record. lib/admin.ts recognizes this same code as full CRM admin.
    const OWNER_CODE = (process.env.OWNER_LOGIN_CODE || "RANDY2026").toUpperCase();
    if (c === OWNER_CODE) {
      const sig = sign(c);
      const res = NextResponse.json({ ok: true, name: "Randy" });
      res.cookies.set("rot_session", c + "." + sig, {
        httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
    const snap = await coll("customers").where("quizCode", "==", c).limit(1).get();
    if (snap.empty) {
      return NextResponse.json({ ok: false, error: "Invalid code" }, { status: 401 });
    }
    const cust = snap.docs[0].data();
    const name = cust.name || cust.firstName || "Member";
    const sig = sign(c);
    const res = NextResponse.json({ ok: true, name });
    res.cookies.set("rot_session", c + "." + sig, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
