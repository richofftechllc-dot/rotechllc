// grader.js — Coordinator Call Grader (webhook-driven, no polling)
// Fireflies fires a webhook when a transcript is ready -> bot grades that call -> DMs Bo.
//
// INTEGRATION (in index.js, where your Express `app` and Discord `client` already
// live, after firebase-admin is initialized):
//
//   const { mountGrader } = require('./grader');
//   mountGrader(app, client, admin.firestore());
//
// Then in Fireflies -> Settings -> Developer / Webhooks, set the webhook URL to:
//   https://<your-railway-host>/fireflies-webhook
// set a secret, and put that same value in Railway as FIREFLIES_WEBHOOK_SECRET.
//
// ENV:
//   FIREFLIES_API_KEY        - Fireflies API key (to fetch the transcript)
//   ANTHROPIC_API_KEY        - already set for the bot
//   OWNER_DISCORD_ID         - your Discord user ID (grades DM'd here)
//   FIREFLIES_WEBHOOK_SECRET - optional shared secret to verify the webhook
//   GRADER_MODEL             - optional, default claude-sonnet-4-6 (match your bot's)
//   COORDINATOR_EMAILS       - optional, comma-separated; default Daquan + Tyler
//
// If FIREFLIES_API_KEY or OWNER_DISCORD_ID is missing, the route is NOT mounted and
// the bot runs normally.

const Anthropic = require('@anthropic-ai/sdk');

const FIREFLIES_API = 'https://api.fireflies.ai/graphql';
const MODEL = process.env.GRADER_MODEL || 'claude-sonnet-4-6';

const COORDINATOR_EMAILS = (
  process.env.COORDINATOR_EMAILS || 'daquanhundreds@gmail.com,theelinuxgirl@gmail.com'
).split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

const GRADING_PROMPT = `You are a call-QA coach for Rich Off Tech. This call was run by a ROT coordinator. Identify the coordinator and grade how they handled it. Be direct and specific - like a sharp sales manager, no fluff.
Score 1-5 each: Opening/rapport; Discovery (right qualifying questions); Accuracy (correct on cert paths / clearance eligibility / pricing - flag any wrong or overpromised claim); Objection handling; Clear next step (booked strategy call / deposit / follow-up); Professionalism.
Then output: Overall /30; one thing they did well; top 3 improvements each with a quote from the call; any compliance red flags (wrong clearance/pricing claims, guarantees) or "none". Keep under 250 words.`;

async function ffQuery(query, variables) {
  const res = await fetch(FIREFLIES_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIREFLIES_API_KEY}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error('Fireflies: ' + JSON.stringify(json.errors));
  return json.data;
}

// NOTE: if Fireflies rejects a field here, it's a one-line schema fix.
async function fetchTranscript(id) {
  const query = `query One($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      participants
      summary { overview }
      sentences { speaker_name text }
    }
  }`;
  const data = await ffQuery(query, { id });
  return data.transcript;
}

function isCoordinatorCall(t) {
  const parts = (t.participants || []).map(p => String(p).toLowerCase());
  return parts.some(p => COORDINATOR_EMAILS.includes(p));
}

function transcriptText(t) {
  if (Array.isArray(t.sentences) && t.sentences.length) {
    return t.sentences.map(s => `${s.speaker_name || '?'}: ${s.text}`).join('\n');
  }
  return (t.summary && t.summary.overview) || '';
}

async function gradeCall(anthropic, t) {
  const body = `Coordinator emails on file: ${COORDINATOR_EMAILS.join(', ')}
Call title: ${t.title}
Participants: ${(t.participants || []).join(', ')}

Transcript:
${transcriptText(t).slice(0, 45000)}`;
  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 700,
    system: GRADING_PROMPT,
    messages: [{ role: 'user', content: body }],
  });
  return msg.content.map(b => b.text || '').join('').trim();
}

async function processOne(meetingId, client, db, anthropic) {
  const ref = db.collection('gradedCalls').doc(meetingId);
  if ((await ref.get()).exists) return;            // idempotency - already graded
  const t = await fetchTranscript(meetingId);
  if (!t || !isCoordinatorCall(t)) return;          // skip non-coordinator calls
  const scorecard = await gradeCall(anthropic, t);
  const owner = await client.users.fetch(process.env.OWNER_DISCORD_ID);
  await owner.send(
    `\u{1F4CB} **Call Grade - ${t.title}**\n` +
    `${t.date ? new Date(t.date).toLocaleString() : ''}\n\n${scorecard}`
  );
  await ref.set({
    title: t.title,
    date: t.date || null,
    participants: t.participants || [],
    gradedAt: Date.now(),
  });
  console.log('[grader] graded + DM sent:', t.title);
}

function mountGrader(app, client, db) {
  if (!process.env.FIREFLIES_API_KEY || !process.env.OWNER_DISCORD_ID) {
    console.warn('[grader] FIREFLIES_API_KEY or OWNER_DISCORD_ID missing - webhook not mounted.');
    return;
  }
  const express = require('express');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  app.post('/fireflies-webhook', express.json(), (req, res) => {
    // optional shared-secret check (header or ?secret=)
    const secret = process.env.FIREFLIES_WEBHOOK_SECRET;
    if (secret && (req.get('x-fireflies-secret') || req.query.secret) !== secret) {
      return res.sendStatus(401);
    }
    res.sendStatus(200); // ack fast so Fireflies doesn't retry/timeout
    const b = req.body || {};
    const meetingId = b.meetingId || b.meeting_id || b.id;
    if (!meetingId) return;
    processOne(meetingId, client, db, anthropic)
      .catch(e => console.error('[grader] webhook process failed:', e.message));
  });

  console.log('[grader] webhook mounted at POST /fireflies-webhook');
}

module.exports = { mountGrader };
