#!/usr/bin/env node
/**
 * REFERRAL REPORT — read-only.
 *
 * Prints the same rollup the CRM Referrals tab shows, from the same data, using
 * the same rules: cleared referrals x tier rate, capped at $500, minus what the
 * payout ledger says has already gone out.
 *
 * READ ONLY BY CONSTRUCTION. It calls .get() and nothing else — no set, update,
 * add, delete or transaction anywhere in this file. It exists so the numbers can
 * be read and checked without opening the admin UI; recording a payout stays in
 * the CRM, where the transactional cap enforcement lives.
 *
 * GETTING CREDENTIALS: `vercel env pull` will NOT work. Every production var on
 * this project is stored Encrypted in Vercel, which is write-only — the CLI can
 * list the names but never read the values, so a pull returns empty strings.
 * That is the correct posture; do not try to route around it.
 *
 * To run this you need FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and
 * FIREBASE_PRIVATE_KEY_BASE64 in .env.local, taken from the Firebase console
 * (Project settings → Service accounts) by someone who has that access. The
 * file is gitignored. Treat it as production credentials, because it is.
 *
 *   node scripts/referral-report.mjs
 */
import { readFileSync } from "node:fs";
import admin from "firebase-admin";

// Minimal .env.local reader — avoids a dependency just to read three keys.
const env = {};
for (const raw of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq < 1) continue;
  // Values may be quoted and may themselves contain "=" (base64 padding does),
  // so split on the FIRST "=" only and strip one layer of surrounding quotes.
  env[line.slice(0, eq)] = line.slice(eq + 1).replace(/^"(.*)"$/s, "$1");
}

const need = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY_BASE64"];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Missing ${missing.join(", ")} in .env.local.`);
  console.error("Run: npx vercel env pull .env.local --environment=production --yes");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: Buffer.from(env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf-8"),
  }),
});
const db = admin.firestore();

const CAP = 500;
const money = (n) => `$${n}`;

const [custSnap, paidSnap] = await Promise.all([
  db.collection("customers").get(),
  db.collection("referralPayouts").get(),
]);

// tier lookup by referral code, exactly as the CRM does it
const byCode = new Map();
custSnap.docs.forEach((d) => {
  const c = String(d.get("referralCode") || "").toLowerCase();
  if (c) byCode.set(c, d);
});

// group referrals by who gets credit
const groups = new Map();
custSnap.docs.forEach((d) => {
  const ref = String(d.get("referredBy") || "").trim();
  if (!ref) return;
  if (!groups.has(ref)) groups.set(ref, []);
  groups.get(ref).push(d);
});

// ledger
const cashByRef = new Map();
const creditByRef = new Set();
paidSnap.docs.forEach((d) => {
  const k = String(d.get("referrer") || "").toLowerCase();
  if (d.get("method") === "credit") creditByRef.add(k);
  else cashByRef.set(k, (cashByRef.get(k) || 0) + (Number(d.get("amount")) || 0));
});

const rows = [...groups.entries()].map(([ref, list]) => {
  const key = ref.toLowerCase();
  const refDoc = byCode.get(key);
  const tier = refDoc?.get("foundingTier") === 2 ? 2 : 1;
  const rate = tier === 2 ? 25 : 50;
  const cleared = list.filter((d) => {
    const st = String(d.get("paymentStatus") || "");
    return st === "active" || st === "comp";
  });
  const gross = cleared.length * rate;
  const owed = Math.min(gross, CAP);
  const cashPaid = cashByRef.get(key) || 0;
  const credit = creditByRef.has(key);
  const remaining = credit ? 0 : Math.max(0, owed - cashPaid);
  return {
    ref,
    name: refDoc?.get("name") || refDoc?.get("email") || "—",
    tier, rate,
    total: list.length,
    cleared: cleared.length,
    owed, cashPaid, credit, remaining,
    capped: gross > CAP,
    who: cleared.map((d) => d.get("name") || d.get("email") || d.id),
    notCleared: list
      .filter((d) => !cleared.includes(d))
      .map((d) => `${d.get("name") || d.get("email") || d.id} (${d.get("paymentStatus") || "no status"})`),
  };
}).sort((a, b) => b.remaining - a.remaining || b.owed - a.owed);

console.log(`\nREFERRAL ROLLUP — ${custSnap.size} customers, ${paidSnap.size} payout records\n`);
if (!rows.length) console.log("No referrals recorded yet.\n");

for (const r of rows) {
  const status = r.credit
    ? "SETTLED (store credit)"
    : r.remaining > 0
      ? `OWED ${money(r.remaining)}`
      : r.cashPaid > 0 ? "settled (cash)" : "nothing owed";
  console.log(`${r.ref}  —  ${r.name}`);
  console.log(`   tier ${r.tier} @ ${money(r.rate)}/ref · ${r.cleared} cleared of ${r.total} referred`);
  console.log(`   earned ${money(r.owed)}${r.capped ? " (capped from " + money(r.cleared * r.rate) + ")" : ""} · paid ${money(r.cashPaid)} · ${status}`);
  if (r.who.length) console.log(`   cleared: ${r.who.join(", ")}`);
  if (r.notCleared.length) console.log(`   not counting: ${r.notCleared.join(", ")}`);
  console.log("");
}

const totalOwed = rows.reduce((s, r) => s + r.remaining, 0);
const totalPaid = rows.reduce((s, r) => s + r.cashPaid, 0);
console.log(`TOTAL still owed: ${money(totalOwed)}   ·   already paid out: ${money(totalPaid)}`);
console.log(`Programme runs until 200 members — currently ${custSnap.size}.\n`);

process.exit(0);
