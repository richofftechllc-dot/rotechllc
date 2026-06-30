import CohortWaitlist from "../components/CohortWaitlist";

export const dynamic = "force-dynamic";

const DISCORD_LINK = "https://discord.gg/dtcYf8PTNa";

// Shown when there's no community call on the calendar (e.g. Bo's away). Edit as needed.
const AWAY_NOTE = "Bo's in Cancun this week 🌴 — no community call this Sunday. Back for the July Cohorts.";

// A featured one-off community call, shown when the live calendar feed isn't available
// (e.g. calendar creds aren't set in this environment). Set to null once it has passed.
const FEATURED_EVENT: { topic: string; startISO: string; meetUrl?: string; description: string } | null = {
  topic: "Claris (Apple AI) — Early-Access Community Call",
  startISO: "2026-07-02T18:00:00-04:00",
  description: "An early-access look at Claris (Apple AI), live in the ROT Discord. Open to all members — bring your questions.",
};

type NextSunday =
  | { status: "scheduled"; topic: string; startISO: string | null; meetUrl?: string; description?: string }
  | { status: "none" };

async function getNextSunday(): Promise<NextSunday> {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const res = await fetch(`${base}/api/next-sunday`, { cache: "no-store" });
    if (!res.ok) return { status: "none" };
    return (await res.json()) as NextSunday;
  } catch {
    return { status: "none" };
  }
}

function fmt(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long", month: "long", day: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).format(d) + " ET";
  return { date, time };
}

export default async function Calls() {
  const next = await getNextSunday();
  // Prefer the live calendar; fall back to a featured one-off event if set.
  const ev = next.status === "scheduled" ? next : FEATURED_EVENT;
  const when = ev ? fmt(ev.startISO) : null;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-6xl md:text-8xl font-black text-center mb-4">Sundays.</h1>
      <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto text-lg">
        Every Sunday the community comes together — cert walkthroughs, career strategy, live Q&amp;A. Pulled live from Bo&apos;s calendar.
      </p>

      {/* THIS SUNDAY — live from the calendar */}
      <div className="border border-orange-500/30 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="text-orange-500 text-sm font-bold tracking-widest text-center mb-3">NEXT COMMUNITY CALL</div>
        {ev ? (
          <>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">{ev.topic}</h2>
            {when && <p className="text-gray-400 text-center mb-6">{when.date} · {when.time}</p>}
            {ev.description && (
              <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8 leading-relaxed">{ev.description}</p>
            )}
            <div className="flex flex-col items-center gap-3">
              {ev.meetUrl && (
                <a href={ev.meetUrl} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90 text-base">
                  Join the Google Meet
                </a>
              )}
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/5 text-base">
                Join the Discord — Free
              </a>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">No community call this week</h2>
            <p className="text-gray-300 text-center max-w-2xl mx-auto mb-8 leading-relaxed">{AWAY_NOTE}</p>
            <div className="flex justify-center">
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:opacity-90 text-base">
                Join the Discord — Free
              </a>
            </div>
          </>
        )}
        <div className="text-center text-gray-500 text-xs mt-8">
          Sessions run in Discord voice + screen-share. Recordings posted in the same server.
        </div>
      </div>

      {/* JULY COHORTS — waitlist */}
      <div className="border border-orange-500/40 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto bg-zinc-950 mt-10">
        <div className="text-center mb-6">
          <div className="text-orange-500 text-xs font-bold tracking-widest mb-2">DROPPING THIS MONTH</div>
          <h2 className="text-3xl md:text-4xl font-black mb-3">July Cohorts are coming. 🚀</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Live, instructor-led cert cohorts kick off when Bo&apos;s back. Seats are limited. Get on the waitlist now and we&apos;ll <b className="text-white">text you the second they drop</b> — first dibs before it goes public.
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <CohortWaitlist cohort="july-2026" />
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
