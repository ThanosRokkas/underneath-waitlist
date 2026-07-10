// Launch-day broadcast: email everyone on the waitlist that Underneath is
// live, then stamp notified_at so nobody is emailed twice. Idempotent — safe
// to re-run; it only picks up rows where notified_at is null.
//
// Reads all secrets from the environment. Nothing is committed:
//   SUPABASE_URL              https://<ref>.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY service-role key (waitlist is service-role only)
//   RESEND_API_KEY            same key the app uses
//   RESEND_FROM               e.g. "Underneath <hello@mail.tryunderneath.com>"
//   APP_URL                   store / download link put in the email
//   DRY_RUN                   set to "1" to preview without sending
//
// Run:  node broadcast.mjs
// Preview only:  DRY_RUN=1 node broadcast.mjs

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  RESEND_API_KEY,
  RESEND_FROM,
  APP_URL = "https://tryunderneath.com",
  DRY_RUN,
} = process.env;

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

const subject = "Underneath is here";
function bodyText() {
  return [
    "Thanks for joining the Underneath waitlist.",
    "",
    "The app is live. Scan any food, see how processed it really is, and find cleaner swaps.",
    "",
    `Get it here: ${APP_URL}`,
    "",
    "Underneath",
  ].join("\n");
}

async function fetchPending() {
  const url = `${REST}?notified_at=is.null&select=id,email&order=created_at.asc`;
  const res = await fetch(url, { headers: dbHeaders });
  if (!res.ok) throw new Error(`fetch waitlist failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function sendEmail(to) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, text: bodyText() }),
  });
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
  const pending = await fetchPending();
  console.log(`${pending.length} pending recipient(s).`);
  if (DRY_RUN === "1") {
    for (const r of pending) console.log(`  would email: ${r.email}`);
    console.log("DRY_RUN=1 — nothing sent.");
    return;
  }

  let sent = 0;
  let failed = 0;
  for (const r of pending) {
    const ok = await sendEmail(r.email);
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
