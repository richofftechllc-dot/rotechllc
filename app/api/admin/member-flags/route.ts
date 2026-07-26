import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/member-flags  { email, voucherPurchased?, resumeNeeded? }
//
// Coach toggles for the two Birthday Drop follow-through flags on a customers doc:
//   voucherPurchased — has the exam voucher actually been bought from GC4L yet
//   resumeNeeded     — the member sent a resume and it still needs rebuilding
//
// The bot seeds both to false on a birthday-drop purchase and flips resumeNeeded to
// true when a resume comes in through the Discord intake; this route is how a coach
// flips them from the CRM. Only the flags named in the body are written, so toggling
// one can never blank the other.
const FLAGS = ["voucherPurchased", "resumeNeeded"] as const;
type Flag = (typeof FLAGS)[number];

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { email?: string } & Partial<Record<Flag, boolean>>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  if (!body.email) return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  for (const f of FLAGS) {
    if (typeof body[f] === "boolean") {
      patch[f] = body[f];
      // Audit trail — who flipped it and when, same shape as referral-block.
      patch[`${f}By`] = admin.name;
      patch[`${f}At`] = new Date().toISOString();
    }
  }
  if (!Object.keys(patch).length) {
    return NextResponse.json({ ok: false, error: "no flag supplied" }, { status: 400 });
  }

  try {
    const s = await coll("customers").where("email", "==", body.email.toLowerCase()).limit(1).get();
    if (s.empty) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });
    await s.docs[0].ref.update(patch);
    return NextResponse.json({ ok: true, patch });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
