"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROMPTS, MAX_SECONDS, type TributePrompt } from "@/lib/tribute";

// /bo30 — the page Randy sends people. Record a message for Bo's 30th, or type one.
//
// FLOW, kept to three screens on purpose: pick a prompt → record (or write) → send.
// The recording goes straight from the browser to a Mux direct-upload URL, so nothing
// large passes through a serverless function.
//
// If video isn't available (no camera permission, unsupported browser, or Mux not
// configured) the page falls back to typing instead of showing a dead recorder.

type Step = "pick" | "make" | "done";

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export default function Bo30() {
  const [step, setStep] = useState<Step>("pick");
  const [prompt, setPrompt] = useState<TributePrompt | null>(null);
  const [mode, setMode] = useState<"video" | "text">("video");

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCamReady(false);
  }, []);

  // Release the camera when the component goes away — a live capture light left on
  // after someone navigates off is alarming.
  useEffect(() => () => {
    stopTracks();
    if (tickRef.current) clearInterval(tickRef.current);
  }, [stopTracks]);

  async function openCamera() {
    setCamError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // 720p is plenty for a talking head and keeps the file small.
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamReady(true);
    } catch {
      setCamError("Couldn't reach your camera. You can type your message instead.");
      setMode("text");
    }
  }

  function pickMime(): string {
    // Safari only does mp4 here; Chrome/Firefox prefer webm. Pick what the browser admits
    // to supporting instead of assuming, or the recorder throws on iOS.
    const candidates = ["video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
    for (const c of candidates) if (MediaRecorder.isTypeSupported(c)) return c;
    return "";
  }

  function startRec() {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setBlob(null);
    setPreviewUrl(null);
    const mimeType = pickMime();
    const rec = new MediaRecorder(streamRef.current, {
      ...(mimeType ? { mimeType } : {}),
      // ~1.5 Mbps → roughly 12-14 MB for the full 90s. Uploads fine on a phone.
      videoBitsPerSecond: 1_500_000,
      audioBitsPerSecond: 96_000,
    });
    rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    rec.onstop = () => {
      const b = new Blob(chunksRef.current, { type: mimeType || "video/webm" });
      setBlob(b);
      setPreviewUrl(URL.createObjectURL(b));
    };
    recorderRef.current = rec;
    rec.start(1000);
    setRecording(true);
    setSeconds(0);
    tickRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) { stopRec(); return MAX_SECONDS; }
        return s + 1;
      });
    }, 1000);
  }

  function stopRec() {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    setRecording(false);
    try { recorderRef.current?.state !== "inactive" && recorderRef.current?.stop(); } catch { /* already stopped */ }
  }

  function retake() {
    setBlob(null);
    setPreviewUrl(null);
    setSeconds(0);
  }

  async function submit() {
    setError("");
    if (!name.trim()) return setError("Add your name so Bo knows who this is.");
    if (!consent) return setError("Tick the box so we can share it.");
    if (mode === "text" && !text.trim()) return setError("Write something first.");
    if (mode === "video" && !blob) return setError("Record something first, or switch to typing.");

    setBusy(true);
    setProgress(0);
    try {
      let muxUploadId: string | undefined;

      if (mode === "video" && blob) {
        const r = await fetch("/api/tribute/upload", { method: "POST" });
        const d = await r.json();
        if (!d.ok) {
          // Video path unavailable — don't lose what they recorded silently, tell them.
          setBusy(false);
          setMode("text");
          return setError("Video upload isn't available right now. Type your message and it'll send.");
        }
        muxUploadId = d.uploadId;
        await new Promise<void>((resolve, reject) => {
          // XHR, not fetch: it reports upload progress, and a 90-second clip on a phone
          // connection needs a visible bar or people assume it hung and leave.
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", d.uploadUrl, true);
          xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
          xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`upload ${xhr.status}`)));
          xhr.onerror = () => reject(new Error("network"));
          xhr.send(blob);
        });
      }

      const save = await fetch("/api/tribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, city, promptId: prompt?.id, text,
          kind: mode, muxUploadId, consentPublic: true,
        }),
      });
      const sd = await save.json();
      if (!save.ok || !sd.ok) throw new Error(sd.error || "save failed");

      stopTracks();
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong — try again.");
    } finally {
      setBusy(false);
    }
  }

  // ── DONE ────────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🤎</div>
        <h1 className="text-4xl font-black mb-4">That&apos;s in.</h1>
        <p className="text-rot-muted mb-8">
          Thank you. Bo is going to see this one. If you want to send another — a different
          memory, a different prompt — go right ahead.
        </p>
        <button
          onClick={() => { setStep("pick"); setPrompt(null); setBlob(null); setPreviewUrl(null); setText(""); setSeconds(0); setConsent(false); }}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90"
        >
          Send another
        </button>
      </main>
    );
  }

  // ── PICK A PROMPT ───────────────────────────────────────────────────────────
  if (step === "pick") {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">BO TURNS 30</div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
          Tell him something.
        </h1>
        <p className="text-rot-muted text-lg mb-10 max-w-xl">
          Funny, serious, mad, sentimental — it doesn&apos;t matter. Pick whatever you actually
          want to say. Takes about a minute.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPrompt(p); setStep("make"); if (mode === "video") openCamera(); }}
              className="text-left bg-rot-surface border border-rot-line rounded-2xl p-5 hover:border-orange-500/60 transition"
            >
              <div className="font-bold mb-1">{p.label}</div>
              <div className="text-rot-faint text-xs">{p.teleprompter}</div>
            </button>
          ))}
        </div>

        <p className="text-rot-faint text-sm">
          Record on camera, or type it if you&apos;d rather not be on video.
        </p>
      </main>
    );
  }

  // ── MAKE IT ─────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 md:py-16">
      <button onClick={() => { stopTracks(); setStep("pick"); }} className="text-rot-faint text-sm hover:text-rot-fg mb-6">
        ← pick a different prompt
      </button>

      <div className="bg-rot-accent/10 border border-rot-accent/30 rounded-xl px-5 py-4 mb-6">
        <div className="text-rot-accent text-xs font-bold uppercase tracking-wide mb-1">{prompt?.label}</div>
        <p className="text-rot-fg text-sm">{prompt?.teleprompter}</p>
      </div>

      {/* mode switch */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => { setMode("video"); if (!camReady) openCamera(); }}
          className={`text-sm px-4 py-2 rounded-lg font-semibold border ${mode === "video" ? "bg-rot-fg text-white border-white" : "border-rot-line-strong text-rot-muted hover:bg-rot-sunken"}`}
        >
          Record video
        </button>
        <button
          onClick={() => { setMode("text"); stopTracks(); }}
          className={`text-sm px-4 py-2 rounded-lg font-semibold border ${mode === "text" ? "bg-rot-fg text-white border-white" : "border-rot-line-strong text-rot-muted hover:bg-rot-sunken"}`}
        >
          Type it instead
        </button>
      </div>

      {mode === "video" && (
        <div className="mb-6">
          <div className="relative rounded-2xl overflow-hidden bg-rot-bg border border-rot-line aspect-video">
            {previewUrl ? (
              <video src={previewUrl} controls playsInline className="w-full h-full object-contain" />
            ) : (
              <video
                ref={videoRef}
                muted
                playsInline
                // Mirrored so it behaves like a mirror while you talk; the saved file is
                // NOT mirrored (this is a CSS transform on the preview only).
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
            {recording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-rot-sunken rounded-full px-3 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-rot-fg text-xs font-mono tabular-nums">
                  {fmt(seconds)} / {fmt(MAX_SECONDS)}
                </span>
              </div>
            )}
          </div>

          {camError && <p className="text-amber-400 text-sm mt-2">{camError}</p>}

          <div className="flex flex-wrap gap-2 mt-3">
            {!camReady && !previewUrl && (
              <button onClick={openCamera} className="px-5 py-2.5 rounded-lg bg-rot-fg text-white font-bold text-sm">
                Turn on camera
              </button>
            )}
            {camReady && !recording && !previewUrl && (
              <button onClick={startRec} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                Start recording
              </button>
            )}
            {recording && (
              <button onClick={stopRec} className="px-5 py-2.5 rounded-lg bg-red-600 text-rot-fg font-bold text-sm">
                Stop
              </button>
            )}
            {previewUrl && (
              <button onClick={retake} className="px-5 py-2.5 rounded-lg border border-rot-line-strong text-rot-fg font-semibold text-sm hover:bg-rot-sunken">
                Retake
              </button>
            )}
          </div>

          <p className="text-rot-faint text-xs mt-3">
            Up to {MAX_SECONDS} seconds. Tip: stand in front of a plain wall with a light in
            front of you — it makes the clip much easier to edit later.
          </p>
        </div>
      )}

      {mode === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Write it how you'd say it."
          className="w-full bg-rot-surface border border-rot-line rounded-xl px-4 py-3 text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none mb-6"
        />
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <input
          value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-rot-surface border border-rot-line rounded-xl px-4 py-3 text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
        <input
          value={city} onChange={(e) => setCity(e.target.value)}
          placeholder="Where you're from (optional)"
          className="w-full bg-rot-surface border border-rot-line rounded-xl px-4 py-3 text-rot-fg placeholder-rot-faint focus:border-rot-accent focus:outline-none"
        />
      </div>

      {/* Explicit consent. These clips may end up in a public edit or a documentary, so it
          has to be a deliberate tick — never a default or a buried line. */}
      <label className="flex gap-3 items-start text-sm text-rot-muted mb-6 cursor-pointer">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-orange-500 w-4 h-4" />
        <span>
          Bo can share this — post it, play it at the party, or use it in a video or
          documentary about ROT.
        </span>
      </label>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {busy && progress > 0 && progress < 100 && (
        <div className="mb-4">
          <div className="h-2 bg-rot-sunken rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-rot-faint text-xs mt-1">Uploading… {progress}% — keep this page open.</p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={busy}
        className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 uppercase tracking-wide"
      >
        {busy ? "Sending…" : "Send it to Bo"}
      </button>
    </main>
  );
}
