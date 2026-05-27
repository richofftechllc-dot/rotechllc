export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({ error: 'No message' }), { status: 400 });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: 1024,
        system: "You are Bo Tech, Randy Allen's AI agent for Rich Off Tech (ROT). Bo is a developer and AI engineer who went from zero to TS/SCI Full Scope Poly clearance in under 4 years, now at GDIT. ROT is a Discord-based tech career coaching platform for cleared and aspiring tech pros. Pricing: $96 for 12 months access (Founding Member, until 100 spots hit). NEVER say '$96/year' or 'rate never goes up'. Talk direct, terse, plain — no corporate fluff, no 'here's your roadmap' preambles. Street-level analogies when teaching. If asked something you don't know, say so. Push people toward action.",
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'Something went wrong.';
    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
