/* One-off provisioning for Javon Jackson — paid $27 on 2026-07-03 (Square customer
   BQHTW848G7AP7P13HVS4WH0MCC), just joined Discord. The auto-provision bot is down,
   so we do it by hand:
     1) create his `customers` record (so he can log in + shows in the CRM)
     2) find him in the Discord guild + assign the Founding Member role
     3) DM him his access code + login link
   Run:
     vercel env pull .env.prod.local --environment=production   (you run this once)
     node scripts/grant-javon.cjs
*/
const fs = require("fs");
const path = require("path");

const envRaw = fs.readFileSync(path.join(__dirname, "..", ".env.prod.local"), "utf8");
const env = {};
envRaw.split("\n").forEach((l) => {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) { let v = m[2]; if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1); env[m[1]] = v; }
});

const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64 || "", "base64").toString("utf-8"),
  }),
});
const db = admin.firestore();

const GUILD = "1488597128329822369";
const TOKEN = env.DISCORD_BOT_TOKEN;
const EMAIL = "airmanjacksonnn@icloud.com";
const CODE = "JAVONJA2026";
const API = "https://discord.com/api/v10";
const H = { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json" };

async function dget(p) { const r = await fetch(API + p, { headers: H }); return { ok: r.ok, status: r.status, body: await r.json().catch(() => null) }; }

(async () => {
  // ---- 1) customers record ----
  const existing = await db.collection("customers").where("email", "==", EMAIL).limit(1).get();
  if (existing.empty) {
    await db.collection("customers").add({
      name: "Javon Jackson", firstName: "Javon", email: EMAIL, phone: "+17578207655",
      quizCode: CODE, plan: "monthly", billingCycle: "monthly", productType: "founding",
      purchaseDate: "2026-07-03T23:01:48Z", source: "square-27-2for1-birthday",
      squareCustomerId: "BQHTW848G7AP7P13HVS4WH0MCC", rolesAssigned: false,
      createdAt: "2026-07-03T23:01:48Z",
    });
    console.log("✓ customers record CREATED — quizCode:", CODE);
  } else {
    const d = existing.docs[0];
    if (!d.data().quizCode) await d.ref.update({ quizCode: CODE });
    console.log("✓ customers record exists —", d.id, "quizCode:", d.data().quizCode || CODE);
  }

  // ---- 2) Discord role ----
  // find the Founding role
  const rolesRes = await dget(`/guilds/${GUILD}/roles`);
  if (!rolesRes.ok) { console.error("! can't read roles:", rolesRes.status, rolesRes.body); process.exit(1); }
  const foundingRole = rolesRes.body.find((r) => /founding/i.test(r.name)) || rolesRes.body.find((r) => /member/i.test(r.name));
  console.log("  roles matching:", rolesRes.body.filter((r) => /found|member/i.test(r.name)).map((r) => `${r.name}=${r.id}`).join(", ") || "(none)");
  if (!foundingRole) { console.error("! no Founding/Member role found — list:", rolesRes.body.map((r) => r.name).join(", ")); process.exit(1); }

  // find Javon among guild members (he just joined)
  let member = null;
  for (const q of ["javon", "jackson", "airman"]) {
    const s = await dget(`/guilds/${GUILD}/members/search?query=${q}&limit=10`);
    if (s.ok && Array.isArray(s.body) && s.body.length) {
      console.log(`  search "${q}":`, s.body.map((m) => `${m.user.username}(${m.user.id})`).join(", "));
      if (!member) member = s.body[0];
    }
  }
  if (!member) { console.error("! couldn't find Javon in the guild by name — assign manually or tell me his Discord handle"); process.exit(1); }

  const uid = member.user.id;
  const put = await fetch(`${API}/guilds/${GUILD}/members/${uid}/roles/${foundingRole.id}`, { method: "PUT", headers: H });
  console.log(put.ok ? `✓ Founding role assigned to ${member.user.username} (${uid})` : `! role PUT failed ${put.status}`);

  // link his discordId now that we know it
  const snap = await db.collection("customers").where("email", "==", EMAIL).limit(1).get();
  if (!snap.empty) await snap.docs[0].ref.update({ discordId: uid, discordTag: member.user.username, rolesAssigned: true });

  // ---- 3) DM him ----
  const dm = await fetch(`${API}/users/@me/channels`, { method: "POST", headers: H, body: JSON.stringify({ recipient_id: uid }) });
  const dmCh = await dm.json().catch(() => null);
  if (dmCh && dmCh.id) {
    const msg = `Welcome to Rich Off Tech, Javon! 🤎🏾 You're locked in.\n\n**Log in:** https://www.rotechllc.com/login\n**Your access code:** ${CODE}\n(or just tap "Sign in with Discord" — same account)\n\nJump in the server, hit the quiz engine, and let's get you certified. — Bo`;
    const sent = await fetch(`${API}/channels/${dmCh.id}/messages`, { method: "POST", headers: H, body: JSON.stringify({ content: msg }) });
    console.log(sent.ok ? "✓ welcome DM sent" : `! DM failed ${sent.status} (he may have DMs off — email will cover it)`);
  }
  process.exit(0);
})().catch((e) => { console.error("ERROR:", e.message); process.exit(1); });
