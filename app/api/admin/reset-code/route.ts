import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/reset-code  { email }
// Members log in with their quiz code (not a password), so regenerating it IS the
// "password reset". We migrate their quizProgress doc to the new code so scores carry over.
function genCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email) return NextResponse.json({ ok: false, error: "need email" }, { status: 400 });

    const snap = await coll("customers").where("email", "==", email.toLowerCase()).limit(1).get();
    if (snap.empty) return NextResponse.json({ ok: false, error: "member not found" }, { status: 404 });

    const docRef = snap.docs[0].ref;
    const oldCode = (snap.docs[0].data().quizCode as string) || "";
    const newCode = genCode();

    await docRef.update({ quizCode: newCode, quizCodeResetAt: Date.now(), quizCodeResetBy: admin.name });

    // Carry quiz progress over to the new code so the member keeps their scores.
    if (oldCode && oldCode !== newCode) {
      try {
        const prog = await coll("quizProgress").doc(oldCode).get();
        if (prog.exists) await coll("quizProgress").doc(newCode).set(prog.data() as Record<string, unknown>);
      } catch { /* progress migration is best-effort */ }
    }

    return NextResponse.json({ ok: true, quizCode: newCode });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
