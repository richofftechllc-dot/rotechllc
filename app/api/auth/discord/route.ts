import { NextResponse } from "next/server";

export function GET() {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID || "",
    redirect_uri: "https://www.rotechllc.com/api/auth/discord/callback",
    response_type: "code",
    scope: "identify guilds",
  });
  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params.toString()}`
  );
}
