import { NextRequest, NextResponse } from "next/server";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

async function verify(token: string | undefined): Promise<boolean> {
  if (!token || !SESSION_SECRET) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [code, sig] = parts;
  if (!code || !sig) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(code));
  const expected = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return sig === expected;
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("rot_session")?.value;
  if (await verify(token)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/quiz/:path*", "/roster/:path*", "/account/:path*"],
};
