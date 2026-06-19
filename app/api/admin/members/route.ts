import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/members — coach-only roster for the CRM.
// Primary source is `customers` (where every member actually lives — the quiz, login
// and progress all key off it). Enriched with `members` (RAC payment/tier) by email
// and `quizProgress` (scores) by quizCode. Shows payment STATUS, never dollar amounts.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const custSnap = await coll("customers").limit(2000).get();

    // quiz progress by quizCode (doc id)
    const progByCode: Record<string, { domain: string; highScore: number; completed: boolean }[]> = {};
    try {
      const progSnap = await coll("quizProgress").limit(3000).get();
      progSnap.docs.forEach((p) => {
        const raw = (p.data() as { progress?: Record<string, { completed?: boolean; highScore?: number }> }).progress || {};
        progByCode[p.id] = Object.entries(raw).map(([k, v]) => ({
          domain: k.replace(/^(secplus|csa|ai)_/, ""),
          highScore: typeof v?.highScore === "number" ? v.highScore : 0,
          completed: !!v?.completed,
        }));
      });
    } catch { /* progress is best-effort */ }

    // RAC enrichment (payment tier/status/access window) keyed by email
    const racByEmail: Record<string, Record<string, unknown>> = {};
    try {
      const racSnap = await coll("members").limit(3000).get();
      racSnap.docs.forEach((d) => {
        const m = d.data() as Record<string, unknown>;
        if (m.email) racByEmail[String(m.email).toLowerCase()] = m;
      });
    } catch { /* enrichment is best-effort */ }

    const now = Date.now();
    let comped = 0;
    const members = custSnap.docs.map((d) => {
      const c = d.data() as Record<string, unknown>;
      const email = String(c.email || "").toLowerCase();
      const rac = racByEmail[email] || {};
      const tracks = (c.tracks as string[])?.length ? (c.tracks as string[])
        : c.track ? [c.track as string]
        : (rac.tracks as string[]) || [];
      const tier = (rac.accessTier as string) || (c.productType as string) || "";
      const racStatus = rac.status as string | undefined;
      if (tier === "comp" || racStatus === "comp") comped++;
      const end = typeof rac.accessEndDate === "string" ? Date.parse(rac.accessEndDate as string) : NaN;
      const late = !isNaN(end) && end < now && racStatus !== "canceled" && racStatus !== "comp";
      const paymentStatus = late ? "late"
        : (racStatus === "comp" || tier === "comp") ? "comp"
        : racStatus === "canceled" ? "canceled"
        : racStatus === "expired" ? "expired"
        : racStatus === "active" ? "active"
        : c.rolesAssigned ? "active" : "pending";

      const prog = progByCode[(c.quizCode as string) || ""] || [];
      const scored = prog.filter((p) => p.completed || p.highScore > 0);
      const progress = {
        domains: prog,
        done: prog.filter((p) => p.completed).length,
        avg: scored.length ? Math.round(scored.reduce((s, p) => s + p.highScore, 0) / scored.length) : null,
        weak: prog.filter((p) => p.completed && p.highScore < 70).map((p) => p.domain),
      };

      return {
        email: (c.email as string) || "",
        name: (c.name as string) || (c.firstName as string) || "",
        discordTag: (c.discordTag as string) || (rac.discordTag as string) || "",
        discordId: (c.discordId as string) || (rac.discordId as string) || "",
        tier,
        status: racStatus || (c.rolesAssigned ? "active" : "pending"),
        paymentStatus,
        invoiced: !!rac.lastInvoiceAt || !!(rac as { invoiced?: boolean }).invoiced,
        tracks,
        quizCode: (c.quizCode as string) || "",
        accessEndDate: (rac.accessEndDate as string) || "",
        purchaseDate: (c.purchaseDate as string) || "",
        rolesAssigned: !!c.rolesAssigned,
        assignedTo: (c.assignedTo as string) || (rac.assignedTo as string) || "",
        notes: (c.crmNotes as string) || (rac.crmNotes as string) || "",
        progress,
      };
    });

    members.sort((a, b) => {
      if (a.paymentStatus === "late" && b.paymentStatus !== "late") return -1;
      if (b.paymentStatus === "late" && a.paymentStatus !== "late") return 1;
      return (a.name || a.email).localeCompare(b.name || b.email);
    });
    return NextResponse.json({ ok: true, members, stats: { total: members.length, comped } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
