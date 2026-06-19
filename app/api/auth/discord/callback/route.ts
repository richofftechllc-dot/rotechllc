import { NextRequest, NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import crypto from "crypto";

export const runtime = "nodejs";

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
const SESSION_SECRET = process.env.SESSION_SECRET || "";
const ROT_GUILD_ID = "1488597128329822369";
const REDIRECT_URI = "https://www.rotechllc.com/api/auth/discord/callback";

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function loginError(req: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}`, req.url));
}

// Only allow internal relative paths as the post-login destination (no open redirects).
function safeDest(req: NextRequest): string {
  const s = req.nextUrl.searchParams.get("state") || "";
  return /^\/[A-Za-z0-9/_-]*$/.test(s) && !s.startsWith("//") ? s : "/quiz";
}

function setSession(req: NextRequest, payload: string) {
  const sig = sign(payload);
  const res = NextResponse.redirect(new URL(safeDest(req), req.url));
  res.cookies.set("rot_session", `${payload}.${sig}`, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return loginError(req, "no_code");
  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
        grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI,
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

    // Look up customer by Discord ID — if linked, sign in as code user (full access)
    try {
      const linkedSnap = await coll("customers").where("discordId", "==", user.id).limit(1).get();
      if (!linkedSnap.empty) {
        const customer = linkedSnap.docs[0].data();
        if (customer.quizCode) return setSession(req, customer.quizCode);
      }
    } catch {}

    // Fallback: Discord-only session (no code linked)
    const displayName = user.global_name || user.username || "Member";
    const nameB64 = Buffer.from(displayName).toString("base64");
    return setSession(req, `discord:${user.id}:${nameB64}`);
  } catch {
    return loginError(req, "server_error");
  }
}
