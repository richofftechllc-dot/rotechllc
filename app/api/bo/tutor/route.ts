import { getTutor, buildTutorSystem } from "@/lib/tutors";
import { coll } from "@/lib/firebase";
import { getAuthedAdmin } from "@/lib/admin";
import { allowedPrefixes } from "@/lib/access";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_SECRET = process.env.SESSION_SECRET || "";
const TRACK_NAMES: Record<string, string> = { sp: "Security+", csa: "ServiceNow CSA", ai: "AWS AI Practitioner" };

// Resolve the member's OWNED tracks from their session server-side — never trust a
// client-sent track. Returns the scope instruction appended to the tutor's system prompt.
async function scopeForSession(req: Request): Promise<string> {
  let isCoach = false;
  try { isCoach = !!(await getAuthedAdmin(req)); } catch { isCoach = false; }
  if (isCoach) return "\n\nSCOPE: This user is a ROT COACH — unrestricted. Help with any track, any depth.";

  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/(?:^|;\s*)rot_session=([^;]+)/);
  const token = m ? decodeURIComponent(m[1]) : "";
  let track: string | null = null;
  if (token && SESSION_SECRET) {
    const i = token.lastIndexOf(".");
    if (i > 0 && crypto.createHmac("sha256", SESSION_SECRET).update(token.slice(0, i)).digest("hex") === token.slice(i + 1)) {
      const payload = token.slice(0, i);
      try {
        const snap = payload.startsWith("discord:")
          ? await coll("customers").where("discordId", "==", payload.split(":")[1]).limit(1).get()
          : await coll("customers").where("quizCode", "==", payload).limit(1).get();
        if (!snap.empty) track = (snap.docs[0].data().track as string) || null;
      } catch { /* no track */ }
    }
  }
  const owned = [...allowedPrefixes(track)].map((p) => TRACK_NAMES[p]).filter(Boolean).join(", ");
  return `\n\nSCOPE: This member has quiz access to: ${owned || "AWS AI Practitioner"}. Give full teaching/study content ONLY for those track(s). If they ask you to TEACH material for a track they haven't unlocked (e.g. Security+ or ServiceNow CSA when not owned), do NOT teach it — give a one-line career-level answer (which cert fits them, whether it's worth it) and tell them they can unlock that track from the quiz page. Light cross-track career questions are fine; off-track study content is not.`;
}

// Streaming tutor endpoint. Builds the system prompt from the tutor roster
// (incl. kid-safe guardrails) and streams the model's reply as plain text.
export async function POST(req: Request) {
  let body: { tutorId?: string; messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const tutor = getTutor(body?.tutorId);
  const messages = (body?.messages || []).filter((m) => m?.content?.trim()).slice(-12);
  if (!messages.length) return new Response("no messages", { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      `(${tutor.name} is in local test mode — add ANTHROPIC_API_KEY to .env.local and I'll respond for real.)`,
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    );
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildTutorSystem(tutor) + (await scopeForSession(req)),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const err = await upstream.text().catch(() => "");
    return new Response(`(${tutor.name} couldn't respond. ${err.slice(0, 200)})`, { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            const l = line.trim();
            if (!l.startsWith("data:")) continue;
            const data = l.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const j = JSON.parse(data);
              if (j.type === "content_block_delta" && j.delta?.type === "text_delta") {
                controller.enqueue(encoder.encode(j.delta.text));
              }
            } catch { /* skip non-JSON keepalive lines */ }
          }
        }
      } catch { /* upstream closed */ }
      controller.close();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
}
