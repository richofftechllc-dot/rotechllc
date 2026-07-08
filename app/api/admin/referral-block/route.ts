import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/referral-block  { email?, name?, blocked }
// Toggle whether a member can send referrals. Match by email (exact) or name (case-insensitive).
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { email?: string; name?: string; blocked?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const blocked = body.blocked !== false;
  try {
    let ref = null;
    if (body.email) {
      const s = await coll("customers").where("email", "==", body.email.toLowerCase()).limit(1).get();
      if (!s.empty) ref = s.docs[0].ref;
    }
    if (!ref && body.name) {
      // Name match — scan (small collection) for a case-insensitive exact-or-contains hit.
      const s = await coll("customers").limit(2000).get();
      const want = body.name.toLowerCase().trim();
      const doc = s.docs.find((d) => String((d.data() as { name?: string }).name || "").toLowerCase().trim() === want)
        || s.docs.find((d) => String((d.data() as { name?: string; discordTag?: string }).name || "").toLowerCase().includes(want)
          || String((d.data() as { discordTag?: string }).discordTag || "").toLowerCase().includes(want));
      if (doc) ref = doc.ref;
    }
    if (!ref) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });
    await ref.update({ referralBlocked: blocked, referralBlockedBy: admin.name, referralBlockedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, blocked });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
