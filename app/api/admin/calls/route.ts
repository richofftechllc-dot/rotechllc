import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/calls — coach-only. Fireflies calls the bot graded, stored in `gradedCalls`.
// Each doc: { title, date, participants[], grade (Claude scorecard), transcriptUrl, gradedAt }.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const snap = await coll("gradedCalls").limit(500).get();
    const calls = snap.docs.map((d) => {
      const c = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        title: (c.title as string) || "Untitled call",
        date: (c.date as string) || null,
        participants: (c.participants as string[]) || [],
        grade: (c.grade as string) || "",
        transcriptUrl: (c.transcriptUrl as string) || "",
        gradedAt: typeof c.gradedAt === "number" ? c.gradedAt : null,
      };
    });
    calls.sort((a, b) => (b.gradedAt || 0) - (a.gradedAt || 0));
    return NextResponse.json({ ok: true, calls });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
