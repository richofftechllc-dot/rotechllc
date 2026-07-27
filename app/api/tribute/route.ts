import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import { promptById, type TributeDoc } from "@/lib/tribute";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── POST /api/tribute ── PUBLIC. Save one tribute's metadata.
// Video bytes went straight to Mux (see /api/tribute/upload); this only records who said
// what and which Mux upload it belongs to.
export async function POST(req: Request) {
  let body: {
    name?: string; city?: string; promptId?: string; text?: string;
    kind?: string; muxUploadId?: string; consentPublic?: boolean;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  const name = String(body.name || "").trim().slice(0, 80);
  const city = String(body.city || "").trim().slice(0, 80);
  const text = String(body.text || "").trim().slice(0, 4000);
  const kind = body.kind === "video" ? "video" : "text";

  if (!name) return NextResponse.json({ ok: false, error: "Add your name so Bo knows who this is." }, { status: 400 });
  if (!promptById(String(body.promptId))) return NextResponse.json({ ok: false, error: "Pick a prompt first." }, { status: 400 });
  // Consent is explicit and required — these clips may be shown publicly or used in a
  // documentary, so an unchecked box must block the submission, not be assumed.
  if (body.consentPublic !== true) {
    return NextResponse.json({ ok: false, error: "Tick the box so we can share it." }, { status: 400 });
  }
  if (kind === "video" && !body.muxUploadId) {
    return NextResponse.json({ ok: false, error: "The upload didn't finish — try again." }, { status: 400 });
  }
  if (kind === "text" && !text) {
    return NextResponse.json({ ok: false, error: "Write something first." }, { status: 400 });
  }

  try {
    const doc: Omit<TributeDoc, "id"> = {
      name, promptId: String(body.promptId), kind,
      consentPublic: true,
      createdAt: new Date().toISOString(),
      ...(city ? { city } : {}),
      ...(text ? { text } : {}),
      ...(kind === "video" ? { muxUploadId: String(body.muxUploadId), status: "uploading" } : {}),
    };
    const ref = await coll("tributes").add(doc);
    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    console.error("[tribute POST]", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "Couldn't save that — try again." }, { status: 500 });
  }
}

// ── GET /api/tribute ── OWNER/COACH ONLY. The review list.
// Resolves each "uploading" row against Mux so a submission flips to ready (and gains its
// playbackId + MP4 link) without a webhook. Cheap: only unresolved rows are looked up.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const snap = await coll("tributes").orderBy("createdAt", "desc").limit(300).get();
    const rows: TributeDoc[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TributeDoc, "id">) }));

    const id = process.env.MUX_TOKEN_ID;
    const secret = process.env.MUX_TOKEN_SECRET;
    if (id && secret) {
      const auth = Buffer.from(`${id}:${secret}`).toString("base64");
      const pending = rows.filter((r) => r.kind === "video" && r.muxUploadId && !r.muxPlaybackId);
      await Promise.all(
        pending.map(async (r) => {
          try {
            const up = await fetch(`https://api.mux.com/video/v1/uploads/${r.muxUploadId}`, {
              headers: { Authorization: `Basic ${auth}` },
            });
            if (!up.ok) return;
            const assetId = ((await up.json()) as { data?: { asset_id?: string } }).data?.asset_id;
            if (!assetId) return;
            const as = await fetch(`https://api.mux.com/video/v1/assets/${assetId}`, {
              headers: { Authorization: `Basic ${auth}` },
            });
            if (!as.ok) return;
            const a = ((await as.json()) as {
              data?: { status?: string; playback_ids?: { id: string }[] };
            }).data;
            const playbackId = a?.playback_ids?.[0]?.id;
            const patch = {
              muxAssetId: assetId,
              status: a?.status || "unknown",
              ...(playbackId ? { muxPlaybackId: playbackId } : {}),
            };
            await coll("tributes").doc(r.id).update(patch);
            Object.assign(r, patch);
          } catch { /* leave it pending; the next load retries */ }
        })
      );
    }

    return NextResponse.json({ ok: true, tributes: rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
