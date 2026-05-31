import { NextRequest, NextResponse } from "next/server";
import { getAuthedCode } from "@/lib/session";
import { loadItems, saveItems, LineItem } from "@/lib/hubData";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_CODES = ["RANDY2026"];
const KNOWN_SLUGS = new Set(["jollof-and-jerk", "rendezvous-lounge", "gg-locks", "owed-to-eddie"]);

type AddPayload = { action: "add"; slug: string; item: { label: string; amount: number; kind: "once" | "monthly"; status: "pending" | "invoiced" | "paid" | "cancelled"; note?: string } };
type UpdatePayload = { action: "update"; slug: string; itemId: string; patch: Partial<Omit<LineItem, "id" | "createdAt">> };
type DeletePayload = { action: "delete"; slug: string; itemId: string };
type Payload = AddPayload | UpdatePayload | DeletePayload;

function newId(slug: string) {
  return `${slug.split("-")[0]}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36).slice(-4)}`;
}

export async function POST(req: NextRequest) {
  const code = await getAuthedCode(req);
  if (!code || !ADMIN_CODES.includes(code)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (!body.slug || !KNOWN_SLUGS.has(body.slug)) {
    return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 400 });
  }

  const current = await loadItems(body.slug);
  let next: LineItem[];

  if (body.action === "add") {
    const it = body.item;
    if (!it?.label || typeof it.amount !== "number" || it.amount < 0 || !["once", "monthly"].includes(it.kind) || !["pending", "invoiced", "paid", "cancelled"].includes(it.status)) {
      return NextResponse.json({ ok: false, error: "bad_item" }, { status: 400 });
    }
    next = [...current, {
      id: newId(body.slug),
      label: String(it.label).slice(0, 80),
      amount: Math.round(it.amount),
      kind: it.kind,
      status: it.status,
      note: it.note ? String(it.note).slice(0, 120) : undefined,
      createdAt: new Date().toISOString(),
    }];
  } else if (body.action === "update") {
    next = current.map(i => i.id === body.itemId ? { ...i, ...body.patch } : i);
  } else if (body.action === "delete") {
    next = current.filter(i => i.id !== body.itemId);
  } else {
    return NextResponse.json({ ok: false, error: "bad_action" }, { status: 400 });
  }

  try {
    await saveItems(body.slug, next);
    revalidatePath("/hub");
    return NextResponse.json({ ok: true, items: next });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "save_failed", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
