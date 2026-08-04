// Tell Randy about a lead.
//
// WHY THIS EXISTS: every lead form on the site (interested, cohort waitlist, AI
// waitlist) posted to `process.env.DISCORD_LEADS_WEBHOOK`, which has never been
// set in Vercel production. Each route guarded with `if (!url) return;`, so
// nothing errored and no lead was lost — they are all in Firestore — but nobody
// was ever notified about any of them. A notification path that silently no-ops
// is worse than none, because it reads as working.
//
// So this uses BOT_NOTIFY_URL + NOTIFY_SECRET instead: the same pair the
// estimate form already uses, already configured in production. The bot's
// POST /notify-lead DMs Randy.
//
// The old webhook is still fanned out to IF it is ever set, so configuring it
// later adds a channel post without touching this code again. Both sends are
// best-effort — a notification failure must never cost us the lead, which is
// why callers write to Firestore FIRST and call this after.

export type LeadNotice = {
  /** Headline, e.g. "New interested lead". */
  title: string;
  source: string;
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  cohort?: string;
  note?: string;
};

/** BOT_NOTIFY_URL points at /notify-estimate; swap the path for the lead route. */
function leadEndpoint(): string {
  const raw = process.env.BOT_NOTIFY_URL || "";
  if (!raw) return "";
  return raw.replace(/\/notify-estimate\/?$/, "") + "/notify-lead";
}

export async function notifyLead(lead: LeadNotice): Promise<void> {
  const url = leadEndpoint();
  const sends: Promise<unknown>[] = [];

  if (url) {
    sends.push(
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NOTIFY_SECRET ? { "x-notify-secret": process.env.NOTIFY_SECRET } : {}),
        },
        body: JSON.stringify(lead),
      }).catch(() => {}),
    );
  }

  // Optional legacy fan-out. Fires only if the webhook is actually configured.
  const hook = process.env.DISCORD_LEADS_WEBHOOK;
  if (hook) {
    sends.push(
      fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📥 **${lead.title}**${lead.name ? ` — **${lead.name}**` : ""}`,
          embeds: [{
            title: lead.title,
            description: lead.note,
            color: 0x60A5FA,
            fields: [
              { name: "Name", value: lead.name || "—", inline: true },
              { name: "Email", value: lead.email || "—", inline: true },
              ...(lead.phone ? [{ name: "Phone", value: lead.phone, inline: true }] : []),
              ...(lead.cohort ? [{ name: "Cohort", value: lead.cohort, inline: true }] : []),
            ],
            footer: { text: `${lead.source}${lead.id ? ` · ID: ${lead.id}` : ""}` },
            timestamp: new Date().toISOString(),
          }],
        }),
      }).catch(() => {}),
    );
  }

  await Promise.all(sends);
}
