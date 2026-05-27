import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("rot_session", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookies.set("rot_code", "", { path: "/", maxAge: 0 });
  return res;
}
