import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/leads — coach-only view of every lead form on the site.
//
// These three collections have been written to for months and read by NOTHING.
// There was no CRM view and no working notification (the routes fanned out to a
// DISCORD_LEADS_WEBHOOK that was never set in production), so people filled in a
// form, landed in Firestore, and nobody ever saw them. This is the read side.
//
// Leads are NOT customers and must never be counted as such — `customers` drives
// access and /api/founding-count. Read-only here, and nothing writes back.
const SOURCES = [
  { collection: "interestedLeads", kind: "Interested", contact: "email" as const },
  { collection: "cohortWaitlist", kind: "Cohort waitlist", contact: "phone" as const },
  { collection: "aiWaitlist", kind: "AI waitlist", contact: "phone" as const },
];

export type Lead = {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  cohort: string;
  createdAt: string;
  /** True once a customers doc exists for this email — they converted. */
  converted: boolean;
};

export async function GET(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });

  try {
    // Emails that already belong to a paying customer, so a lead who has since
    // bought doesn't sit in the follow-up pile forever.
    const paidEmails = new Set<string>();
    try {
      const cust = await coll("customers").limit(3000).get();
      cust.docs.forEach((d) => {
        const e = (d.data() as { email?: string }).email;
        if (e) paidEmails.add(String(e).toLowerCase());
      });
    } catch { /* best-effort — a lead list is still useful without conversion flags */ }

    const leads: Lead[] = [];
    for (const src of SOURCES) {
      let snap;
      try {
        snap = await coll(src.collection).limit(1000).get();
      } catch {
        continue; // a collection that has never been written to simply isn't there
      }
      snap.docs.forEach((d) => {
        const v = d.data() as Record<string, unknown>;
        const email = String(v.email || "").toLowerCase();
        leads.push({
          id: d.id,
          kind: src.kind,
          name: String(v.name || ""),
          email,
          phone: String(v.phone || ""),
          cohort: String(v.cohort || ""),
          createdAt: String(v.createdAt || ""),
          converted: !!email && paidEmails.has(email),
        });
      });
    }

    // Newest first. Blank createdAt sorts last rather than throwing off the order.
    leads.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return NextResponse.json({
      ok: true,
      leads,
      counts: {
        total: leads.length,
        unconverted: leads.filter((l) => !l.converted).length,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
