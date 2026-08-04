import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/tribute/upload → create a Mux DIRECT UPLOAD and hand the browser its URL.
//
// The browser PUTs the recording straight to Mux. It never passes through this function,
// which is the whole point — a Vercel function body caps out around 4.5 MB and a 90-second
// video is bigger than that.
//
// Returns { ok:true, uploadUrl, uploadId } on success. If Mux isn't configured this
// returns ok:false with `videoDisabled:true`, and the page silently falls back to
// text-only tributes rather than showing a broken recorder.
export async function POST() {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) {
    return NextResponse.json(
      { ok: false, videoDisabled: true, error: "video uploads are not configured" },
      { status: 200 }
    );
  }

  try {
    const auth = Buffer.from(`${id}:${secret}`).toString("base64");
    const res = await fetch("https://api.mux.com/video/v1/uploads", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // cors_origin must echo the site so the browser PUT is allowed.
        cors_origin: "https://www.rotechllc.com",
        new_asset_settings: {
          playback_policy: ["public"],
          // mp4_support gives us a plain downloadable MP4 per asset — that's the file
          // Opus Clip (and any editor) can ingest. Without it we'd only have HLS.
          mp4_support: "capped-1080p",
          passthrough: "bo30-tribute",
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[tribute/upload] mux create failed", res.status, detail.slice(0, 300));
      return NextResponse.json(
        { ok: false, videoDisabled: true, error: "could not start the upload" },
        { status: 200 }
      );
    }

    const data = (await res.json()) as { data?: { url?: string; id?: string } };
    if (!data.data?.url || !data.data?.id) {
      return NextResponse.json({ ok: false, videoDisabled: true, error: "bad upload response" }, { status: 200 });
    }
    return NextResponse.json({ ok: true, uploadUrl: data.data.url, uploadId: data.data.id });
  } catch (e) {
    console.error("[tribute/upload]", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, videoDisabled: true, error: "upload unavailable" }, { status: 200 });
  }
}
