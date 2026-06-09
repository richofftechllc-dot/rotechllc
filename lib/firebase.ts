import admin from "firebase-admin";

if (!admin.apps.length) {
  const hasCreds =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (hasCreds) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64 || "", "base64").toString("utf-8"),
      }),
    });
  } else {
    // No Firebase creds present (e.g. Vercel Preview env, which doesn't have the
    // production secrets). Init a credential-less stub so module evaluation and
    // `next build` don't crash. Firestore calls fail at runtime — fine for
    // preview builds, which never touch real data. Production always has creds.
    admin.initializeApp({ projectId: "preview-build-stub" });
  }
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
