import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CALENDAR_ID = "richofftechllc@gmail.com";

// Exchange the stored refresh token for a short-lived access token (no SDK needed).
async function getAccessToken(): Promise<string | null> {
  const client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id, client_secret, refresh_token, grant_type: "refresh_token" }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const d = await res.json();
    return d.access_token || null;
  } catch {
    return null;
  }
}

// Returns the next upcoming "community" event (by title) on the calendar, in real time.
// { status: "scheduled", topic, startISO, meetUrl, description } | { status: "none" }
export async function GET() {
  try {
    const token = await getAccessToken();
    if (!token) return NextResponse.json({ status: "none", reason: "no-calendar-credentials" });

    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 16 * 86400000).toISOString();
    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
      `?singleEvents=true&orderBy=startTime&maxResults=15` +
      `&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&q=community`;

    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!r.ok) return NextResponse.json({ status: "none" });
    const data = await r.json();
    const items = (data.items || []).filter(
      (e: { summary?: string; status?: string }) => /community/i.test(e.summary || "") && e.status !== "cancelled"
    );
    if (!items.length) return NextResponse.json({ status: "none" });

    const ev = items[0];
    const start = ev.start?.dateTime || (ev.start?.date ? `${ev.start.date}T18:00:00-04:00` : null);
    return NextResponse.json({
      status: "scheduled",
      topic: ev.summary || "ROT Community Call",
      startISO: start,
      meetUrl: ev.hangoutLink || ev.conferenceData?.entryPoints?.[0]?.uri || "",
      description: typeof ev.description === "string" ? ev.description.slice(0, 400) : "",
    });
  } catch {
    return NextResponse.json({ status: "none" });
  }
}
