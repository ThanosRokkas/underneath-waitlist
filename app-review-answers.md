# App Review Answers — Underneath (web2app model)

Answers to Apple App Review's subscription questions (Guideline 3.1.1 / 3.1.3(b) Multiplatform Services). Model: subscriptions are sold only on the website (tryunderneath.com); the iOS app sells nothing and unlocks via account sign-in.

---

**1. Who are the users that will use the paid subscriptions in the app?**

General consumers who use Underneath to scan food products and understand ingredient quality. Users create an Underneath account and subscribe to our premium tier, "Underneath Plus," on our website. Those same users then sign in to the iOS app with their existing account, and their subscription unlocks the app's premium features.

**2. Where can users purchase the subscriptions that can be accessed in the app?**

Exclusively outside the app, on our website, tryunderneath.com, where users complete sign-up and subscribe to Underneath Plus (weekly or annual plan). The iOS app does not sell subscriptions and does not contain any links, buttons, external purchase mechanisms, or calls to action directing users to the website or any other purchase method. Users simply sign in with the account they already created, consistent with Guideline 3.1.3(b) (Multiplatform Services).

**3. What specific types of previously purchased subscriptions can a user access in the app?**

Only our own first-party subscription, "Underneath Plus," an auto-renewing subscription available as a weekly or an annual plan, purchased previously on our website. There is no third-party content, no other subscription tiers, and no consumable purchases.

**4. What paid content, subscriptions, or features are unlocked within the app that do not use In-App Purchase?**

Underneath Plus unlocks the app's premium features (unlimited product scanning, full score breakdowns, and personalized recommendations) for users who already subscribed on our website. This is the app's only unlock mechanism: access is granted solely by signing in to an existing account. Nothing can be purchased within the app itself, and the app never advertises, links to, or instructs users about external purchasing options.

---

## Consistency checks before resubmitting

1. **The binary must match these answers.** If the submitted build still contains the RevenueCat IAP paywall (iOS products `underneath_annual` / `underneath_weekly`), Apple will see a purchase flow and the answers will look false. Either remove/hide the paywall for iOS in this build, or keep IAP and use the multiplatform + IAP answers instead. The build and the answers must agree.
2. **Zero mentions of the website as a place to buy** anywhere in the app: paywall screens, onboarding, settings, empty states, error messages. Any "subscribe at tryunderneath.com" style copy is an instant 3.1.1 rejection.
3. In App Review notes, provide the reviewer account with an already-active subscription so they can see the sign-in unlock working: `playreview@underneath.app` / `PlayReview2026x`, 6-digit code `424242`.
