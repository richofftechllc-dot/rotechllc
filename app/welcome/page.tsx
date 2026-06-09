import Image from "next/image";

const FOUNDING_LINK = "https://square.link/u/iAsbUg2Z";
const DISCORD_LINK = "https://discord.gg/dtcYf8PTNa";

// Square appends order/transaction identifiers to the redirect URL after a
// successful payment. If NONE are present, the visitor did not arrive from a
// completed checkout — so we must NOT claim "payment confirmed".
const SQUARE_PROOF_PARAMS = ["transactionId", "orderId", "checkoutId", "referenceId"];

const steps = [
  {
    n: "STEP 1",
    title: "Join the Discord",
    body: "This is where everything happens — coaching, calls, quizzes, jobs, the community.",
    cta: { href: DISCORD_LINK, label: "Join Discord", cls: "bg-indigo-600 hover:bg-indigo-500" },
  },
  {
    n: "STEP 2",
    title: "Watch for Your Access Code",
    bodyNode: (
      <>Within minutes you get an email + Discord DM with your personal access code (format:{" "}
      <code className="text-orange-500 font-mono">FIRSTNAME2026</code>). That unlocks the web quiz,
      your roster profile, and the full platform.</>
    ),
  },
  {
    n: "STEP 3",
    titleNode: <>Type <code className="text-orange-500 font-mono">!start</code> in Discord</>,
    body: "That kicks off your intake and unlocks everything: your quiz link, cert track, and a free 30-min 1-on-1 with Bo.",
  },
];

export default async function Welcome({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const verified = SQUARE_PROOF_PARAMS.some((k) => {
    const v = sp?.[k];
    return typeof v === "string" ? v.length > 0 : Array.isArray(v) && v.length > 0;
  });

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-center">
      <div className="flex justify-center mb-8">
        <Image src="/bo-avatar.png" alt="Bo" width={120} height={120} className="rounded-full" />
      </div>

      {verified ? (
        <>
          <div className="text-orange-500 font-bold tracking-widest text-sm mb-4">PAYMENT CONFIRMED</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">You&apos;re in.</h1>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
            Founding Member access locked for 12 months. Here&apos;s exactly what to do next — takes 60 seconds.
          </p>
        </>
      ) : (
        <>
          <div className="text-gray-500 font-bold tracking-widest text-sm mb-4">WELCOME TO ROT</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Almost there.</h1>
          <p className="text-gray-400 text-lg mb-6 max-w-xl mx-auto">
            If you just completed checkout, you&apos;re all set — follow the steps below.
          </p>
          <div className="mb-12 max-w-xl mx-auto bg-zinc-900 border border-orange-500/30 rounded-xl p-5">
            <p className="text-gray-300 text-sm mb-4">
              Haven&apos;t locked in yet? Founding Member is a one-time <b className="text-white">$96</b> for 12 months.
            </p>
            <a
              href={FOUNDING_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 font-bold rounded-lg"
            >
              Lock In VIP Access — $96
            </a>
          </div>
        </>
      )}

      <div className="space-y-6 text-left">
        {steps.map((s) => (
          <div key={s.n} className="bg-zinc-900 border border-white/10 rounded-xl p-6">
            <div className="text-orange-500 font-bold text-sm mb-2">{s.n}</div>
            <h2 className="text-xl font-bold mb-3">{s.titleNode ?? s.title}</h2>
            <p className="text-gray-400 mb-4">{s.bodyNode ?? s.body}</p>
            {s.cta && (
              <a
                href={s.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-6 py-3 ${s.cta.cls} text-white font-bold rounded-lg`}
              >
                {s.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        Issues? DM Randy on Discord or email{" "}
        <a href="mailto:richofftechllc@gmail.com" className="text-orange-500">richofftechllc@gmail.com</a>
      </div>
    </main>
  );
}
