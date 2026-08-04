import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { DEAL_DEADLINE_DEFAULT, endLabel, dealIsLive } from "@/lib/deal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/deal — PUBLIC. The live promo deadline for the homepage countdown and copy.
//
// Reads the coach-set override at crmConfig/settings.dealDeadline (written by the CRM
// "Extend deal" button) and falls back to the code default. Public on purpose: it exposes
// only a date, and the homepage is public. Any failure falls back to the default rather
// than returning an error, so the countdown can never blank out on a Firestore hiccup.
export async function GET() {
  let deadline = DEAL_DEADLINE_DEFAULT;
  let source: "override" | "default" = "default";
  try {
    const doc = await coll("crmConfig").doc("settings").get();
    const d = (doc.exists ? doc.data() : {}) as { dealDeadline?: string };
    if (d.dealDeadline && !isNaN(new Date(d.dealDeadline).getTime())) {
      deadline = d.dealDeadline;
      source = "override";
    }
  } catch {
    /* fall through to the default */
  }
  return NextResponse.json({
    ok: true,
    deadline,
    endLabel: endLabel(deadline),
    live: dealIsLive(deadline),
    source,
  });
}
