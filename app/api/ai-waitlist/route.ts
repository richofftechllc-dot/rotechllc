import { NextRequest, NextResponse } from "next/server";
import { coll, IS_PROD } from "@/lib/firebase";

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

async function notifyDiscord(name: string, phone: string, id: string) {
  const url = process.env.DISCORD_LEADS_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚀 **New AI waitlist lead**${name ? ` — **${name}**` : ""}`,
        embeds: [{
          title: "rotechllc.com/ai waitlist",
          color: 0x2F7BFF,
          fields: [
            { name: "Name", value: name || "—", inline: true },
            { name: "Phone", value: phone, inline: true },
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

    await notifyDiscord(name, phone, ref.id);

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
