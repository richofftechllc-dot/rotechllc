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
    let expiringSoon = 0;
    // Skip ONLY truly-empty junk docs (e.g. a bad Zapier write). A real member has at
    // least one identifier; the stray doc had only clientName/subject/assignedTo.
    const realDocs = custSnap.docs.filter((d) => {
      const c = d.data() as Record<string, unknown>;
      return c.email || c.name || c.firstName || c.quizCode || c.discordId;
    });
    // SAFETY NET — the junk filter must only ever drop a stray doc or two. If it would
    // remove more than 5, the heuristic is wrong: show EVERYONE rather than ever let the
    // member count silently collapse again.
    const keptDocs = (custSnap.docs.length - realDocs.length) > 5 ? custSnap.docs : realDocs;
    const members = keptDocs.map((d) => {
      const c = d.data() as Record<string, unknown>;
      const email = String(c.email || "").toLowerCase();
      const rac = racByEmail[email] || {};
      const tracks = (c.tracks as string[])?.length ? (c.tracks as string[])
        : c.track ? [c.track as string]
        : (rac.tracks as string[]) || [];
      const tier = (rac.accessTier as string) || (c.productType as string) || "";
      const racStatus = rac.status as string | undefined;
      if (tier === "comp" || racStatus === "comp") comped++;
      // Expiry: prefer the RAC access window; else derive from the join/purchase date.
      // Founding members = 12 months; monthly plans ≈ 30 days (ready for the switch).
      const plan = (rac.billingCycle as string) || (c.billingCycle as string) || (c.plan as string) || "annual";
      // Prefer an explicit accessEndDate from either collection — the bot stamps a
      // 60-day window on the $27 founding first cycle so the free 2nd month isn't
      // shown as expired. Fall back to deriving from the purchase date.
      let accessEnd = (rac.accessEndDate as string) || (c.accessEndDate as string) || "";
      if (!accessEnd && c.purchaseDate) {
        const start = Date.parse(c.purchaseDate as string);
        if (!isNaN(start)) accessEnd = new Date(start + (plan === "monthly" ? 30 : 365) * 86400000).toISOString();
      }
      const endMs = accessEnd ? Date.parse(accessEnd) : NaN;
      const daysLeft = !isNaN(endMs) ? Math.round((endMs - now) / 86400000) : null;
      if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 30) expiringSoon++;
      const expired = daysLeft !== null && daysLeft < 0 && racStatus !== "comp" && racStatus !== "canceled";
      const referredBy = (c.referredBy as string) || (c.referredByCode as string) || (c.referrer as string) || "";
      // A record tied to an actual purchase (a product/tier or a purchase date) is a
      // real paying member. A record with only a hand-assigned code and no purchase is
      // comped/demo (not "pending payment"). Cert + clearance tiers count as paid, not
      // just "founding".
      const hasProduct = !!(tier || c.productType || (Array.isArray(c.productTypes) && (c.productTypes as unknown[]).length) || c.purchaseDate || c.lastPurchaseDate);
      const paymentStatus = (racStatus === "comp" || tier === "comp") ? "comp"
        : racStatus === "canceled" ? "canceled"
        : expired ? "expired"
        : racStatus === "active" ? "active"
        : hasProduct ? "active"            // any real product/purchase (founding, cert, clearance) = paid
        : c.rolesAssigned ? "active"
        : c.quizCode ? "comp"              // has access code but no purchase = comped/demo, not pending
        : "pending";

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
        roles: (c.roles as string[]) || (rac.roles as string[]) || [],
        quizCode: (c.quizCode as string) || "",
        certs: (c.certs as string[]) || (rac.certs as string[]) || [],
        phone: (c.phone as string) || (rac.phone as string) || "",
        accessEndDate: accessEnd,
        daysLeft,
        plan,
        referredBy,
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
    const paidCount = members.filter((m) => m.paymentStatus === "active").length;
    const compedCount = members.filter((m) => m.paymentStatus === "comp").length;
    // Comped/demo members are OWNER-ONLY. Coaches only ever see real paying members.
    const visible = admin.isOwner ? members : members.filter((m) => m.paymentStatus !== "comp");
    return NextResponse.json({
      ok: true,
      members: visible,
      isOwner: admin.isOwner,
      stats: { total: members.length, paid: paidCount, comped: compedCount, expiringSoon },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
