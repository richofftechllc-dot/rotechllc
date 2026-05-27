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
export default admin;
