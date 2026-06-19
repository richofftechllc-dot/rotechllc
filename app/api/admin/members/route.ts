import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/members — admin-only roster for the CRM.
// Returns each member's tracks/access + a payment STATUS (late/active/expired/comp)
// but NEVER the dollar amount. Also counts comped/discounted members in aggregate.
export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    const snap = await coll("members").limit(1000).get();
    const now = Date.now();
    let comped = 0;
    const members = snap.docs.map((d) => {
      const m = d.data() as Record<string, unknown>;
      const end = typeof m.accessEndDate === "string" ? Date.parse(m.accessEndDate) : NaN;
      const status = (m.status as string) || "unknown";
      const tier = (m.accessTier as string) || "";
      if (tier === "comp" || status === "comp") comped++;
      const late = !isNaN(end) && end < now && status !== "canceled" && status !== "comp";
      // payment status WITHOUT price — what the team is allowed to see
      const paymentStatus = late ? "late"
        : status === "comp" || tier === "comp" ? "comp"
        : status === "canceled" ? "canceled"
        : status === "expired" ? "expired"
        : status === "active" ? "active"
        : status;
      return {
        email: m.email as string,
        name: (m.fullName as string) || (m.name as string) || "",
        discordTag: (m.discordTag as string) || "",
        discordId: (m.discordId as string) || "",
        tier,
        status,
        paymentStatus,
        invoiced: !!m.lastInvoiceAt || !!(m as { invoiced?: boolean }).invoiced,
        tracks: (m.tracks as string[]) || [],
        quizCode: (m.quizCode as string) || "",
        accessEndDate: (m.accessEndDate as string) || "",
        rolesAssigned: !!m.rolesAssigned,
        assignedTo: (m.assignedTo as string) || "",
        notes: (m.crmNotes as string) || "",
      };
    });
    // newest-expiring / late first is most useful; sort late → soonest end
    members.sort((a, b) => {
      if (a.paymentStatus === "late" && b.paymentStatus !== "late") return -1;
      if (b.paymentStatus === "late" && a.paymentStatus !== "late") return 1;
      return (a.accessEndDate || "").localeCompare(b.accessEndDate || "");
    });
    return NextResponse.json({ ok: true, members, stats: { total: members.length, comped } });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : "error" }, { status: 500 });
  }
}
