import { NextRequest, NextResponse } from "next/server";
import { coll, IS_PROD } from "@/lib/firebase";

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

async function notifyDiscord(name: string, email: string, id: string) {
  const url = process.env.DISCORD_LEADS_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `👀 **New interested lead**${name ? ` — **${name}**` : ""}`,
        embeds: [{
          title: "Interested (not committed)",
          color: 0x60A5FA,
          fields: [
            { name: "Name", value: name || "—", inline: true },
            { name: "Email", value: email, inline: true },
          ],
          footer: { text: `ID: ${id}${IS_PROD ? "" : " · TEST"}` },
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  } catch {
    /* non-fatal — a webhook hiccup must never lose the lead */
  }
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

    const ref = await coll("interestedLeads").add({
      name,
      email,
      source: "home-interested-fork",
      // No mail send is wired for this list yet. Store the lead now; flip
      // emailSent when a sequence actually exists, so nobody is silently
      // marked as contacted.
      emailSent: false,
      createdAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "",
    });

    await notifyDiscord(name, email, ref.id);

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
