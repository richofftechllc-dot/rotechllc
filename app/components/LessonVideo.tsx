"use client";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elOrId: string | HTMLElement,
        opts: {
          videoId?: string;
          host?: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { UNSTARTED: -1; ENDED: 0; PLAYING: 1; PAUSED: 2; BUFFERING: 3; CUED: 5 };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&#]+)/,
    /youtube\.com\/watch\?v=([^&#]+)/,
    /youtube\.com\/embed\/([^?#]+)/,
    /youtube\.com\/live\/([^?#]+)/,
    /youtube\.com\/shorts\/([^?#]+)/,
  ];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

let scriptLoadingPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;
  scriptLoadingPromise = new Promise<void>(resolve => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prevReady?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
  });
  return scriptLoadingPromise;
}

const PAUSE_DWELL_MS = 15_000;

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function LessonVideo({ url, domainId, domainName }: { url: string; domainId: string; domainName: string }) {
  const videoId = extractYouTubeId(url);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const [pausePromptOpen, setPausePromptOpen] = useState(false);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return;
      const player = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: e => {
            if (e.data === 2) {
              if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
              pauseTimerRef.current = window.setTimeout(() => setPausePromptOpen(true), PAUSE_DWELL_MS);
            } else {
              if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
              pauseTimerRef.current = null;
              setPausePromptOpen(false);
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="bg-zinc-950 border border-yellow-500/30 rounded-xl p-4 mb-6 text-sm text-yellow-200">
        Video link present but not a recognized YouTube URL: <code>{url}</code>
      </div>
    );
  }

  function openBoTech() {
    const t = playerRef.current?.getCurrentTime?.() || 0;
    const detail = {
      prefill: `I'm watching the ${domainName} lesson (${domainId}). I paused at ${fmtTime(t)} — `,
      context: { domainId, domainName, timestamp_sec: Math.round(t) },
    };
    window.dispatchEvent(new CustomEvent("bo-tech:open", { detail }));
    setPausePromptOpen(false);
  }

  return (
    <div className="relative mb-6">
      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {pausePromptOpen && (
        <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:max-w-sm bg-zinc-900 border border-orange-500/50 rounded-xl p-4 shadow-2xl">
          <div className="text-orange-500 font-bold tracking-widest text-[10px] mb-1">📍 BO NOTICED</div>
          <p className="text-sm text-white mb-3 leading-snug">Caught you stopping. What&apos;s the question? I&apos;ll answer in your sidebar.</p>
          <div className="flex gap-2">
            <button onClick={openBoTech} className="flex-1 px-3 py-2 bg-orange-500 text-black font-bold text-xs rounded">Ask Bo Tech →</button>
            <button onClick={() => setPausePromptOpen(false)} className="px-3 py-2 text-xs text-gray-400 hover:text-white">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}
