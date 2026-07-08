import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/gen-referral-codes
// Generates a stable, URL-safe referral code (distinct from the login quizCode) for
// every eligible referrer that doesn't have one, so each gets a unique rotechllc.com/r/<code>.
function slug(name: string) {
  return (name || "member").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "member";
}
function suffix() {
  const c = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < 3; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("customers").limit(2000).get();
    const taken = new Set<string>();
    snap.docs.forEach((d) => { const rc = (d.data() as { referralCode?: string }).referralCode; if (rc) taken.add(rc); });

    let created = 0;
    for (const d of snap.docs) {
      const c = d.data() as { referralCode?: string; name?: string; firstName?: string };
      if (c.referralCode) continue;
      let code = slug(c.name || c.firstName || "member");
      while (taken.has(code)) code = slug(c.name || c.firstName || "member") + suffix();
      taken.add(code);
      await d.ref.update({ referralCode: code });
      created++;
    }
    return NextResponse.json({ ok: true, created });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
