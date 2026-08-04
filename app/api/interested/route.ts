import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { notifyLead } from "@/lib/notifyLead";
import { sendLeadEmail } from "@/lib/leadEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/interested — email capture for the INTERESTED side of the home fork.
//
// Deliberately modelled on /api/cohort-waitlist: same shape, same de-dupe, same
// Discord webhook, same "store now, send later" flag. Email is the required field
// here rather than phone, because nothing on the interested path is an SMS drop and
// asking for a phone number to hand somebody a free study plan is a bad trade.
//
// Nothing here is gated and nothing here is a customer. These are people who said
// they are INTERESTED, not committed — the CRM must not count them as members, so
// they land in their own `interestedLeads` collection and never touch `customers`
// (which drives /api/founding-count and access).

function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase().slice(0, 120);
  // Deliberately loose — one @, a dot in the domain, no spaces. Bouncing a real
  // address over a clever regex costs more than storing a bad one.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");

    if (!email) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }

    // Same email twice → idempotent success. Somebody double-tapping a button is
    // not an error and should not see one.
    const existing = await coll("interestedLeads").where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ ok: true, already: true });
    }

    // Hand off to the Zap BEFORE writing, so the record can state truthfully
    // whether mail was actually queued rather than assuming it.
    const emailQueued = await sendLeadEmail({ kind: "interested", email, name });

    const ref = await coll("interestedLeads").add({
      name,
      email,
      source: "home-interested-fork",
      // False whenever no sender is configured, so nobody is ever falsely
      // marked as contacted. See lib/leadEmail.ts.
      emailQueued,
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
    });

    await notifyLead({ title: "New interested lead", source: "home-interested-fork", id: ref.id, name, email, note: "Interested, not committed — free side of the home fork." });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
