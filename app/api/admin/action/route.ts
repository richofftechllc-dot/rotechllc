import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/action — the CRM tells the bot to do something.
// Writes a doc to Firestore `botCommands`; the bot polls + executes it (see botcommands.js).
// Types: dm | broadcast | addTrack | invoice (COACHES, ≤$300 off) | teamPing
//
// This is how the CRM "does everything the bot can do" without holding the
// Discord/Square credentials itself.
// Invoicing is coach-accessible (mirrors the Discord !invoice flow) — attribution +
// the $300 discount cap are enforced bot-side by coachinvoice. No owner-only types today.
const OWNER_ONLY = new Set<string>([]);

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  let body: { type?: string; payload?: Record<string, unknown>; sendAt?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }
  const type = String(body.type || "");
  if (!type) return NextResponse.json({ ok: false, error: "missing type" }, { status: 400 });

  // Sensitive actions (invoices) are owner-only — gate to Randy's Discord ID.
  if (OWNER_ONLY.has(type) && admin.discordId !== (process.env.RANDY_DISCORD_ID || "").trim()) {
    return NextResponse.json({ ok: false, error: "owner_only" }, { status: 403 });
  }

  try {
    const ref = await coll("botCommands").add({
      type,
      payload: body.payload || {},
      status: "pending",
      // Optional scheduled send — the bot leaves the command pending until this ISO time
      // (e.g. a 7am community-meeting announcement) instead of firing on the next tick.
      ...(body.sendAt ? { sendAt: String(body.sendAt) } : {}),
      requestedBy: admin.discordId,
      requestedByName: admin.name,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
