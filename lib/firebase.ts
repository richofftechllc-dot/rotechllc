import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64 || "", "base64").toString("utf-8"),
    }),
  });
}

export const db = admin.firestore();

// Environment-aware collection prefix.
// Production (VERCEL_ENV=production) → no prefix → real data
// Preview / Development / local → "test_" prefix → isolated test data
const PREFIX = process.env.VERCEL_ENV === "production" ? "" : "test_";

export function coll(name: string) {
  return db.collection(`${PREFIX}${name}`);
}

export const IS_PROD = process.env.VERCEL_ENV === "production";

export default admin;
