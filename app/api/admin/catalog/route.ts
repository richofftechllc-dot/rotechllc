import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/catalog — the Square catalog (synced by the bot into `squareCatalog`),
// so the CRM can show every item/price as a clickable invoice option.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("squareCatalog").limit(500).get();
    const items = snap.docs
      .map((d) => {
        const c = d.data() as { name?: string; priceCents?: number | null };
        return { id: d.id, name: c.name || "Item", priceCents: typeof c.priceCents === "number" ? c.priceCents : null };
      })
      .filter((i) => i.priceCents && i.priceCents > 0) // only items with a price can be invoiced
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
