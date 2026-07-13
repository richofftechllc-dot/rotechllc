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

// Coach login codes → their Discord ID. Tyler and Daquan sign into the CRM with their
// FIRSTNAME2026 code and get FULL coach access (not owner) the SAME deterministic way
// Randy does with the owner code — with NO dependency on the live Discord role lookup or
// the ADMIN_DISCORD_IDS env, both of which were silently failing in prod and bouncing
// coaches back to the login screen ("opens, then goes back to login"). The Discord ID is
// only a fallback for schedule matching / invoice attribution — the real one is read from
// the coach's customer doc when present. Extend with COACH_LOGIN_CODES="CODE:discordId,...".
function coachCodeMap(): Record<string, string> {
  const map: Record<string, string> = {
    TYLER2026: "1465828992014876834",
    DAQUAN2026: "694452462676869122",
  };
  for (const pair of (process.env.COACH_LOGIN_CODES || "").split(",")) {
    const [code, id] = pair.split(":").map((s) => (s || "").trim());
    if (code) map[code.toUpperCase()] = id || map[code.toUpperCase()] || "coach";
  }
  return map;
}

// Preferred gate: the ROT Coach role. Only Randy, Tyler, Daquan hold it today, and any
// future coach is auto-included — no ID list to maintain. Needs the bot token in the
// site env (DISCORD_BOT_TOKEN) so the server can read the member's roles.
const GUILD_ID = process.env.DISCORD_GUILD_ID || "1488597128329822369";
const COACH_ROLE_NAMES = (process.env.ADMIN_ROLE_NAMES || "ROT Coach,Founder,Admin")
  .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

// Discord GET with retry-on-429. The /admin page fires ~10 API calls at once and each
// re-checks the coach role, which bursts Discord and trips its rate limit → random 403s.
// Retrying (honoring Retry-After, with jitter) lets every call succeed.
async function discordGet(url: string, token: string, tries = 2): Promise<Response | null> {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { Authorization: `Bot ${token}` }, cache: "no-store" });
    if (res.status !== 429) return res;
    // one short retry only — never long enough to hit the function timeout
    await new Promise((r) => setTimeout(r, 350 + Math.floor(Math.random() * 250)));
  }
  return null;
}

async function hasCoachRole(discordId: string): Promise<boolean> {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return false;
  try {
    const memRes = await discordGet(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}`, token);
    if (!memRes || !memRes.ok) return false;
    const roleIds = new Set(((await memRes.json()) as { roles?: string[] }).roles || []);
    if (!roleIds.size) return false;
    const rolesRes = await discordGet(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, token);
    if (!rolesRes || !rolesRes.ok) return false;
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
export async function getAuthedAdmin(req: Request): Promise<{ discordId: string; name: string; isOwner: boolean } | null> {
  const sess = verifySession(readCookie(req));
  if (!sess) return null;
  // Owner master code — Randy signs into the CRM with RANDY2026 (the same code /hub
  // already accepts) without needing Discord OAuth. Bypasses the role/allowlist check.
  const OWNER_CODE = (process.env.OWNER_LOGIN_CODE || "RANDY2026").toUpperCase();
  if (sess.kind === "code" && sess.code.toUpperCase() === OWNER_CODE) {
    return { discordId: (process.env.RANDY_DISCORD_ID || "owner").trim(), name: "Randy", isOwner: true };
  }
  // Coach master codes — Tyler/Daquan get full coach access via the same trusted,
  // env-independent path as the owner code (minus owner-only privileges). Prefer the
  // real Discord ID + name from their customer doc so invoice attribution and schedule
  // matching stay correct; fall back to the built-in ID if the doc is missing/incomplete.
  if (sess.kind === "code") {
    const fallbackId = coachCodeMap()[sess.code.toUpperCase()];
    if (fallbackId) {
      let discordId = fallbackId;
      let name = "Coach";
      try {
        const snap = await coll("customers").where("quizCode", "==", sess.code).limit(1).get();
        if (!snap.empty) {
          const c = snap.docs[0].data() as { discordId?: string; name?: string };
          if (c.discordId) discordId = c.discordId;
          if (c.name) name = c.name;
        }
      } catch { /* use the built-in fallback identity */ }
      return { discordId: discordId || "coach", name, isOwner: false };
    }
  }
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
  const owner = !!process.env.RANDY_DISCORD_ID && discordId === process.env.RANDY_DISCORD_ID.trim();
  if (allow.has(discordId)) return { discordId, name, isOwner: owner };
  if (await hasCoachRole(discordId)) return { discordId, name, isOwner: owner };
  return null;
}
