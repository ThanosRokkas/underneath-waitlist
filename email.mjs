// The launch email, kept apart from broadcast.mjs so it can be previewed and
// iterated on without touching the sending logic.
//
// Written to the rules email clients impose rather than the ones browsers do:
// tables instead of flexbox, every style inline because <style> blocks are
// stripped in places, a system font stack because webfonts do not load, and a
// table-wrapped button because Outlook ignores padding on an <a>.
//
// Most of all: images are blocked by default in a lot of inboxes, so the
// headline and the download button are live text. With every image suppressed
// the email still says what it is and still has something to press.

const CREAM = "#faf5ec";
const INK = "#211d17";
const MUTED = "#6f675a";
const ORANGE = "#f58a3c";
const LINE = "#e9e0d0";

const SITE = "https://tryunderneath.com";
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const SUBJECT = "Underneath is out";

// Shown next to the subject in the inbox list, before anything is opened.
const PREHEADER =
  "Scan any barcode and see how processed your food really is.";

const STORES = {
  ios: { label: "Download on the App Store", other: "Google Play", otherKey: "android" },
  android: { label: "Get it on Google Play", other: "the App Store", otherKey: "ios" },
};

function button(href, label) {
  return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td align="center" bgcolor="${ORANGE}" style="border-radius:12px;">
            <a href="${href}" style="display:inline-block;padding:16px 32px;font-family:${FONT};font-size:17px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:12px;">${label}</a>
          </td>
        </tr>
      </table>`;
}

function point(title, copy) {
  return `
            <tr>
              <td style="padding:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.55;color:${MUTED};">
                <span style="color:${INK};font-weight:600;">${title}</span> ${copy}
              </td>
            </tr>`;
}

// `platform` is "ios" or "android"; anything else falls back to iOS wording,
// which matches how the sender resolves the link.
export function renderHtml({ platform, iosUrl, androidUrl }) {
  const key = platform === "android" ? "android" : "ios";
  const store = STORES[key];
  const primary = key === "android" ? androidUrl : iosUrl;
  const secondary = key === "android" ? iosUrl : androidUrl;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${SUBJECT}</title>
</head>
<body style="margin:0;padding:0;background-color:${CREAM};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${PREHEADER}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CREAM};">
    <tr>
      <td align="center" style="padding:32px 16px 40px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

          <!-- Wordmark -->
          <tr>
            <td align="center" style="padding:0 0 28px;">
              <img src="${SITE}/icon.png" width="52" height="52" alt="" style="display:block;border:0;border-radius:13px;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid ${LINE};border-radius:18px;padding:40px 32px;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-family:${FONT};font-size:32px;line-height:1.2;font-weight:700;color:${INK};letter-spacing:-0.5px;padding:0 0 16px;">
                    It's out
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${FONT};font-size:16px;line-height:1.6;color:${MUTED};padding:0 0 28px;">
                    You joined the waitlist back when there was nothing to download yet. Thank you for waiting. Underneath is live now.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:0 0 14px;">${button(primary, store.label)}</td>
                </tr>
                <tr>
                  <td align="center" style="font-family:${FONT};font-size:14px;line-height:1.5;color:${MUTED};padding:0 0 32px;">
                    Also on <a href="${secondary}" style="color:${MUTED};">${store.other}</a>
                  </td>
                </tr>

                <!-- Screenshot. Cropped to the score itself: the whole screen at
                     this width is mostly unreadable nutrition rows, and it pushed
                     everything below it off the first screen. -->
                <tr>
                  <td align="center" style="padding:0 0 8px;">
                    <img src="${SITE}/assets/email-score.png" width="240" alt="Underneath scoring a biscuit 19 out of 100" style="display:block;border:0;width:240px;max-width:100%;height:auto;" />
                  </td>
                </tr>

                <!-- What it does -->
                <tr>
                  <td style="border-top:1px solid ${LINE};padding:26px 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${point("Scan any barcode", "and the whole ingredient list comes back in seconds.")}
                      ${point("Get one honest score", "from 0 to 100, weighted by how processed a food is rather than by what the front of the pack claims.")}
                      ${point("Find a cleaner swap", "in the same aisle, ranked by the same score.")}
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 16px 0;font-family:${FONT};font-size:12px;line-height:1.7;color:${MUTED};">
              You are getting this because you joined the Underneath waitlist at
              <a href="${SITE}" style="color:${MUTED};">tryunderneath.com</a>.
              This is a one time launch email, not a newsletter.
              <br /><br />
              Underneath Ltd, company 17312263, registered in England and Wales.<br />
              128 City Road, London, EC1V 2NX, United Kingdom.<br />
              <a href="mailto:tryunderneath@gmail.com?subject=Unsubscribe" style="color:${MUTED};">Unsubscribe</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// The plain text part. Not a fallback nobody reads: some clients prefer it, and
// a missing text part on its own hurts deliverability.
export function renderText({ platform, iosUrl, androidUrl }) {
  const key = platform === "android" ? "android" : "ios";
  const primary = key === "android" ? androidUrl : iosUrl;
  const secondary = key === "android" ? iosUrl : androidUrl;
  const otherName = key === "android" ? "the App Store" : "Google Play";

  return [
    "It's out.",
    "",
    "You joined the waitlist back when there was nothing to download yet.",
    "Thank you for waiting. Underneath is live now.",
    "",
    `Get it: ${primary}`,
    `Also on ${otherName}: ${secondary}`,
    "",
    "Scan any barcode and the whole ingredient list comes back in seconds.",
    "Get one honest score from 0 to 100, weighted by how processed a food is",
    "rather than by what the front of the pack claims.",
    "Find a cleaner swap in the same aisle, ranked by the same score.",
    "",
    "You are getting this because you joined the Underneath waitlist at",
    "tryunderneath.com. This is a one time launch email, not a newsletter.",
    "",
    "Underneath Ltd, company 17312263, registered in England and Wales.",
    "128 City Road, London, EC1V 2NX, United Kingdom.",
    "Unsubscribe: tryunderneath@gmail.com",
  ].join("\n");
}
