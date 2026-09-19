/* Mid funnel checkpoints, reported to Meta from the server.
 *
 * The page reports PageView and then nothing until a sale, which meant 395
 * people arriving from an ad and none of them reaching the card looked
 * identical to 395 people leaving on the first screen. Two checkpoints in
 * between are the difference between a number and a diagnosis.
 *
 * Same origin on purpose, exactly like /api/ip. Reporting these through the
 * pixel would lose them for everyone running a blocker, and those are the
 * visitors we can otherwise say least about.
 *
 * The address and the user agent are read off the request rather than taken
 * from the body. The browser cannot see its own address, and a value the
 * client supplies is a value the client can invent.
 *
 * Needs META_PIXEL_ID and META_CAPI_TOKEN in the environment. Without them it
 * does nothing and says so once per cold start, because a funnel that stops
 * working is worse than a measurement that never started.
 */

import { createHash } from 'node:crypto';

const PIXEL_ID = process.env.META_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN || '';
const API_VERSION = 'v26.0';
const TIMEOUT_MS = 2500;

/* This endpoint is reachable by anyone, so the allowlist is what stops it
 * being a way to push arbitrary conversions into the pixel. Neither event
 * carries a value and neither is a purchase, so the most a spammer achieves
 * is noise in our own optimisation. Both are standard Meta events, which a
 * custom name is not: only standard ones can be optimised on and ranked in
 * Aggregated Event Measurement. */
const ALLOWED = new Set(['Lead', 'InitiateCheckout']);

/* fb.<subdomain index>.<ms>.<token>, the shape Meta issues and the shape
 * start.html writes by hand when the pixel has been stripped. Forwarding
 * anything else would only spend match quality on garbage. */
const FB_ID_RE = /^fb\.\d\.\d{10,16}\.[A-Za-z0-9_-]{1,255}$/;

function clientAddress(req) {
  // Vercel puts the real client first and its own hops after it.
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? String(forwarded).split(',')[0] : req.headers['x-real-ip'] || '';
  return ip.trim() || null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  /* 204 whatever happens below. The caller is a fire and forget fetch on a
   * page mid navigation, so there is no one to read an error, and a failure
   * here must never be visible to someone trying to subscribe. */
  try {
    await report(req);
  } catch (err) {
    console.warn('funnel checkpoint failed:', err instanceof Error ? err.message : err);
  }
  res.status(204).end();
}

async function report(req) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn('funnel checkpoint skipped: META_PIXEL_ID or META_CAPI_TOKEN not set');
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const event = typeof body.event === 'string' ? body.event : '';
  if (!ALLOWED.has(event)) return;

  const userData = {};
  if (typeof body.fbc === 'string' && FB_ID_RE.test(body.fbc)) userData.fbc = body.fbc;
  if (typeof body.fbp === 'string' && FB_ID_RE.test(body.fbp)) userData.fbp = body.fbp;

  // Meta only credits this pair when both halves are present, so one without
  // the other describes the visitor for no return.
  const ip = clientAddress(req);
  const ua = req.headers['user-agent'];
  if (ip && ua) {
    userData.client_ip_address = ip;
    userData.client_user_agent = String(ua);
  }

  // Meta rejects an event carrying no way to identify a person.
  if (Object.keys(userData).length === 0) return;

  /* Keyed on the device rather than the moment, so the same person reaching
   * the same checkpoint twice is counted once even if their browser forgot
   * it had been there. Hashed because it is ours and Meta has no use for the
   * raw value. */
  const eventId =
    typeof body.eventId === 'string' && body.eventId.length <= 200
      ? createHash('sha256').update(body.eventId).digest('hex')
      : `${event}_${Date.now()}`;

  const payload = {
    data: [
      {
        event_name: event,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: 'https://tryunderneath.com/start.html',
        user_data: userData,
      },
    ],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      },
    );
    if (!r.ok) {
      // The body carries Meta's reason, which is the only way to tell a bad
      // token from a malformed event.
      console.warn(`funnel checkpoint rejected ${event}: ${r.status} ${await r.text()}`);
      return;
    }
    // Names of the identifiers that rode along, never their values.
    console.log(`funnel checkpoint ${event} ids=${Object.keys(userData).join(',')}`);
  } finally {
    clearTimeout(timer);
  }
}
