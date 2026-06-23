import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Team group chat — the coaches (Randy, Tyler, Daquan) talk right inside the CRM.
// One doc per message in `crmChat`. Coach-gated by getAuthedAdmin like every admin route.

// GET /api/admin/chat — the latest messages (oldest→newest) + who you are.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("crmChat").orderBy("createdAt", "desc").limit(80).get();
    const messages = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      .reverse(); // back to chronological order
    const isOwner = admin.discordId === (process.env.RANDY_DISCORD_ID || "").trim();
    return NextResponse.json({ ok: true, messages, me: { ...admin, isOwner } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST /api/admin/chat — send a message, or delete one ({ delete: <id> }).
// Body: { text } | { delete: id }
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: { text?: string; delete?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  if (body.delete) {
    try { await coll("crmChat").doc(String(body.delete)).delete(); return NextResponse.json({ ok: true }); }
    catch (e) { return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 }); }
  }

  const text = String(body.text || "").trim().slice(0, 2000);
  if (!text) return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });

  try {
    await coll("crmChat").add({
      authorId: admin.discordId,
      authorName: admin.name,
      text,
      createdAt: new Date().toISOString(),
    });
    // Ping the other coaches in Discord so they actually see it (bot picks this up).
    await coll("botCommands").add({
      type: "teamPing",
      payload: { fromId: admin.discordId, fromName: admin.name, text },
      status: "pending",
      requestedBy: admin.discordId,
      requestedByName: admin.name,
      createdAt: new Date().toISOString(),
    }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
