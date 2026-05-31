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

        <div className="flex flex-col items-center gap-3">
          <a
            href="https://square.link/u/7P6knSUK"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90 text-base"
          >
            Join Discord — $96 for the year
          </a>
          <div className="text-orange-400 font-bold tracking-wider text-xs uppercase text-center leading-relaxed">
            One-time payment · 12 months access · First 100 only<br />
            <span className="text-gray-500 normal-case font-normal">No monthly billing. Founding rate.</span>
          </div>
        </div>

        <div className="text-center text-gray-500 text-xs mt-8">
          Sessions run in Discord voice + screen-share. Recordings posted in the same server.
        </div>
      </div>

      {/* LAST SESSION — most recent past Sunday recording */}
      <div className="border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto bg-zinc-950 mt-10">
        <div className="text-gray-400 text-xs font-bold tracking-widest text-center mb-3 uppercase">From the Last Session</div>
        <h3 className="text-xl md:text-2xl font-bold text-center mb-4">January 14, 2026 — Community Call</h3>
        <div className="aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
          <iframe
            src="https://www.youtube.com/embed/ib8MfsAzT6k?rel=0"
            title="ROT Community Call · January 14, 2026"
            className="w-full h-full"
            loading="lazy"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="text-gray-500 text-xs text-center mt-4">Past sessions live on YouTube. Subscribe to <a href="https://www.youtube.com/@RichOffTechLLc" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-bold">@RichOffTechLLc</a> for the full archive.</p>
      </div>
    </main>
  );
}
