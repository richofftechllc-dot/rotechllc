"use client";
import { useCallback, useEffect, useState } from "react";
import { promptById, type TributeDoc } from "@/lib/tribute";

// /bo30/wall — OWNER/COACH ONLY review page. Not linked from anywhere public.
//
// Every video row exposes two links on purpose:
//   • the MP4 — this is the one to hand Opus Clip or drop into Descript
//   • the stream — quick in-page playback without downloading
// Mux serves both off the playback id, so nothing is stored on our side but metadata.

const MP4 = (pid: string) => `https://stream.mux.com/${pid}/capped-1080p.mp4`;
const HLS = (pid: string) => `https://stream.mux.com/${pid}.m3u8`;

export default function TributeWall() {
  const [rows, setRows] = useState<TributeDoc[] | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/tribute");
      const d = await r.json();
      if (!d.ok) return setError(d.error === "forbidden" ? "Coach sign-in required. Log in at /login first." : d.error);
      setRows(d.tributes);
    } catch {
      setError("Couldn't load tributes.");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied(""), 1500);
    } catch { /* clipboard blocked — the link is visible to select by hand */ }
  }

  const videos = rows?.filter((r) => r.kind === "video") ?? [];
  const notes = rows?.filter((r) => r.kind === "text") ?? [];
  const ready = videos.filter((v) => v.muxPlaybackId).length;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-black mb-1">Birthday tributes</h1>
      <p className="text-rot-faint text-sm mb-8">
        Private. Share <span className="font-mono text-rot-muted">rotechllc.com/bo30</span> to collect more.
        {rows && ` · ${videos.length} video${videos.length === 1 ? "" : "s"} (${ready} ready) · ${notes.length} written`}
      </p>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}
      {!rows && !error && <p className="text-rot-faint text-sm">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-rot-faint text-sm">Nothing yet. Send the link out.</p>}

      {videos.length > 0 && (
        <>
          <h2 className="text-xs uppercase tracking-widest text-rot-accent font-bold mb-3">Video</h2>
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            {videos.map((t) => (
              <div key={t.id} className="bg-rot-surface border border-rot-line rounded-2xl overflow-hidden">
                {t.muxPlaybackId ? (
                  // Native video on the HLS url — Safari plays it directly, and Chrome
                  // falls back to the MP4 source below it.
                  <video controls playsInline preload="metadata" className="w-full aspect-video bg-rot-bg">
                    <source src={HLS(t.muxPlaybackId)} type="application/x-mpegURL" />
                    <source src={MP4(t.muxPlaybackId)} type="video/mp4" />
                  </video>
                ) : (
                  <div className="aspect-video bg-rot-sunken grid place-items-center text-rot-faint text-sm text-center px-4">
                    {t.status === "errored" ? "Upload failed" : "Still processing — reload in a minute"}
                  </div>
                )}
                <div className="p-4">
                  <div className="font-bold">{t.name}{t.city ? <span className="text-rot-faint font-normal"> · {t.city}</span> : null}</div>
                  <div className="text-rot-accent text-xs mt-0.5">{promptById(t.promptId)?.label || t.promptId}</div>
                  <div className="text-rot-faint text-[11px] mt-1">{new Date(t.createdAt).toLocaleString()}</div>
                  {t.muxPlaybackId && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button onClick={() => copy(MP4(t.muxPlaybackId!), t.id)}
                        className="text-[11px] px-2.5 py-1 rounded border border-rot-line-strong text-rot-fg hover:bg-rot-sunken">
                        {copied === t.id ? "Copied" : "Copy MP4 link (for Opus)"}
                      </button>
                      <a href={MP4(t.muxPlaybackId)} download
                        className="text-[11px] px-2.5 py-1 rounded border border-rot-line-strong text-rot-fg hover:bg-rot-sunken">
                        Download
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {notes.length > 0 && (
        <>
          <h2 className="text-xs uppercase tracking-widest text-rot-accent font-bold mb-3">Written</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {notes.map((t) => (
              <blockquote key={t.id} className="bg-rot-surface border border-rot-line rounded-2xl p-5">
                <p className="text-rot-fg text-sm whitespace-pre-wrap">{t.text}</p>
                <footer className="mt-3 text-xs">
                  <span className="font-bold text-rot-fg">{t.name}</span>
                  {t.city && <span className="text-rot-faint"> · {t.city}</span>}
                  <span className="text-rot-accent"> — {promptById(t.promptId)?.label || t.promptId}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
