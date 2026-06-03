// lib/mux.ts — SERVER ONLY. Mints short-lived signed Mux playback JWTs.
// The Mux signing private key is read from env and NEVER sent to the client.
import jwt from "jsonwebtoken";

const KEY_ID = process.env.MUX_SIGNING_KEY_ID || "";
// Mux provides the signing private key base64-encoded; decode to the PEM.
const PRIVATE_KEY = Buffer.from(process.env.MUX_SIGNING_PRIVATE_KEY || "", "base64").toString("utf-8");

// Sign a playback token for a Mux playbackId.
//   aud "v" = video playback · sub = playbackId · exp = now + ttl (default 2h)
//   the signing key id goes in the JWT header `kid` (via jsonwebtoken's `keyid`).
export function signPlaybackToken(playbackId: string, ttlSeconds = 2 * 60 * 60): string {
  if (!KEY_ID || !PRIVATE_KEY) {
    throw new Error("Mux signing key not configured (MUX_SIGNING_KEY_ID / MUX_SIGNING_PRIVATE_KEY)");
  }
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    { sub: playbackId, aud: "v", exp: now + ttlSeconds },
    PRIVATE_KEY,
    { algorithm: "RS256", keyid: KEY_ID }
  );
}
