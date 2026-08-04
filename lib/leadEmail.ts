// Send the LEAD an email (not Randy — that's lib/notifyLead.ts).
//
// HOW THIS SENDS: it doesn't, directly. The site has no mail provider and the bot's
// SMTP is blocked on Railway, so outbound lead mail goes the way the welcome email
// already does — a Zapier Catch Hook fanning out to Gmail.
//
// The SITE builds the subject and body and Zapier is only transport. That is
// deliberate: copy that lives in a Zapier text box can't be reviewed in a PR, can't
// be diffed, and silently rots. The Zap is one step — Catch Hook → Gmail with
// To/Subject/Body mapped straight through — so changing what a lead reads is a
// commit here, not a hunt through a web UI.
//
// BLANK BY DEFAULT, ON PURPOSE. Same rule lib/pricing.ts uses for checkout links: a
// half-wired sender is worse than none, because it looks like people are being
// emailed when they aren't. Until ZAPIER_LEAD_EMAIL_HOOK is set this no-ops and
// `emailQueued` stays false on the record, so nobody is ever falsely marked as
// contacted.
//
// Best-effort and always called AFTER the Firestore write — a mail failure must
// never cost us the lead.

const SITE = "https://www.rotechllc.com";
const DISCORD = "https://discord.gg/dtcYf8PTNa";

export type LeadEmail =
  | { kind: "interested"; email: string; name?: string }
  | { kind: "cert-request"; email: string; name?: string; cert: string };

export const LEAD_EMAIL_LIVE = Boolean(process.env.ZAPIER_LEAD_EMAIL_HOOK);

/** The free guides an interested lead is promised on the home fork. One list.
 *
 * The Security+ and ServiceNow CSA study plans are deliberately NOT here. Those
 * roadmaps are part of what a cert buyer pays for; emailing them to anyone who
 * types an address gives the product away. Keep this list and the one in
 * CommittedOrInterested.tsx identical - the site must not promise something the
 * email doesn't send. */
export const FREE_RESOURCES: Array<{ label: string; path: string }> = [
  { label: "AWS AI study plan", path: "/resources/rot-aws-ai-study-plan.html" },
  { label: "FAQ", path: "/resources/rot-faq.html" },
  { label: "How it works", path: "/resources/rot-how-it-works.html" },
];

const greet = (name?: string) => `Hey${name ? ` ${name.split(" ")[0]}` : ""} —`;

// Plain, calm, no exclamation marks — the tone the cert welcome emails already use.
// Brown heart per the ROT standard.
function build(p: LeadEmail): { subject: string; html: string } {
  if (p.kind === "cert-request") {
    return {
      subject: `Got you — ${p.cert} 🤎`,
      html: `
        <p>${greet(p.name)}</p>
        <p>You asked about <strong>${p.cert}</strong>. If there's an online exam for it, we coach it.</p>
        <p>A member of the team will come back to you with a plan and a price ASAP. Pricing on these
        is per person — it depends on the voucher, your timeline, and how much coaching you want.</p>
        <p>Want to move faster? <a href="${SITE}/help#agents">Talk to the Cert Qualifier</a> — it is free and takes about five minutes.</p>
        <p>— Bo</p>
      `,
    };
  }
  const list = FREE_RESOURCES
    .map((r) => `<li><a href="${SITE}${r.path}">${r.label}</a></li>`)
    .join("\n");
  return {
    subject: "Your free ROT guides 🤎",
    html: `
      <p>${greet(p.name)}</p>
      <p>You said you're interested, so here's the stuff. No card, no catch.</p>
      <ul>${list}</ul>
      <p>Read them. Use them. Pass without us if you want — that's a real option and I mean it.</p>
      <p>Chasing Security+ or ServiceNow CSA? Those roadmaps come with the coaching —
      <a href="${SITE}/certifications">have a look</a> and a coach will build yours around
      your exam date.</p>
      <p>When you're ready to stop researching and start moving, the Discord is free too:
      <a href="${DISCORD}">discord.gg/rotechllc</a></p>
      <p>— Bo</p>
    `,
  };
}

/** Returns true if the payload was handed off, false if no sender is configured. */
export async function sendLeadEmail(payload: LeadEmail): Promise<boolean> {
  const hook = process.env.ZAPIER_LEAD_EMAIL_HOOK;
  if (!hook) return false;
  const { subject, html } = build(payload);
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Flat keys — Zapier maps these straight into the Gmail step with no
      // Formatter and no branching, which keeps the Zap to a single action.
      body: JSON.stringify({ to: payload.email, subject, html, kind: payload.kind }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
