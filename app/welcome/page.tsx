import Image from "next/image";

// Membership checkout. Comes from lib/pricing.ts so the price and the URL that
// charges it can never drift apart. Blank until the $375 Square link exists —
// the old $227 link is NOT reused, it charges the wrong amount.
import { CHECKOUT, COACH_FALLBACK } from "@/lib/pricing";
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
      <code className="text-rot-accent font-mono">FIRSTNAME2026</code>). That unlocks the web quiz,
      your roster profile, and the full platform.</>
    ),
  },
  {
    n: "STEP 3",
    titleNode: <>Join Discord — your role is automatic</>,
    body: "Join with the same Discord name you used at checkout and Bo assigns your role on sight — no commands to type. He'll DM you your login code and a Start button for your 30-second intro.",
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
          <div className="text-rot-accent font-bold tracking-widest text-sm mb-4">PAYMENT CONFIRMED</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">You&apos;re in.</h1>
          <p className="text-rot-muted text-lg mb-12 max-w-xl mx-auto">
            Founding Member access locked for 12 months. Here&apos;s exactly what to do next — takes 60 seconds.
          </p>
        </>
      ) : (
        <>
          <div className="text-rot-faint font-bold tracking-widest text-sm mb-4">WELCOME TO ROT</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Almost there.</h1>
          <p className="text-rot-muted text-lg mb-6 max-w-xl mx-auto">
            If you just completed checkout, you&apos;re all set — follow the steps below.
          </p>
          <div className="mb-12 max-w-xl mx-auto bg-rot-surface border border-rot-accent/30 rounded-xl p-5">
            <p className="text-rot-muted text-sm mb-4">
              Haven&apos;t locked in yet? Membership is a one-time <b className="text-rot-fg">$375</b> for 12 months.
            </p>
            <a
              href={CHECKOUT.yearly || COACH_FALLBACK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-gradient-to-r from-rot-accent to-rot-accent-2 font-bold rounded-lg"
            >
              {CHECKOUT.yearly ? "Lock In VIP Access — $375" : "Talk to a coach to join"}
            </a>
          </div>
        </>
      )}

      <div className="space-y-6 text-left">
        {steps.map((s) => (
          <div key={s.n} className="bg-rot-surface border border-rot-line rounded-xl p-6">
            <div className="text-rot-accent font-bold text-sm mb-2">{s.n}</div>
            <h2 className="text-xl font-bold mb-3">{s.titleNode ?? s.title}</h2>
            <p className="text-rot-muted mb-4">{s.bodyNode ?? s.body}</p>
            {s.cta && (
              <a
                href={s.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block px-6 py-3 ${s.cta.cls} text-rot-fg font-bold rounded-lg`}
              >
                {s.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-rot-faint text-sm">
        Issues? DM Randy on Discord or email{" "}
        <a href="mailto:richofftechllc@gmail.com" className="text-rot-accent">richofftechllc@gmail.com</a>
      </div>
    </main>
  );
}
