import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/fix-email { fromEmail, toEmail } — correct a customer's email across ALL
// of their customer docs (handles duplicate records). Only touches the `email` field +
// leaves an audit trail; never deletes a doc (that would drop /api/founding-count).
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let b: { fromEmail?: string; toEmail?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const fromEmail = String(b.fromEmail || "").toLowerCase().trim();
  const toEmail = String(b.toEmail || "").toLowerCase().trim();
  if (!fromEmail.includes("@") || !toEmail.includes("@")) {
    return NextResponse.json({ ok: false, error: "need valid fromEmail + toEmail" }, { status: 400 });
  }
  try {
    const snap = await coll("customers").where("email", "==", fromEmail).get();
    const now = new Date().toISOString();
    const updated: string[] = [];
    for (const doc of snap.docs) {
      await doc.ref.set(
        { email: toEmail, emailCorrectedFrom: fromEmail, emailCorrectedAt: now, emailCorrectedBy: admin.name },
        { merge: true },
      );
      const d = doc.data() as { quizCode?: string; name?: string };
      updated.push(d.quizCode || d.name || doc.id);
    }
    return NextResponse.json({ ok: true, updated: updated.length, docs: updated });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
