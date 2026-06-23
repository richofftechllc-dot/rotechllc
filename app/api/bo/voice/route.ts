export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel — fallback

// Strip markdown + fix pronunciations so the voice reads clean, natural prose.
function plain(s: string): string {
  return s
    .replace(/```[\s\S]*?```/g, " (code block) ")
    .replace(/[*_#>`]/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/service\s*now/gi, "Servicenow")   // say it as ONE word, not "Service Now"
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

  const key = process.env.ELEVENLABS_API_KEY;
  async function tts(v: string) {
    return fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v}`, {
      method: "POST",
      headers: { "xi-api-key": key as string, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        text: clean,
        model_id: "eleven_multilingual_v2",   // richer, less robotic than turbo
        voice_settings: { stability: 0.32, similarity_boost: 0.85, style: 0.55, use_speaker_boost: true, speed: 1.12 },
      }),
    });
  }

  const voice = String(voiceId || DEFAULT_VOICE);
  let r = await tts(voice);
  // If a custom (Bo/Flo) voice id is invalid/unavailable on the account, fall back to a known-good voice
  // so the student still hears something instead of silence.
  if ((!r.ok || !r.body) && voice !== DEFAULT_VOICE) r = await tts(DEFAULT_VOICE);

  if (!r.ok || !r.body) {
    const err = await r.text().catch(() => "");
    return new Response(`Voice failed: ${err.slice(0, 200)}`, { status: 502 });
  }
  return new Response(r.body, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}
