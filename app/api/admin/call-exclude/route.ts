import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/call-exclude — remove a call from the CRM. Records it in `callExcludes`
// so the bot's sync keeps it out, and deletes it from `allCalls` now for an instant effect.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { id?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false, error: "missing id" }, { status: 400 });
  try {
    await coll("callExcludes").doc(id).set({ excludedBy: admin.name, excludedAt: new Date().toISOString() });
    await coll("allCalls").doc(id).delete().catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
