import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/ig-latest — the most recent IG drafts (image + caption) the bot generated,
// so the CRM can SHOW the graphic, not just send it to Discord.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("igDrafts").orderBy("ts", "desc").limit(8).get();
    const drafts = snap.docs.map((d) => {
      const c = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        imageUrl: (c.imageUrl as string) || "",
        caption: (c.caption as string) || "",
        headline: (c.headline as string) || "",
        status: (c.status as string) || "pending",
        at: (c.at as string) || "",
      };
    }).filter((d) => d.imageUrl);
    return NextResponse.json({ ok: true, drafts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
