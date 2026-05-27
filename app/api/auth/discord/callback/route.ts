import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const ROT_GUILD_ID = "1488597128329822369";
const REDIRECT_URI = "https://rotechllc.vercel.app/api/auth/discord/callback";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function loginError(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, req.url));
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return loginError(req, "no_code");
  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return loginError(req, "token_failed");

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();
    if (!user.id) return loginError(req, "user_failed");

    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guilds: { id: string }[] = await guildsRes.json();
    const inROT = Array.isArray(guilds) && guilds.some(g => g.id === ROT_GUILD_ID);
    if (!inROT) return loginError(req, "not_in_server");

    const displayName = user.global_name || user.username || "Member";
    const nameB64 = Buffer.from(displayName).toString("base64");
    const payload = `discord:${user.id}:${nameB64}`;
    const sig = sign(payload);

    const res = NextResponse.redirect(new URL("/quiz", req.url));
    res.cookies.set("rot_session", `${payload}.${sig}`, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return loginError(req, "server_error");
  }
}
