// Authenticate a request via the rot_session HMAC cookie.
// Returns the signed-in code, or null if there's no valid session.
// Edge-runtime safe (uses Web Crypto, no Node-only APIs).

export async function getAuthedCode(req: Request): Promise<string | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;

  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)rot_session=([^;]+)/);
  if (!m) return null;
  const token = decodeURIComponent(m[1]);

  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const expected = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  if (sig !== expected) return null;

  // Code-based session: payload IS the code.
  // Discord-based session: payload is "discord:<id>:<base64name>" — no code here,
  // and the resume builder requires a code anyway, so we reject discord-only.
  if (payload.startsWith("discord:")) return null;
  return payload;
}
