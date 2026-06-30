// lib/access.ts — pure access logic shared by the quiz UI AND the video-token API.
// Single source of truth for "which track can this user reach". No Node-only imports
// here, so it is safe to import from client components (e.g. app/quiz/page.tsx).

// Map a customer's track string → the set of track prefixes they can access.
// This is the EXACT logic the quiz already uses — do not fork it.
//   sp = Security+ · csa = ServiceNow CSA · ai = AWS AI
export function allowedPrefixes(trackStr: string | null): Set<string> {
  // AWS AI Practitioner ("ai") is FREE for every member — always granted.
  // Security+ ("sp") and ServiceNow CSA ("csa") are PAID — they unlock only when the
  // member's track explicitly names them. An empty/unknown track no longer grants
  // everything (the old hole); it just gets the free AWS AI baseline.
  const out = new Set<string>(["ai"]);
  if (!trackStr) return out;
  const t = trackStr.toLowerCase();
  if (t.includes("full") || t.includes("admin") || t.includes("all access")) return new Set(["sp", "csa", "ai"]);
  if (t.includes("security+") || t.includes("sec+") || t.includes("comptia security")) out.add("sp");
  if (t.includes("servicenow") || t.includes("csa")) out.add("csa");
  return out;
}

// Normalize a lesson's requiredAccess into a prefix (sp | csa | ai), so docs can be
// authored with friendly values (secplus, csa, aws-ai) without messy matching later.
export function normalizeRequired(requiredAccess: string): string {
  const r = (requiredAccess || "").toLowerCase().trim();
  if (r === "sp" || r === "secplus" || r.includes("security") || r.includes("sec+")) return "sp";
  if (r === "csa" || r.includes("servicenow") || r.includes("csa")) return "csa";
  if (r === "ai" || r.includes("aws") || r.includes("ai")) return "ai";
  return r;
}

// Access decision for PAID VIDEO. Same prefix logic as the quiz, with one tightening:
// a null/empty track is DENIED (a track-less / Discord-only session must not unlock
// paid video). Returns true only if the user's track grants the lesson's required prefix.
export function accessAllows(track: string | null, requiredAccess: string): boolean {
  // AWS AI Practitioner video is free for everyone; CSA/Security+ need the paid track.
  // allowedPrefixes() always includes "ai" and never over-grants, so trust it directly
  // (a null/empty track resolves to AWS-AI-only, not "all").
  return allowedPrefixes(track).has(normalizeRequired(requiredAccess));
}

// Human labels per prefix, for tutor/member-facing copy.
const TRACK_LABEL: Record<string, string> = { ai: "AWS AI Practitioner", csa: "ServiceNow CSA", sp: "Security+" };

// One-paragraph access note injected into the AI tutors' system prompt so they only
// teach what the member has unlocked: AWS AI Practitioner + general career help is free;
// CSA / Security+ deep content is gated behind the paid track.
export function buildAccessNote(track: string | null): string {
  const has = allowedPrefixes(track);
  const have = [...has].map((p) => TRACK_LABEL[p]).filter(Boolean);
  const locked = (["csa", "sp"] as const).filter((p) => !has.has(p)).map((p) => TRACK_LABEL[p]);
  let note = `MEMBER ACCESS — this member can learn: ${have.join(", ")} (AWS AI Practitioner is free for every member).`;
  if (locked.length) {
    note += ` They have NOT unlocked: ${locked.join(", ")}. For those locked tracks you may answer a general question or explain a concept at a high level, but do NOT deliver the full paid curriculum, step-by-step labs, module walkthroughs, or exam-specific answers — instead encourage them to unlock that track at rotechllc.com. Always help freely with AWS AI Practitioner, resume, and general tech-career questions.`;
  }
  return note;
}
