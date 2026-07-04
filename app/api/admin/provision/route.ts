import { NextResponse } from "next/server";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST /api/admin/provision — owner/coach tool to manually provision a member the bot
// missed (e.g. a paid buyer whose Discord never linked). Uses the SERVER's bot token
// (never exposed to the client) to search the guild + assign a role, and writes their
// customers record so they can log in. Two modes:
//   { action: "search", queries: ["javon","jackson"] }         → returns candidates
//   { action: "assign", userId, roleName, removeRole?, email?, name?, quizCode? }
const GUILD = process.env.DISCORD_GUILD_ID || "1488597128329822369";
const TOKEN = process.env.DISCORD_BOT_TOKEN || "";
const API = "https://discord.com/api/v10";

function dfetch(path: string, init?: RequestInit) {
  return fetch(API + path, {
    ...init,
    headers: { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
}

type Member = { user: { id: string; username: string; global_name?: string }; nick?: string; roles: string[] };

export async function POST(req: Request) {
  const admin = await getAuthedAdmin(req);
  if (!admin) return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  if (!TOKEN) return NextResponse.json({ ok: false, error: "no_bot_token" }, { status: 500 });

  let body: { action?: string; queries?: string[]; userId?: string; roleName?: string; removeRole?: string; email?: string; name?: string; quizCode?: string; tracks?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 }); }

  // Look up the guild's roles once (for name→id).
  const rolesRes = await dfetch(`/guilds/${GUILD}/roles`);
  if (!rolesRes.ok) return NextResponse.json({ ok: false, error: `roles_${rolesRes.status}` }, { status: 502 });
  const roles = (await rolesRes.json()) as { id: string; name: string }[];
  const roleId = (n?: string) => roles.find((r) => r.name.toLowerCase() === (n || "").toLowerCase())?.id;

  if (body.action === "search") {
    const terms = (body.queries || []).filter(Boolean);
    const seen: Record<string, Member> = {};
    for (const q of terms) {
      const r = await dfetch(`/guilds/${GUILD}/members/search?query=${encodeURIComponent(q)}&limit=10`);
      if (r.ok) for (const m of (await r.json()) as Member[]) seen[m.user.id] = m;
    }
    const roleName = (id: string) => roles.find((r) => r.id === id)?.name;
    return NextResponse.json({
      ok: true,
      allRoles: roles.map((r) => r.name),
      candidates: Object.values(seen).map((m) => ({
        id: m.user.id, username: m.user.username, display: m.user.global_name, nick: m.nick,
        roles: m.roles.map(roleName).filter(Boolean),
      })),
    });
  }

  if (body.action === "assign") {
    if (!body.userId) return NextResponse.json({ ok: false, error: "need userId" }, { status: 400 });
    const addId = roleId(body.roleName || "Founding Member");
    if (!addId) return NextResponse.json({ ok: false, error: "role_not_found", allRoles: roles.map((r) => r.name) }, { status: 404 });

    const put = await dfetch(`/guilds/${GUILD}/members/${body.userId}/roles/${addId}`, { method: "PUT" });
    const results: Record<string, unknown> = { roleAssigned: put.ok, roleStatus: put.status };

    if (body.removeRole) {
      const rmId = roleId(body.removeRole);
      if (rmId) {
        const del = await dfetch(`/guilds/${GUILD}/members/${body.userId}/roles/${rmId}`, { method: "DELETE" });
        results.roleRemoved = del.ok;
      }
    }

    // Fetch their handle to store on the record.
    const memRes = await dfetch(`/guilds/${GUILD}/members/${body.userId}`);
    const mem = memRes.ok ? ((await memRes.json()) as Member) : null;

    // Create/update the customers record so they show in the CRM + can log in.
    if (body.email) {
      try {
        const snap = await coll("customers").where("email", "==", body.email.toLowerCase()).limit(1).get();
        const data: Record<string, unknown> = {
          discordId: body.userId, rolesAssigned: true,
          discordTag: mem?.user.username || "",
        };
        if (body.name) data.name = body.name;
        if (body.quizCode) data.quizCode = body.quizCode.toUpperCase();
        if (body.tracks) data.tracks = body.tracks;
        if (snap.empty) {
          await coll("customers").add({
            email: body.email.toLowerCase(), productType: "founding",
            createdAt: new Date().toISOString(), source: "manual-provision", ...data,
          });
          results.recordCreated = true;
        } else {
          await snap.docs[0].ref.update(data);
          results.recordUpdated = true;
        }
      } catch (e) { results.recordError = e instanceof Error ? e.message : "err"; }
    }

    return NextResponse.json({ ok: true, username: mem?.user.username, ...results });
  }

  return NextResponse.json({ ok: false, error: "bad_action" }, { status: 400 });
}
