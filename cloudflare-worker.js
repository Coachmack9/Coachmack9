/* ═══════════════════════════════════════════
   ProBot Solutions — Cloudflare Worker Proxy
   Sits between the chat widget and Claude API.

   SETUP (Cloudflare Dashboard):
   1. Workers & Pages → Create Worker → paste this code
   2. Settings → Variables → add secret:
        ANTHROPIC_API_KEY = sk-ant-...  (your key)
   3. Note your worker URL:
        https://probot-chat.<your-subdomain>.workers.dev
   4. Paste that URL into chat-widget.js WORKER_URL
   ═══════════════════════════════════════════ */

const ALLOWED_ORIGINS = [
  'https://probotma.boston',
  'https://coachmack9.github.io',
];
const ANTHROPIC_URL  = 'https://api.anthropic.com/v1/messages';
const MODEL          = 'claude-haiku-4-5-20251001';
const MAX_TOKENS     = 512;

const SYSTEM_PROMPT = `You are ProBot, the AI assistant for ProBot Solutions — a Boston-based company that builds and deploys AI voice agents for home service businesses across Massachusetts and New England.

Your role is to answer questions from website visitors quickly and helpfully, and guide them toward booking a free demo call.

## What ProBot Solutions Offers

**Core Service — AI Voice Agent**
- A 24/7 AI receptionist that answers every call, qualifies the lead, and dispatches the job
- Never misses a call — works nights, weekends, holidays
- Integrates with scheduling software (ServiceTitan, Jobber, Housecall Pro, etc.)
- Can send SMS dispatch notifications and confirmations
- Built on Vapi / ElevenLabs / Bland AI / Retell AI platforms

**Pricing (3 tiers):**
- Starter: $97/month — up to 500 calls/month, basic call handling
- Growth: $197/month — up to 1,500 calls, SMS dispatch, priority support
- Pro: $297/month — unlimited calls, white-glove setup, dedicated account manager
- All plans include 30-day money-back guarantee

**Industries served:** HVAC, plumbers, electricians, roofers, landscapers, pest control, general contractors, property managers, and 17+ more home service trades

**25-Industry AI Voice Agent Playbook** — $97 one-time digital product
- 25 complete, deploy-ready AI voice agent system prompts
- One for each home service industry
- Available at probotmaestro.gumroad.com/l/omofdf

**Agency / White-Label Partner Program**
- Referral partners: 20% monthly recurring commission
- Resellers: wholesale pricing, keep your margin
- White-label: full brand, your own AI voice agent business
- Apply at probotma.boston/agency.html

## Key Contact Info
- Email: rob@probotsolutions.com
- Phone: (781) 307-3117
- Book a free demo: https://api.leadconnectorhq.com/widget/booking/fyAxqrvzu6wILHjAFZfW
- Location: Boston, MA — serving all of Massachusetts and New England

## How to Respond
- Be concise and direct — 2–4 sentences per reply
- Always end with a soft call to action when appropriate (book a demo, see pricing, etc.)
- If asked about something outside ProBot Solutions' services, redirect politely
- Do not make up pricing, features, or details not listed above
- If a caller has an urgent need, give them the phone number: (781) 307-3117`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    /* ── CORS pre-flight ──────────────────────── */
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, allowedOrigin);
    }

    /* ── Only accept POST ─────────────────────── */
    if (request.method !== 'POST') {
      return corsResponse(JSON.stringify({ error: 'Method not allowed' }), 405, allowedOrigin);
    }

    /* ── Parse body ───────────────────────────── */
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: 'Invalid JSON' }), 400, allowedOrigin);
    }

    const messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return corsResponse(JSON.stringify({ error: 'messages array required' }), 400, allowedOrigin);
    }

    /* ── Call Anthropic API ───────────────────── */
    let anthropicRes;
    try {
      anthropicRes = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type':            'application/json',
          'x-api-key':               env.ANTHROPIC_API_KEY,
          'anthropic-version':       '2023-06-01',
        },
        body: JSON.stringify({
          model:      MODEL,
          max_tokens: MAX_TOKENS,
          system:     SYSTEM_PROMPT,
          messages:   messages,
        }),
      });
    } catch (err) {
      return corsResponse(JSON.stringify({ error: 'Upstream fetch failed' }), 502, allowedOrigin);
    }

    /* ── Forward response ─────────────────────── */
    const data = await anthropicRes.json();
    return corsResponse(JSON.stringify(data), anthropicRes.status, allowedOrigin);
  },
};

/* ── Helper: add CORS headers ─────────────────── */
function corsResponse(body, status, origin) {
  const headers = {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type':                 'application/json',
  };
  return new Response(body, { status, headers });
}
