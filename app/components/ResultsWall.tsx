// RESULTS WALL — real member wins, on a static background with two screenshot rows
// that scroll continuously in opposite directions.
//
// PRIVACY — read before touching the images in public/wins/:
// Every screenshot was redacted before it was committed. The CompTIA result screens had
// the Vantage title bar cropped off entirely, which removes three things at once: the
// student's full name, their exam ACCESS CODE, and the proctor webcam still. The left
// column (the "<Full Name>," line) is masked out on top of that. The ServiceNow CSA pass
// has its "Dear <name>," line masked. What survives is the part that is actually proof:
// the cert badge, SY0-701, and the score line.
// Members are credited by FIRST NAME ONLY, from the announcements Randy posted himself.
// Never replace these files with unredacted originals.
//
// Pure CSS animation (no JS, no library) and it stops for prefers-reduced-motion.

type Win = {
  img: string;
  first: string;
  cert: string;
  score?: string;
  location?: string;
};

// Scores read off the redacted images. Locations come from Randy's own #wins posts.
const WINS: Win[] = [
  { img: "/wins/secplus-rayanthony.jpg", first: "Rayanthony", cert: "Security+", score: "823", location: "Orlando, FL" },
  { img: "/wins/secplus-cameron.jpg", first: "Cameron", cert: "Security+", score: "816", location: "Birmingham, AL" },
  { img: "/wins/secplus-lavonda.jpg", first: "Lavonda", cert: "Security+", score: "816", location: "Hampton Roads, VA" },
  { img: "/wins/secplus-cody.jpg", first: "Cody", cert: "Security+", score: "814", location: "Newport News, VA" },
  { img: "/wins/secplus-shemar.jpg", first: "Shemar", cert: "Security+", score: "812", location: "Newport News, VA" },
  { img: "/wins/secplus-garrett.jpg", first: "Garrett", cert: "Security+", score: "811" },
  { img: "/wins/secplus-laquon.jpg", first: "LaQuon", cert: "Security+", score: "808" },
  { img: "/wins/secplus-malik.jpg", first: "Malik", cert: "Security+", score: "797", location: "Newport News, VA" },
  { img: "/wins/csa-gregory.jpg", first: "Gregory", cert: "ServiceNow CSA", location: "Passed June 11, 2026" },
];

// Job outcomes are quoted, not screenshotted. The offer letters we hold are the hiring
// company's confidential documents (employer name, office address, contract terms) and a
// recruiter's name, so they are not republished — the member's own words carry it.
type Outcome = { quote: string; who: string; detail: string };

const OUTCOMES: Outcome[] = [
  {
    quote: "2 fully remote help desk offers under 60 days is a win for me man",
    who: "Malik",
    detail: "Security+ · 2 remote offers",
  },
  {
    quote: "Got 1 offer letter in the bag. Bouta see what these other 2 positions talking bout",
    who: "J.",
    detail: "1 offer signed, 2 more in play",
  },
  {
    quote: "Fully remote. Formal offer today. 120k.",
    who: "Randy",
    detail: "ServiceNow Software Engineer · $120k remote",
  },
  {
    quote: "THANKS TO YOU and everyone else you've put on",
    who: "Eliza",
    detail: "New role · $45/hr, $95k conversion",
  },
];

function Card({ w }: { w: Win }) {
  return (
    <figure className="shrink-0 w-[300px] sm:w-[380px] mx-3">
      <div className="rounded-xl overflow-hidden border border-white/15 bg-white">
        {/* Plain img, not next/image: these are fixed-size local assets inside a
            transform-animated track, where the fill/layout machinery buys nothing. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={w.img} alt={`${w.cert} pass — ${w.first}`} loading="lazy" className="w-full h-auto block" />
      </div>
      <figcaption className="mt-2 text-xs text-gray-400 flex flex-wrap gap-x-2">
        <span className="text-white font-bold">{w.first}</span>
        <span className="text-orange-400 font-semibold">{w.cert}</span>
        {w.score && <span>scored {w.score}</span>}
        {w.location && <span className="text-gray-500">· {w.location}</span>}
      </figcaption>
    </figure>
  );
}

export default function ResultsWall() {
  // Each row renders its list twice; the track slides exactly -50%, so the seam lands on
  // an identical frame and the loop reads as continuous.
  const rowA = WINS;
  const rowB = [...WINS].reverse();

  return (
    <section id="results" className="relative border-t border-white/5 overflow-hidden bg-black">
      {/* Static background — fixed gradient wash, deliberately not animated so the moving
          screenshots are the only thing in motion. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.16),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.12),transparent_55%)]"
      />

      <div className="relative py-20">
        <div className="max-w-6xl mx-auto px-6 text-center mb-12">
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">REAL RESULTS</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Receipts, not promises.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every member here who landed a role holds <span className="text-white font-bold">Security+</span>,{" "}
            <span className="text-white font-bold">ServiceNow CSA</span>, or both. Names and exam
            codes are redacted — the scores are not.
          </p>
        </div>

        {/* Row 1 — drifts left */}
        <div className="rot-marquee mb-8">
          <div className="rot-track rot-left">
            {[...rowA, ...rowA].map((w, i) => (
              <Card key={`a-${i}`} w={w} />
            ))}
          </div>
        </div>

        {/* Row 2 — drifts right, so the two rows counter-scroll */}
        <div className="rot-marquee">
          <div className="rot-track rot-right">
            {[...rowB, ...rowB].map((w, i) => (
              <Card key={`b-${i}`} w={w} />
            ))}
          </div>
        </div>

        {/* Job outcomes — quoted */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div className="text-center text-orange-500 font-bold tracking-widest text-sm mb-6">
            THEN THE OFFERS CAME
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {OUTCOMES.map((o) => (
              <blockquote key={o.who + o.detail} className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 backdrop-blur">
                <p className="text-gray-200 text-sm leading-relaxed">&ldquo;{o.quote}&rdquo;</p>
                <footer className="mt-3 text-xs">
                  <span className="text-white font-bold">{o.who}</span>
                  <span className="text-gray-500"> — {o.detail}</span>
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center mt-6">
            Shared with permission. Full names, exam access codes, and employer documents are withheld.
          </p>
        </div>
      </div>
    </section>
  );
}
