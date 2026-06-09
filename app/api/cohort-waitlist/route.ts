import { NextRequest, NextResponse } from "next/server";
import { coll, IS_PROD } from "@/lib/firebase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Default cohort label; override per-request via body.cohort.
const DEFAULT_COHORT = "july-2026";

// Normalize a US phone to E.164-ish digits; null if it doesn't look valid.
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (digits.length >= 8 && digits.length <= 15) return "+" + digits; // intl, lenient
  return null;
}

async function notifyDiscord(name: string, phone: string, cohort: string, id: string) {
  const url = process.env.DISCORD_LEADS_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🎓 **New cohort waitlist lead**${name ? ` — **${name}**` : ""}`,
        embeds: [{
          title: `${cohort} cohort waitlist`,
          color: 0xF97316,
          fields: [
            { name: "Name", value: name || "—", inline: true },
            { name: "Phone", value: phone, inline: true },
            { name: "Cohort", value: cohort, inline: true },
          ],
          footer: { text: `ID: ${id}${IS_PROD ? "" : " · TEST"}` },
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch {
    /* non-fatal */
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 120) : "";
    const cohort = typeof body.cohort === "string" && body.cohort.trim() ? body.cohort.trim().slice(0, 40) : DEFAULT_COHORT;

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return NextResponse.json({ ok: false, error: "Enter a valid phone number." }, { status: 400 });
    }

    // De-dupe per cohort: same phone already on this cohort's list → idempotent success.
    const existing = await coll("cohortWaitlist")
      .where("phone", "==", phone)
      .where("cohort", "==", cohort)
      .limit(1)
      .get();
    if (!existing.empty) {
      return NextResponse.json({ ok: true, already: true });
    }

    const ref = await coll("cohortWaitlist").add({
      name,
      phone,
      email,
      cohort,
      source: "cohort-waitlist",
      // Twilio SMS blast isn't wired yet — store the lead now; flip smsSent→true
      // when the cohort drops and the text goes out.
      smsSent: false,
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
    });

    await notifyDiscord(name, phone, cohort, ref.id);

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
