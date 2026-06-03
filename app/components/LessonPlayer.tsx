"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";

type State =
  | { status: "loading" }
  | { status: "locked"; msg: string }
  | { status: "error"; msg: string }
  | { status: "ready"; playbackId: string; token: string; title: string };

// Fetches a signed playback token from /api/video-token (which enforces the gate
// server-side) and renders the Mux player. Shows a locked state if access is denied.
export default function LessonPlayer({ lessonId }: { lessonId: string }) {
  const [s, setS] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    fetch("/api/video-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
    })
      .then(async (r) => {
        const data = await r.json().catch(() => ({}));
        if (!alive) return;
        if (r.ok && data.ok) {
          setS({ status: "ready", playbackId: data.playbackId, token: data.token, title: data.title || "" });
        } else if (r.status === 403) {
          setS({ status: "locked", msg: data.error || "This lesson isn't in your plan." });
        } else if (r.status === 401) {
          setS({ status: "locked", msg: "Log in with your access code to watch." });
        } else {
          setS({ status: "error", msg: data.error || "Couldn't load this video." });
        }
      })
      .catch(() => alive && setS({ status: "error", msg: "Network error — try again." }));
    return () => {
      alive = false;
    };
  }, [lessonId]);

  if (s.status === "loading") {
    return (
      <div className="aspect-video w-full grid place-items-center rounded-xl bg-zinc-900 text-gray-400">
        Loading…
      </div>
    );
  }

  if (s.status === "locked") {
    return (
      <div className="aspect-video w-full grid place-items-center rounded-xl border border-orange-500/30 bg-zinc-900 px-6 text-center">
        <div>
          <div className="mb-2 text-3xl">🔒</div>
          <p className="font-semibold text-orange-400">{s.msg}</p>
          <p className="mt-1 text-sm text-gray-500">DM Bo in Discord to unlock this track.</p>
        </div>
      </div>
    );
  }

  if (s.status === "error") {
    return (
      <div className="aspect-video w-full grid place-items-center rounded-xl bg-zinc-900 text-red-400">
        {s.msg}
      </div>
    );
  }

  return (
    <MuxPlayer
      playbackId={s.playbackId}
      tokens={{ playback: s.token }}
      streamType="on-demand"
      accentColor="#f97316"
      metadata={{ video_title: s.title }}
      style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: "0.75rem", overflow: "hidden" }}
    />
  );
}
