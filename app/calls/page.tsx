// Sunday community session config. Update before the call.
//   topic / host / time / google_meet_url for link-out.
//   live_youtube_url (optional) embeds a YouTube Live player on this page when set.
const NEXT_SUNDAY = {
  date: "Sunday, June 1, 2026",
  time: "7:00 PM ET",
  topic: "AWS AI Practitioner — Domain 1 Walkthrough",
  host: "Bo",
  description: "Live walkthrough of AWS AI Practitioner Domain 1 — Fundamentals of AI. Bring questions; we'll work through the trickiest exam topics together.",
  google_meet_url: "https://meet.google.com/your-meet-code",
  live_youtube_url: "",
};

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [/youtu\.be\/([^?&#]+)/, /youtube\.com\/watch\?v=([^&#]+)/, /youtube\.com\/embed\/([^?#]+)/, /youtube\.com\/live\/([^?#]+)/];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}

export default function Calls() {
  const ytId = extractYouTubeId(NEXT_SUNDAY.live_youtube_url);
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-6xl md:text-8xl font-black text-center mb-4">Sundays.</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto text-lg">
        Every Sunday the community comes together. Cert walkthroughs, career strategy, live Q&amp;A. Members join via the link below.
      </p>

      <div className="border border-orange-500/30 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="text-orange-500 text-sm font-bold tracking-widest text-center mb-3">UPCOMING SUNDAY</div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">{NEXT_SUNDAY.topic}</h2>
        <p className="text-gray-400 text-center mb-1">{NEXT_SUNDAY.date} · {NEXT_SUNDAY.time}</p>
        {NEXT_SUNDAY.host && <p className="text-gray-500 text-sm text-center mb-6">with {NEXT_SUNDAY.host}</p>}

        {ytId && (
          <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10 mb-6 mt-4">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0`}
              title={NEXT_SUNDAY.topic}
              className="w-full h-full"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8 leading-relaxed mt-4">
          {NEXT_SUNDAY.description}
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {NEXT_SUNDAY.google_meet_url && (
            <a
              href={NEXT_SUNDAY.google_meet_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90"
            >
              Join Google Meet ↗
            </a>
          )}
          <a
            href="https://discord.gg/3gFdWYtPB"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5"
          >
            Discuss in Discord
          </a>
        </div>

        <div className="text-center text-gray-500 text-xs mt-8">
          Hosted on Google Meet{NEXT_SUNDAY.live_youtube_url ? " · Simulcast on YouTube Live" : ""} · Recordings posted in Discord
        </div>
      </div>
    </main>
  );
}
