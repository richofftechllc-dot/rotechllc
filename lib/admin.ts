// Admin gate for the CRM dashboard. Reuses the same rot_session HMAC cookie the rest
// of the site uses, then checks the resolved Discord ID against an allowlist.
//
// Allowlist = ADMIN_DISCORD_IDS (comma-separated) + RANDY_DISCORD_ID if set.
// Add Tyler's / Daquan's Discord IDs to ADMIN_DISCORD_IDS in the Vercel env.
//
// A request can authenticate two ways (both supported):
//   - discord session  → payload "discord:<id>:<name>"          → id is right there
//   - code session      → payload "<quizCode>"                   → look up customer.discordId
import crypto from "crypto";
import { coll } from "@/lib/firebase";

const SESSION_SECRET = process.env.SESSION_SECRET || "";

function adminIdSet(): Set<string> {
  const ids = (process.env.ADMIN_DISCORD_IDS || "")
    .split(",").map(s => s.trim()).filter(Boolean);
  if (process.env.RANDY_DISCORD_ID) ids.push(process.env.RANDY_DISCORD_ID.trim());
  return new Set(ids);
}

// Preferred gate: the ROT Coach role. Only Randy, Tyler, Daquan hold it today, and any
// future coach is auto-included — no ID list to maintain. Needs the bot token in the
// site env (DISCORD_BOT_TOKEN) so the server can read the member's roles.
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1488597128329822369";
const COACH_ROLE_NAMES = (process.env.ADMIN_ROLE_NAMES || "ROT Coach,Founder,Admin")
  .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

async function hasCoachRole(discordId: string): Promise<boolean> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return false;
  try {
    const memRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, {
      headers: { Authorization: `Bot ${token}` }, next: { revalidate: 120 },
    });
    if (!memRes.ok) return false;
    const roleIds = new Set(((await memRes.json()) as { roles?: string[] }).roles || []);
    if (!roleIds.size) return false;
    const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
      headers: { Authorization: `Bot ${token}` }, next: { revalidate: 300 },
    });
    if (!rolesRes.ok) return false;
    const roles = (await rolesRes.json()) as { id: string; name: string }[];
    return roles.some((r) => roleIds.has(r.id) && COACH_ROLE_NAMES.includes(r.name.toLowerCase()));
  } catch { return false; }
}

type Parsed = { kind: "discord"; id: string; name: string } | { kind: "code"; code: string };

function verifySession(token: string | undefined): Parsed | null {
  if (!token || !SESSION_SECRET) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  if (payload.startsWith("discord:")) {
    const p = payload.split(":");
    if (p.length !== 3) return null;
    return { kind: "discord", id: p[1], name: Buffer.from(p[2], "base64").toString("utf-8") };
  }
  return { kind: "code", code: payload };
}

function readCookie(req: Request): string | undefined {
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)rot_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

// Returns { discordId, name } when the caller is an authorized admin, else null.
export async function getAuthedAdmin(req: Request): Promise<{ discordId: string; name: string } | null> {
  const sess = verifySession(readCookie(req));
  if (!sess) return null;
  const allow = adminIdSet();

  let discordId: string | null = null;
  let name = "Admin";
  if (sess.kind === "discord") {
    discordId = sess.id;
    name = sess.name || name;
  } else {
    try {
      const snap = await coll("customers").where("quizCode", "==", sess.code).limit(1).get();
      if (!snap.empty) {
        const c = snap.docs[0].data() as { discordId?: string; name?: string };
        discordId = c.discordId || null;
        name = c.name || name;
      }
    } catch { /* fall through to deny */ }
  }

  if (!discordId) return null;
  // Allow by explicit ID list OR by the ROT Coach role (preferred).
  if (allow.has(discordId)) return { discordId, name };
  if (await hasCoachRole(discordId)) return { discordId, name };
  return null;
}
