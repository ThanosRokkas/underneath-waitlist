// Launch-day broadcast: email everyone on the waitlist that Underneath is
// live, then stamp notified_at so nobody is emailed twice. Idempotent — safe
// to re-run; it only picks up rows where notified_at is null.
//
// Reads all secrets from the environment. Nothing is committed:
//   SUPABASE_URL              https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY service-role key (waitlist is service-role only)
//   RESEND_API_KEY            same key the app uses
//   RESEND_FROM               e.g. "Underneath <hello@mail.tryunderneath.com>"
//   APP_URL                   default store link put in the email
//   APP_URL_IOS               App Store link (falls back to APP_URL)
//   APP_URL_ANDROID           Google Play link (falls back to APP_URL)
//   DRY_RUN                   set to "1" to preview without sending
//   ONLY_EMAIL                send to just this one address (live test before the real run)
//
// Run:  node broadcast.mjs
// Preview only:  DRY_RUN=1 node broadcast.mjs
// Live test to one inbox:  ONLY_EMAIL=you@example.com node broadcast.mjs
//
// The email itself lives in email.mjs so it can be previewed and edited without
// touching any of the sending logic here.

import { SUBJECT, renderHtml, renderText } from "./email.mjs";

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY,
  RESEND_FROM,
  APP_URL = "https://tryunderneath.com",
  APP_URL_IOS,
  APP_URL_ANDROID,
  DRY_RUN,
  ONLY_EMAIL,
} = process.env;

// Per-platform store links; fall back to the generic APP_URL when unset.
const IOS_URL = APP_URL_IOS || APP_URL;
const ANDROID_URL = APP_URL_ANDROID || APP_URL;

for (const [k, v] of Object.entries({
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY,
  RESEND_FROM,
})) {
  if (!v) {
    console.error(`Missing required env var: ${k}`);
    process.exit(1);
  }
}

const REST = `${SUPABASE_URL}/rest/v1/waitlist`;
const dbHeaders = {
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  "Content-Type": "application/json",
};

// Both parts are built per recipient so the primary button points at the store
// they actually said they were on when they signed up.
function emailFor(platform) {
  const args = { platform, iosUrl: IOS_URL, androidUrl: ANDROID_URL };
  return { html: renderHtml(args), text: renderText(args) };
}

async function fetchPending() {
  const url = `${REST}?notified_at=is.null&select=id,email,platform&order=created_at.asc`;
  const res = await fetch(url, { headers: dbHeaders });
  if (!res.ok) throw new Error(`fetch waitlist failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function sendEmail(to, platform) {
  const { html, text } = emailFor(platform);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to,
      subject: SUBJECT,
      html,
      text,
      // Gmail and Outlook surface a native unsubscribe control when this is
      // present, which keeps complaints from turning into spam reports.
      headers: {
        "List-Unsubscribe": "<mailto:tryunderneath@gmail.com?subject=Unsubscribe>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!res.ok) console.warn(`    resend ${res.status}: ${await res.text()}`);
  return res.ok;
}

async function markNotified(id) {
  const res = await fetch(`${REST}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...dbHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ notified_at: new Date().toISOString() }),
  });
  return res.ok;
}

async function main() {
  let pending = await fetchPending();
  console.log(`${pending.length} pending recipient(s).`);

  // A live test send. Restricted to one address so a mistake here costs one
  // email rather than the whole list, and notified_at is left alone so the
  // address still gets the real broadcast later.
  if (ONLY_EMAIL) {
    const target = ONLY_EMAIL.toLowerCase();
    const platform = pending.find((r) => r.email.toLowerCase() === target)?.platform ?? "ios";
    console.log(`ONLY_EMAIL set — sending one ${platform} email to ${ONLY_EMAIL}.`);
    console.log((await sendEmail(ONLY_EMAIL, platform)) ? "Sent." : "FAILED.");
    return;
  }

  if (DRY_RUN === "1") {
    for (const r of pending) console.log(`  would email: ${r.email}`);
    console.log("DRY_RUN=1 — nothing sent.");
    return;
  }

  let sent = 0;
  let failed = 0;
  for (const r of pending) {
    const ok = await sendEmail(r.email, r.platform);
    if (!ok) {
      failed++;
      console.warn(`  send FAILED: ${r.email} (left un-notified for retry)`);
      continue;
    }
    await markNotified(r.id);
    sent++;
    // Gentle pacing to stay under Resend's rate limit.
    await new Promise((res) => setTimeout(res, 120));
  }
  console.log(`Done. Sent ${sent}, failed ${failed}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
