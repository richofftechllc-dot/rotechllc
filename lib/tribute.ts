// lib/tribute.ts — shared types + prompt templates for the Bo-30 tribute wall (/bo30).
//
// WHY MUX AND NOT A BUCKET: Firebase Storage is not provisioned on rot-system-7aef2
// (both candidate buckets 404), and pushing video through a Vercel function would hit the
// ~4.5 MB request-body ceiling. Mux is already wired for the lesson videos, so the browser
// PUTs straight to a Mux direct-upload URL: no new dependency, no function-size limit, any
// phone format is accepted and transcoded, and each asset yields BOTH a playback id and a
// downloadable MP4 — which is exactly what Opus Clip needs to ingest.
//
// Firestore only ever stores metadata plus the Mux ids. No video bytes in the database.

export type TributeMood = "happy" | "funny" | "real" | "advice" | "story";

export type TributePrompt = {
  id: string;
  mood: TributeMood;
  label: string;
  /** Shown while recording, so nobody freezes staring at their own face. */
  teleprompter: string;
};

// Five prompts, deliberately. Enough to spark something specific, few enough that nobody
// stalls choosing. Each teleprompter line is a sentence starter, not a script.
export const PROMPTS: TributePrompt[] = [
  {
    id: "met",
    mood: "story",
    label: "How we met",
    teleprompter:
      "Start with: “I met Bo when…” — where you were, what you needed, what he did.",
  },
  {
    id: "funny",
    mood: "funny",
    label: "A memory that still makes me laugh",
    teleprompter:
      "Set the scene in one line, then tell it. Don’t explain the joke — just tell what happened.",
  },
  {
    id: "taught",
    mood: "real",
    label: "Something you taught me",
    teleprompter:
      "One thing he said or did that changed how you move. What were you doing before, and after?",
  },
  {
    id: "advice",
    mood: "advice",
    label: "Real talk / advice for his 30s",
    teleprompter:
      "Talk straight to him. What should he keep doing, and what should he let go of at 30?",
  },
  {
    id: "hbd",
    mood: "happy",
    label: "Just happy birthday",
    teleprompter:
      "Say your name, where you’re from, and what you want for him this year. Twenty seconds is plenty.",
  },
];

export function promptById(id: string): TributePrompt | undefined {
  return PROMPTS.find((p) => p.id === id);
}

// Hard cap. 90s at the bitrate the recorder requests lands around 12-14 MB, which uploads
// fine on a phone connection and keeps Mux encoding minutes sane across a few hundred
// submissions. It is also about the longest clip anyone will actually watch.
export const MAX_SECONDS = 90;

export type TributeDoc = {
  id: string;
  name: string;
  city?: string;
  promptId: string;
  /** Typed tribute. Always present when kind === "text"; optional caption otherwise. */
  text?: string;
  kind: "video" | "text";
  /** Mux ids — only for kind === "video". */
  muxUploadId?: string;
  muxAssetId?: string;
  muxPlaybackId?: string;
  /** "uploading" | "ready" | "errored" — mirrors the Mux asset lifecycle. */
  status?: string;
  /** Explicit, recorded consent to be shown publicly / used in a documentary. */
  consentPublic: boolean;
  createdAt: string;
};
