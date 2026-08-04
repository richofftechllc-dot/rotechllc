import { NextRequest, NextResponse } from "next/server";
import { coll, IS_PROD } from "@/lib/firebase";
import { notifyLead } from "@/lib/notifyLead";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Normalize a US phone to digits; returns null if it doesn't look valid.
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length >= 8 && digits.length <= 15) return "+" + digits; // intl, lenient
  return null;
}

// Was a local DISCORD_LEADS_WEBHOOK post. That env var has never been set in
// production, so this notified nobody. See lib/notifyLead.ts.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return NextResponse.json({ ok: false, error: "Enter a valid phone number." }, { status: 400 });
    }

    // De-dupe: same phone already on the list → treat as success (idempotent join).
    const existing = await coll("aiWaitlist").where("phone", "==", phone).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ ok: true, already: true });
    }

    const ref = await coll("aiWaitlist").add({
      name,
      phone,
      source: "ai-waitlist",
      // Twilio SMS isn't wired yet — store the lead now, send the welcome text once
      // Twilio is set up (flip notified→true when sent).
      smsSent: false,
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
    });

    await notifyLead({ title: "New AI waitlist lead", source: "ai-waitlist", id: ref.id, name, phone, note: "rotechllc.com/ai waitlist" });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
