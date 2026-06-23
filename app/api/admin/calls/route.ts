import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/calls — EVERY call, coach-only.
// Source 1: Fireflies (live) — all meeting types: coaching, interview prep, project
//           discovery, voice-agent qualifier, team syncs. Needs FIREFLIES_API_KEY.
// Source 2: gradedCalls (Firestore) — the Claude scorecards the bot graded; merged
//           onto the matching Fireflies call so coaching calls show their grade.
type Call = {
  id: string; title: string; date: string | null; type: string;
  summary: string; actionItems: string; keywords: string;
  participants: string[]; transcriptUrl: string; grade: string; gradedAt: number | null;
};

function classify(title: string): string {
  const t = (title || "").toLowerCase();
  if (/discovery|intake/.test(t)) return "discovery";
  if (/interview|prep/.test(t)) return "interview";
  if (/qualifier|voice ?agent|clearance qualifier/.test(t)) return "voice";
  if (/coaches sync|coach sync|team/.test(t)) return "team";
  if (/coaching|consult|1[\s-]?on[\s-]?1|session|strategy/.test(t)) return "coaching";
  return "other";
}

async function fetchFireflies(): Promise<Call[]> {
  const key = process.env.FIREFLIES_API_KEY;
  if (!key) return [];
  const query = `query { transcripts(limit: 50) { id title date duration participants transcript_url summary { short_summary action_items keywords } } }`;
  try {
    const r = await fetch("https://api.fireflies.ai/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ query }),
    });
    if (!r.ok) return [];
    const j = await r.json() as { data?: { transcripts?: Array<Record<string, unknown>> } };
    const list = j.data?.transcripts || [];
    return list.map((t) => {
      const s = (t.summary as Record<string, unknown>) || {};
      const dateMs = typeof t.date === "number" ? t.date : Number(t.date) || null;
      return {
        id: String(t.id || ""),
        title: String(t.title || "Untitled call"),
        date: dateMs ? new Date(dateMs).toISOString() : null,
        type: classify(String(t.title || "")),
        summary: String(s.short_summary || ""),
        actionItems: String(s.action_items || ""),
        keywords: Array.isArray(s.keywords) ? (s.keywords as string[]).join(", ") : String(s.keywords || ""),
        participants: Array.isArray(t.participants) ? (t.participants as string[]) : [],
        transcriptUrl: String(t.transcript_url || ""),
        grade: "", gradedAt: null,
      };
    });
  } catch { return []; }
}

export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const fireflies = await fetchFireflies();
    const byTitle = new Map(fireflies.map((c) => [c.title.toLowerCase().trim(), c]));

    // Merge the bot's graded scorecards onto matching calls; keep any not in Fireflies.
    const graded: Call[] = [];
    try {
      const snap = await coll("gradedCalls").limit(500).get();
      snap.docs.forEach((d) => {
        const c = d.data() as Record<string, unknown>;
        const title = (c.title as string) || "Untitled call";
        const match = byTitle.get(title.toLowerCase().trim());
        if (match) {
          match.grade = (c.grade as string) || "";
          match.gradedAt = typeof c.gradedAt === "number" ? c.gradedAt : null;
        } else {
          graded.push({
            id: d.id, title, date: (c.date as string) || null, type: classify(title),
            summary: "", actionItems: "", keywords: "",
            participants: (c.participants as string[]) || [], transcriptUrl: (c.transcriptUrl as string) || "",
            grade: (c.grade as string) || "", gradedAt: typeof c.gradedAt === "number" ? c.gradedAt : null,
          });
        }
      });
    } catch { /* grades best-effort */ }

    const calls = [...fireflies, ...graded].sort((a, b) =>
      (b.date ? Date.parse(b.date) : b.gradedAt || 0) - (a.date ? Date.parse(a.date) : a.gradedAt || 0));
    return NextResponse.json({ ok: true, calls, firefliesOn: !!process.env.FIREFLIES_API_KEY });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
