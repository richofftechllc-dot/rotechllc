import { coll } from "@/lib/firebase";

// The ONE source of bookable times, shared with the Discord bot (scheduleSlots.js).
// A coach's availability lives in Firestore crmSchedule/<discordId> as
// { days: { Mon: "2pm–5pm ET", ... } }. Randy sets it in the CRM. The website /book page
// and /api/book read THESE ranges — the same ones Discord reads. No schedule = no slots.

const TZ = "America/New_York";
const ET_OFFSET = Number(process.env.BOOK_ET_OFFSET || 4); // EDT = UTC-4 (use 5 in winter)
const SLOT_MIN = 30;

// Coach key → Discord ID (the crmSchedule doc key). Mirrors the bot's COACHES list.
export const COACH_DISCORD_IDS: Record<string, string> = {
  randy: (process.env.RANDY_DISCORD_ID || "").trim(),
  tyler: (process.env.TYLER_DISCORD_ID || "1465828992014876834").trim(),
  daquan: (process.env.DAQUAN_DISCORD_ID || "694452462676869122").trim(),
};

export type Slot = { value: string; label: string };

function hourOf(t: string): number | null {
  const m = /^(\d{1,2})\s*(am|pm)$/i.exec(String(t || "").trim());
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[2])) h += 12;
  return h;
}

// "2pm–5pm ET" → { start: 14, end: 17 }. en-dash or hyphen. null if off/invalid.
function parseRange(dayStr: string | undefined): { start: number; end: number } | null {
  if (!dayStr) return null;
  const cleaned = String(dayStr).replace(/ET/gi, "").trim();
  const parts = cleaned.split(/[–—-]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  const start = hourOf(parts[0]);
  const end = hourOf(parts[1]);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
}

function etDateParts(offset: number): { y: string; mo: string; d: string; weekday: string } {
  const base = new Date(Date.now() + offset * 86400000);
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(base);
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short" }).format(base);
  const [y, mo, d] = ymd.split("-");
  return { y, mo, d, weekday };
}

// 30-min slots for one coach's schedule `offset` days out (0 = today).
export function slotsForOffset(daysMap: Record<string, string> | undefined, offset: number): Slot[] {
  const { y, mo, d, weekday } = etDateParts(offset);
  const range = parseRange(daysMap ? daysMap[weekday] : undefined);
  if (!range) return [];
  const off = String(ET_OFFSET).padStart(2, "0");
  const now = Date.now();
  const out: Slot[] = [];
  for (let h = range.start; h < range.end; h++) {
    for (const min of SLOT_MIN === 30 ? [0, 30] : [0]) {
      const value = `${y}-${mo}-${d}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00-${off}:00`;
      const t = Date.parse(value);
      if (!Number.isFinite(t) || t < now + 30 * 60000) continue;
      const label = new Date(value).toLocaleString("en-US", {
        timeZone: TZ, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      }) + " ET";
      out.push({ value, label });
    }
  }
  return out;
}

// Read a coach's `days` map from Firestore. {} if none set. Resolves by the stable
// coachKey first (works no matter how the doc is keyed on this host), then falls back to
// the coach's Discord ID and — for the owner — the literal "owner" doc key.
export async function coachDays(coachKey: string): Promise<Record<string, string>> {
  try {
    const q = await coll("crmSchedule").where("coachKey", "==", coachKey).limit(1).get();
    if (!q.empty) return ((q.docs[0].data() as { days?: Record<string, string> }).days) || {};
  } catch { /* fall through */ }
  const ids: string[] = [];
  if (COACH_DISCORD_IDS[coachKey]) ids.push(COACH_DISCORD_IDS[coachKey]);
  if (coachKey === "randy") ids.push("owner");
  for (const id of ids) {
    try {
      const snap = await coll("crmSchedule").doc(id).get();
      if (snap.exists) return ((snap.data() as { days?: Record<string, string> }).days) || {};
    } catch { /* next */ }
  }
  return {};
}

// A coach's open slots across the next `days` days (for the website picker).
export async function coachSlots(coachKey: string, days = 7): Promise<Slot[]> {
  const map = await coachDays(coachKey);
  const out: Slot[] = [];
  for (let o = 0; o < days; o++) out.push(...slotsForOffset(map, o));
  return out;
}

// Is `iso` a real bookable slot for this coach within the next `days` days?
export async function isValidSlot(coachKey: string, iso: string, days = 8): Promise<boolean> {
  const map = await coachDays(coachKey);
  for (let o = 0; o < days; o++) {
    if (slotsForOffset(map, o).some((s) => s.value === iso)) return true;
  }
  return false;
}
