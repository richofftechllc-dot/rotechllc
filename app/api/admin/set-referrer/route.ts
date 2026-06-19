import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/set-referrer — coach records who referred a member.
// Body: { quizCode? , email?, referredBy }  → writes referredBy onto the customer doc,
// which the Referrals tab rolls up into payout owed.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { quizCode?: string; email?: string; referredBy?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const referredBy = String(body.referredBy || "").slice(0, 80);

  try {
    let q;
    if (body.quizCode) q = await coll("customers").where("quizCode", "==", body.quizCode).limit(1).get();
    else if (body.email) q = await coll("customers").where("email", "==", body.email).limit(1).get();
    else return NextResponse.json({ ok: false, error: "need quizCode or email" }, { status: 400 });
    if (q.empty) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });
    await q.docs[0].ref.set({ referredBy, referredBySetBy: admin.name, referredByAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
