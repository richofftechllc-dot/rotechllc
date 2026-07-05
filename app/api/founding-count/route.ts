import { coll } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// PAID founding count = size of the `customers` collection (a record is only written
// when someone actually pays — free Discord members are NOT in here). Every paid buyer
// (membership OR a cert/clearance track) counts toward the 100 founding cap.
// This is the single source of truth for "spots left" across the site, offer sheet, and Bo.
export async function GET() {
  try {
    // Comped members (given free access via RAC) never count toward the paid 100.
    const compedEmails = new Set<string>();
    try {
      const rac = await coll("members").limit(3000).get();
      rac.docs.forEach((d) => {
        const m = d.data() as { email?: string; accessTier?: string; status?: string };
        if ((m.accessTier === "comp" || m.status === "comp") && m.email) compedEmails.add(String(m.email).toLowerCase());
      });
    } catch { /* best-effort */ }

    const snap = await coll("customers").get();
    let paid = 0, canceled = 0, comped = 0;
    snap.docs.forEach((d) => {
      const c = d.data() as { paymentStatus?: string; status?: string; email?: string; purchaseDate?: string; lastPurchaseDate?: string; productType?: string; productTypes?: unknown[] };
      const st = (c.paymentStatus || c.status || "").toLowerCase();
      if (st === "canceled" || st === "refunded") { canceled++; return; }
      const email = String(c.email || "").toLowerCase();
      // Exclude comped/demo: an explicit RAC comp, a comp product, or a record with no
      // real purchase at all (hand-seeded access code).
      const isRealPayer = !!(c.purchaseDate || c.lastPurchaseDate || c.productType || (Array.isArray(c.productTypes) && c.productTypes.length));
      if (compedEmails.has(email) || c.productType === "comp" || !isRealPayer) { comped++; return; }
      paid++;
    });
    const cap = 100;
    return Response.json({ count: paid, total: snap.size, canceled, comped, cap, spotsLeft: Math.max(0, cap - paid), soldOut: paid >= cap });
  } catch (e) {
    return Response.json({ count: null, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
