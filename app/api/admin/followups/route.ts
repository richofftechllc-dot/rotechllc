import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Follow-ups = action items, mostly created from completed calls (the bot writes them
// into `crmFollowups` when Fireflies finishes a transcript). Coaches self-assign,
// leave notes, and mark them done — a lightweight ServiceNow-style queue.

// GET /api/admin/followups — list, newest first.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  try {
    const snap = await coll("crmFollowups").limit(500).get();
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
    items.sort((a, b) => String((b as { createdAt?: string }).createdAt || "").localeCompare(String((a as { createdAt?: string }).createdAt || "")));
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}

// POST /api/admin/followups — { action, id?, title?, memberEmail?, note?, status? }
// actions: create | assign (to me) | note (append) | status (open/done)
export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const action = String(body.action || "");
  const nowISO = new Date().toISOString();
  try {
    if (action === "create") {
      const ref = await coll("crmFollowups").add({
        title: String(body.title || "Follow-up").slice(0, 200),
        memberEmail: String(body.memberEmail || "").slice(0, 160),
        source: String(body.source || "manual"),
        status: "open",
        assignedTo: String(body.assignedTo || "").slice(0, 60),
        ...(body.assignedTo ? { assignedAt: nowISO } : {}),
        notes: body.note ? [{ by: admin.name, text: String(body.note).slice(0, 1000), at: nowISO }] : [],
        createdBy: admin.name,
        createdAt: nowISO,
      });
      return NextResponse.json({ ok: true, id: ref.id });
    }

    const id = String(body.id || "");
    if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });
    const ref = coll("crmFollowups").doc(id);

    if (action === "assign") {
      await ref.update({ assignedTo: admin.name, assignedAt: nowISO });
    } else if (action === "note") {
      const note = { by: admin.name, text: String(body.note || "").slice(0, 1000), at: nowISO };
      const doc = await ref.get();
      const rawPrev = (doc.data() as { notes?: unknown })?.notes;
      const prev = Array.isArray(rawPrev) ? rawPrev : [];
      await ref.update({ notes: [...prev, note] });
    } else if (action === "status") {
      const status = body.status === "done" ? "done" : "open";
      await ref.update({ status, ...(status === "done" ? { doneBy: admin.name, doneAt: nowISO } : {}) });
    } else if (action === "delete") {
      // SOFT delete — never actually remove the doc, so nothing can disappear.
      await ref.update({ archived: true, archivedBy: admin.name, archivedAt: nowISO });
    } else if (action === "restore") {
      await ref.update({ archived: false, restoredAt: nowISO });
    } else {
      return NextResponse.json({ ok: false, error: "unknown_action" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
