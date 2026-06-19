import { NextResponse } from "next/server";

// Optional ?redirect=/path is carried through OAuth `state` so the callback can return
// the user where they started (e.g. /admin) instead of always landing on /quiz.
export function GET(req: Request) {
  const redirect = new URL(req.url).searchParams.get("redirect") || "/quiz";
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    redirect_uri: "https://www.rotechllc.com/api/auth/discord/callback",
    response_type: "code",
    scope: "identify guilds",
    state: redirect,
  });
  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params.toString()}`
  );
}
