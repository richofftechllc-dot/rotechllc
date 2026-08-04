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
  // /roster is public on purpose — recruiters and hiring managers need to browse without an account.
  // /hub is admin-only; middleware enforces a valid session, the page enforces the admin code.
  //
  // The two cert study plans are gated because they are PAID PRODUCT — a Security+ or
  // ServiceNow CSA buyer pays for the voucher, the coaching AND that roadmap. They used to
  // sit in public/ and were reachable by anyone who had or guessed the URL, which is the
  // same leak as listing them as a free download. Everything else in /resources stays
  // public: the FAQ, how-it-works and the AWS AI plan are lead magnets on purpose.
  //
  // A client who bought has a quiz code, so they log in and read it. That is the gate.
  // /book is members-only: a 1-on-1 is coaching time, and coaching time is what
  // membership buys. Prospects get the free qualifier agents on /help instead.
  matcher: [
    "/home", "/plan", "/plan/:path*", "/account", "/account/:path*",
    "/quiz/:path*", "/lab/:path*", "/hub", "/hub/:path*", "/book",
    "/resources/rot-secplus-study-plan.html",
    "/resources/rot-csa-study-plan.html",
  ],
};
