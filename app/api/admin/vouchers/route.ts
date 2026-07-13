import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Voucher inventory (Firestore `vouchers`). Tracks exam vouchers ROT buys (e.g. from GC4L)
// and hands to coaches to distribute to clients — so nothing gets lost like a Zelle payment.
// A voucher moves: available → assigned (to a coach) → given (to a client) → used.
type Voucher = {
  code: string; cert: string; expiry?: string;
  assignedTo?: string;   // coach holding it (e.g. "Daquan")
  forClient?: string;    // client it was handed to
  status: "available" | "assigned" | "given" | "used";
  source?: string;       // e.g. "GC4L order #3017714"
  addedBy?: string; at?: string; updatedAt?: string;
};

export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("vouchers").get();
    const vouchers = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Voucher) }))
      .sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
    return NextResponse.json({ ok: true, vouchers });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST: add a voucher, OR update one (pass id + fields). Coach/owner gated.
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let b: Partial<Voucher> & { id?: string };
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const STATUSES = ["available", "assigned", "given", "used"];
  try {
    // Update an existing voucher (status change / assign to a client).
    if (b.id) {
      const patch: Record<string, unknown> = { updatedAt: new Date().toISOString() };
      if (b.status && STATUSES.includes(b.status)) patch.status = b.status;
      if (b.assignedTo !== undefined) patch.assignedTo = String(b.assignedTo).slice(0, 60);
      if (b.forClient !== undefined) patch.forClient = String(b.forClient).slice(0, 80);
      await coll("vouchers").doc(b.id).set(patch, { merge: true });
      return NextResponse.json({ ok: true, id: b.id });
    }
    // Add a new voucher.
    const code = String(b.code || "").trim();
    if (!code) return NextResponse.json({ ok: false, error: "code required" }, { status: 400 });
    const ref = await coll("vouchers").add({
      code,
      cert: String(b.cert || "").slice(0, 60) || "CompTIA",
      expiry: String(b.expiry || "").slice(0, 20),
      assignedTo: String(b.assignedTo || "").slice(0, 60),
      forClient: String(b.forClient || "").slice(0, 80),
      status: STATUSES.includes(String(b.status)) ? b.status : "available",
      source: String(b.source || "").slice(0, 80),
      addedBy: admin.name, at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
