import { NextResponse } from "next/server";
export const runtime = "nodejs";

// Clear the session in BOTH scopes: the legacy host-only cookie (set before the
// domain fix) AND the new .rotechllc.com-scoped cookie. Clearing only one leaves the
// other alive — which is why logout kept you signed in. We emit separate Set-Cookie
// headers because a cookie only clears when name+path+domain match exactly.
export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  const host = (req.headers.get("host") || "").replace(/:\d+$/, "");
  const onProd = host.endsWith("rotechllc.com");
  const clears = [
    "rot_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax",                        // host-only (legacy)
    ...(onProd ? ["rot_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax; Domain=.rotechllc.com"] : []),
    "rot_code=; Path=/; Max-Age=0",
  ];
  for (const c of clears) res.headers.append("Set-Cookie", c);
  return res;
}
