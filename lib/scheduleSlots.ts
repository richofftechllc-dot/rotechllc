// Pure slot math shared by the website and mirrored by the Discord bot (scheduleSlots.js).
// A coach's availability is a day → range map like { Wed: "2pm–5pm ET" } (set in the CRM).
// These functions turn that into real 30-min bookable slots. NO Firebase import here so the
// /book client component can use it directly; server routes read crmSchedule then call in.

const TZ = "America/New_York";
const ET_OFFSET = 4; // EDT = UTC-4 (matches the rest of the app; use 5 in winter)
const SLOT_MIN = 30;

export type Slot = { value: string; label: string };

function hourOf(t: string): number | null {
  const m = /^(\d{1,2})\s*(am|pm)$/i.exec(String(t || "").trim());
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[2])) h += 12;
  return h;
}

// "2pm–5pm ET" → { start: 14, end: 17 }. en-dash or hyphen. null if off/invalid/half-set.
export function parseRange(dayStr: string | undefined): { start: number; end: number } | null {
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

// 30-min slots for a day-range map, `offset` days out (0 = today).
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

// A coach's open slots across the next `days` days (for the website picker).
export function slotsForWindow(daysMap: Record<string, string> | undefined, days = 7): Slot[] {
  const out: Slot[] = [];
  for (let o = 0; o < days; o++) out.push(...slotsForOffset(daysMap, o));
  return out;
}

// Is `iso` a real bookable slot within this day-range map over the next `days` days?
export function isValidSlot(daysMap: Record<string, string> | undefined, iso: string, days = 8): boolean {
  for (let o = 0; o < days; o++) {
    if (slotsForOffset(daysMap, o).some((s) => s.value === iso)) return true;
  }
  return false;
}
