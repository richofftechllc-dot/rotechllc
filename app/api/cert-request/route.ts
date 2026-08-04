import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { notifyLead } from "@/lib/notifyLead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/cert-request — "we don't list your cert, tell us which one" box on
// /certifications.
//
// The cert someone types is the whole point: it is a named demand signal against a
// product we don't have a Square item for yet. Stored in its own `certRequests`
// collection so the CRM Leads tab can show WHICH cert was asked for, and DM'd to
// Randy through the same notifyLead path everything else uses.
//
// NOT a customer. `customers` drives access and /api/founding-count; nothing here
// touches it.

function normalizeEmail(raw: string): string | null {
  const email = raw.trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cert = typeof body.cert === "string" ? body.cert.trim().slice(0, 120) : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");

    if (!cert) {
      return NextResponse.json({ ok: false, error: "Which cert are you after?" }, { status: 400 });
    }
    if (!email) {
      return NextResponse.json({ ok: false, error: "Enter a valid email so we can get back to you." }, { status: 400 });
    }

    // De-dupe on email + cert. Asking twice for the same cert is not a new lead;
    // asking for a SECOND cert is.
    const existing = await coll("certRequests")
      .where("email", "==", email)
      .where("certLower", "==", cert.toLowerCase())
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ ok: true, already: true });
    }

    const ref = await coll("certRequests").add({
      cert,
      // Stored lowercase alongside the original so the de-dupe query above is
      // exact-match — Firestore has no case-insensitive where().
      certLower: cert.toLowerCase(),
      name,
      email,
      source: "certifications-request-box",
      status: "new",
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
    });

    await notifyLead({
      title: `Cert request — ${cert}`,
      source: "certifications-request-box",
      id: ref.id,
      name,
      email,
      note: `Asked for: ${cert}. Not a listed product — quote them or tell them no.`,
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
