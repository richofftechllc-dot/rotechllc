export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel — fallback

// Strip markdown so the voice reads clean prose, not asterisks/backticks.
function plain(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " (code block) ")
    .replace(/[*_#>`]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2500);
}

export async function POST(req: Request) {
  const { text, voiceId } = await req.json().catch(() => ({ text: "", voiceId: "" }));
  const clean = plain(String(text || ""));
  if (!clean) return new Response("no text", { status: 400 });
  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response("ElevenLabs key not set (add ELEVENLABS_API_KEY to .env.local).", { status: 501 });
  }

  const voice = String(voiceId || DEFAULT_VOICE);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: clean,
      model_id: "eleven_turbo_v2_5",
      voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true },
    }),
  });

  if (!r.ok || !r.body) {
    const err = await r.text().catch(() => "");
    return new Response(`Voice failed: ${err.slice(0, 200)}`, { status: 502 });
  }
  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}
