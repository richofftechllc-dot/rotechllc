import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/session-cookie";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  // Clear with the SAME domain scope it was set with, or the .rotechllc.com cookie survives.
  res.cookies.set("rot_session", "", sessionCookieOptions(req.headers.get("host"), 0));
  res.cookies.set("rot_code", "", { path: "/", maxAge: 0 });
  return res;
}
