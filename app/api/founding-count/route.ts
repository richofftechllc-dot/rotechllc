import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PAID founding count = size of the `customers` collection (a record is only written
// when someone actually pays — free Discord members are NOT in here). Every paid buyer
// (membership OR a cert/clearance track) counts toward the 100 founding cap.
// This is the single source of truth for "spots left" across the site, offer sheet, and Bo.
export async function GET() {
  try {
    const snap = await coll("customers").get();
    let paid = 0, canceled = 0;
    snap.docs.forEach((d) => {
      const c = d.data() as { paymentStatus?: string; status?: string; rolesAssigned?: boolean };
      const st = (c.paymentStatus || c.status || "").toLowerCase();
      if (st === "canceled" || st === "refunded") { canceled++; return; }
      paid++;
    });
    const cap = 100;
    return Response.json({ count: paid, total: snap.size, canceled, cap, spotsLeft: Math.max(0, cap - paid), soldOut: paid >= cap });
  } catch (e) {
    return Response.json({ count: null, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
