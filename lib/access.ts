// lib/access.ts — pure access logic shared by the quiz UI AND the video-token API.
// Single source of truth for "which track can this user reach". No Node-only imports
// here, so it is safe to import from client components (e.g. app/quiz/page.tsx).

// Map a customer's track string → the set of track prefixes they can access.
// This is the EXACT logic the quiz already uses — do not fork it.
//   sp = Security+ · csa = ServiceNow CSA · ai = AWS AI
export function allowedPrefixes(trackStr: string | null): Set<string> {
  const all = new Set(["sp", "csa", "ai"]);
  const t = (trackStr || "").toLowerCase();
  // Admin / demo / all-access tracks see every track.
  if (t.includes("full") || t.includes("admin") || t.includes("all access") || t.includes("all-access")) return all;
  const out = new Set<string>();
  // FOUNDING PERK (first 100 members): the AWS AI Practitioner track is FREE for every
  // member. A blank / "General Access" / founding track = base founding → AWS AI only.
  out.add("ai");
  // Security+ and ServiceNow CSA are PAID add-on tracks — unlocked only when the member's
  // track string names them (bot stamps "... + Security+ Track" / "... + ServiceNow CSA Track").
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
  if (!track || !track.trim()) return false; // closes the "no track = all access" hole for video
  return allowedPrefixes(track).has(normalizeRequired(requiredAccess));
}
