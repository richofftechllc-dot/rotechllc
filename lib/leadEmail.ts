// Send the LEAD an email (not Randy — that's lib/notifyLead.ts).
//
// HOW THIS SENDS: it doesn't, directly. The site has no mail provider and the bot's
// SMTP is blocked on Railway, so outbound mail goes the same way the welcome email
// already does — a Zapier Catch Hook that fans out to Gmail. This posts the payload;
// the Zap owns the sending and the templating.
//
// BLANK BY DEFAULT, ON PURPOSE. Same rule lib/pricing.ts uses for checkout links: a
// half-wired sender is worse than none, because it looks like people are being
// emailed when they aren't. Until ZAPIER_LEAD_EMAIL_HOOK is set this no-ops and
// `emailQueued` stays false on the record, so nobody is ever falsely marked as
// contacted. Set the env var and it starts sending with no code change.
//
// Best-effort and always called AFTER the Firestore write — a mail failure must
// never cost us the lead.

export type LeadEmail =
  | {
      kind: "interested";
      email: string;
      name?: string;
      /** Absolute URLs to the free guides, so the Zap template doesn't hardcode them. */
      resources: Array<{ label: string; url: string }>;
    }
  | {
      kind: "cert-request";
      email: string;
      name?: string;
      cert: string;
    };

export const LEAD_EMAIL_LIVE = Boolean(process.env.ZAPIER_LEAD_EMAIL_HOOK);

/** Returns true if the payload was handed off, false if no sender is configured. */
export async function sendLeadEmail(payload: LeadEmail): Promise<boolean> {
  const hook = process.env.ZAPIER_LEAD_EMAIL_HOOK;
  if (!hook) return false;
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** The free guides an interested lead is promised on the home fork. One list. */
export function freeResources(origin: string): Array<{ label: string; url: string }> {
  return [
    { label: "Security+ study plan", url: `${origin}/resources/rot-secplus-study-plan.html` },
    { label: "ServiceNow CSA study plan", url: `${origin}/resources/rot-csa-study-plan.html` },
    { label: "AWS AI study plan", url: `${origin}/resources/rot-aws-ai-study-plan.html` },
    { label: "FAQ", url: `${origin}/resources/rot-faq.html` },
    { label: "How it works", url: `${origin}/resources/rot-how-it-works.html` },
  ];
}
