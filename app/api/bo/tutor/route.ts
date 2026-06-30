import { getTutor, buildTutorSystem } from "@/lib/tutors";
import { getAuthedAdmin } from "@/lib/admin";
import { getAuthedCode } from "@/lib/session";
import { coll } from "@/lib/firebase";
import { buildAccessNote } from "@/lib/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Msg = { role: "user" | "assistant"; content: string };

// Streaming tutor endpoint. Builds the system prompt from the tutor roster
// (incl. kid-safe guardrails) and streams the model's reply as plain text.
export async function POST(req: Request) {
  let body: { tutorId?: string; messages?: Msg[] };
  try {
    body = await req.json();
  } catch {
    return new Response("bad json", { status: 400 });
  }
  let tutor = getTutor(body?.tutorId);
  // K-12 (kid-safe) tutors are staff-only. Anyone who isn't a coach gets Bo Tech instead.
  if (tutor.kidSafe) {
    const admin = await getAuthedAdmin(req).catch(() => null);
    if (!admin) tutor = getTutor("bo");
  }
  const messages = (body?.messages || []).filter((m) => m?.content?.trim()).slice(-12);
  if (!messages.length) return new Response("no messages", { status: 400 });

  // Track-gate teaching: AWS AI + general help is free; CSA/Security+ deep content is
  // only for members who unlocked that track. Look up the member's track from their session.
  let track: string | null = null;
  try {
    const code = await getAuthedCode(req);
    if (code) {
      const snap = await coll("customers").where("quizCode", "==", code).limit(1).get();
      if (!snap.empty) track = (snap.docs[0].data().track as string) || null;
    }
  } catch { /* anon / no session → AWS-AI-free baseline */ }
  const accessNote = buildAccessNote(track);

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
      system: buildTutorSystem(tutor) + "\n\n" + accessNote,
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
