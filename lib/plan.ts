// The 30/60/90 pace planner. Turns a cert track + a pace into a DATED roadmap that
// walks the quiz domains IN THE EXACT ORDER they appear in quizData (that's the "order
// of the quiz system"), attaching each domain's hands-on lab (the "lab flow").
// Coach sets the default pace per student; the student can bump it faster/slower.
// Server-only (imports the full quizData) — the /plan page renders what the API returns.
import { TRACKS } from "./quizData";
import { labsForDomain } from "./labs";

export type PaceDays = 30 | 60 | 90;
export const PACES: PaceDays[] = [30, 60, 90];
export const DEFAULT_PACE: PaceDays = 60;

export type Milestone = {
  domainId: string;
  name: string;
  startDay: number;   // 1-indexed day within the plan
  endDay: number;
  startDate: string;  // YYYY-MM-DD
  endDate: string;
  labCount: number;   // hands-on labs tied to this domain
};

export type Plan = {
  trackId: string;
  trackName: string;
  pace: PaceDays;
  startDate: string;
  examDate: string;
  milestones: Milestone[];
};

export function trackList() {
  return TRACKS.map((t) => ({ id: t.id, name: t.name, domainCount: t.domains.length }));
}

export function isPace(n: unknown): n is PaceDays {
  return n === 30 || n === 60 || n === 90;
}

function iso(d: Date) { return d.toISOString().slice(0, 10); }

// Even split of the window across domains, in order. The last domain's block runs to
// exam day, so review time lands naturally at the end.
export function buildPlan(trackId: string, pace: PaceDays, startISO: string): Plan | null {
  const track = TRACKS.find((t) => t.id === trackId);
  if (!track) return null;
  const domains = track.domains;
  const n = domains.length || 1;
  const startMs = new Date(startISO.slice(0, 10) + "T00:00:00Z").getTime();

  const milestones: Milestone[] = domains.map((d, i) => {
    const s = Math.round((i * pace) / n);
    const endDay = Math.max(Math.round(((i + 1) * pace) / n), s + 1);
    return {
      domainId: d.id,
      name: d.name,
      startDay: s + 1,
      endDay,
      startDate: iso(new Date(startMs + s * 86400000)),
      endDate: iso(new Date(startMs + endDay * 86400000)),
      labCount: labsForDomain(d.id).length,
    };
  });

  return {
    trackId: track.id,
    trackName: track.name,
    pace,
    startDate: iso(new Date(startMs)),
    examDate: iso(new Date(startMs + pace * 86400000)),
    milestones,
  };
}
