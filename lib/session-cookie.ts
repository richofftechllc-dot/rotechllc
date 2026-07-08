// Shared cookie options for the `rot_session` cookie.
//
// WHY: Vercel 307-redirects the apex (rotechllc.com) → www.rotechllc.com. A cookie set
// without an explicit Domain is host-only, so a session set on one host isn't sent on the
// other — a member/coach who lands on the apex (bookmark, Discord link, OAuth start) logs
// in forever in a loop. Scoping the cookie to `.rotechllc.com` makes it span apex + www +
// any subdomain. On localhost (dev) we omit the domain so the cookie still works there.
export function sessionCookieOptions(host: string | null | undefined, maxAge: number) {
  const onProd = !!host && host.replace(/:\d+$/, "").endsWith("rotechllc.com");
  return {
    httpOnly: true as const,
    secure: true as const,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    ...(onProd ? { domain: ".rotechllc.com" } : {}),
  };
}
