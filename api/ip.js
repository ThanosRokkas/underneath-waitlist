/* The buyer's public address, which the browser cannot see about itself.
 *
 * Meta matches a server reported conversion to a person using whatever
 * identifiers ride along with it, and the address plus the user agent are the
 * pair that carries the most weight after the click id. RevenueCat's servers
 * are the ones that call our webhook, so by the time the sale is reported the
 * buyer's address is long gone. It has to be collected here, while they are
 * still the one making the request.
 *
 * Same origin on purpose. A third party lookup is the first thing an ad
 * blocker drops, which would cost us the identifier on exactly the privacy
 * minded visitors who already deny us the cookie.
 */
export default function handler(req, res) {
  // Vercel puts the real client first and its own hops after it.
  const forwarded = req.headers['x-forwarded-for'];
  const ip = (forwarded ? String(forwarded).split(',')[0] : req.headers['x-real-ip'] || '').trim();

  // Per visitor, so a cache between us and them must never answer for someone else.
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ip: ip || null });
}
