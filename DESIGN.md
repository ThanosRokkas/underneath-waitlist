# Underneath, design rules

The grammar is cloned from a reference landing page and measured off it with
code, not eyeballed: every number below came out of `getComputedStyle` or a
canvas metric, not a guess. What stays Underneath is the words, the app
screenshots and the verdict colours. Everything else, the face, the scale, the
weights, the tracking, the palette, the radii, the section order, is theirs.
Thirteen rules, and the site is the proof.

### 1. One face, and almost one weight

Avantt, at 500, for every heading, every paragraph, every label and every
button. The reference sets 190 text elements and 189 of them are 500. There is
exactly one exception here too, and it is the first line of the `h1`: the name
is stated at 700 and the claim answers it at 500, so the eye reads a label and
then a sentence instead of one long shout. Nothing else on the page is bold,
including every button. That restraint is the whole personality of the type:
there is no bold to reach for, so emphasis has to come from size and ink
instead. Do not add a third weight, and do not spend the second one twice.

Avantt is licensed and its files are not in this repo. See
`assets/fonts/README.md`. Until they are dropped in, the stack falls through to
Switzer, which tracks Avantt's advance widths within about 4% so the layout
does not move when the real files arrive.

### 2. Tracking is negative, everywhere

`-0.03em` on display sizes, `-0.02em` on body. Nothing on this page is tracked
out and nothing is uppercase. Both are label conventions the reference does not
use once, and both were in an earlier draft of this page. If a label needs to
recede, it recedes by going dim, not by spacing out.

### 3. One ground, and it is white

`#FFFFFF` runs unbroken from the header to the last pixel. No section colours
the viewport edge. When a section needs to separate itself it becomes a card on
the ground, never by repainting the ground.

### 4. A section is an inset card

Every band is a gutter and a bottom margin. The surface belongs to the wrap
inside it, at `16px` radius, filled `#FBF9F8`, with a white channel showing
between one section and the next. The channel is the divider. There are no
rules, no hairlines and no full-bleed bands.

### 5. Dark is spent twice

`#252427` appears on the pull quote and on the footer, and nowhere else. Ink
flips only on those two surfaces, via `--ink`, `--ink-soft`, `--ink-dim`,
`--card`, `--hair` and `--rule`. Nothing is hard-coded to white. A third dark
section would spend the quote's weight.

The hero used to be the first of the two and is not any more. It sits on the
white ground with no card behind it, because two tilted handsets and an arrow
that curves between them need room to break their own bounding box, and a
surface would fence them in.

### 6. There is no accent colour

The palette is white, two greys, and near-black. Colour appears in exactly one
role: a verdict being reported. `--sp-good`, `--sp-caution` and `--sp-poor`
come from the app and are used as fills behind white ink, never as ink, because
as text none of them clear contrast. If something on this page is coloured, it
is a score.

### 7. Shape separates a label from a button

A label is a hairline tag: transparent, `1px #E5E3DE`, `4px` radius, 14/500 in
`#4F4F51`. A button is a solid capsule in near-black. They share no property,
which is why a label is never mistaken for something you press. That `4px`
corner is deliberate and it is measured, not invented: it is the only shape on
the page that is neither a card nor a pill.

Navigation is neither. Footer links are plain text that goes from dim to white
on hover, with no fill and no radius, exactly as the reference sets them. Six
links in capsules would have read as six calls to action.

Four radii, and there are no others: card `16px`, thumbnail `12px` because it
nests inside a card, tag `4px`, capsule `9999px`.

### 8. Nothing casts a shadow except a handset

The only `drop-shadow` in the stylesheet belongs to an app screenshot, because a
phone is a physical object and everything else is ink on paper. No card
shadows, no button shadows, no hover lifts. And a screenshot never ends on a
hard horizontal line: every one either overruns the floor of its container and
gets clipped by the radius, or fades out under a mask. A straight cut across a
phone is the tell of a pasted image.

### 9. The capability run is one shape repeated

Five cards, one surface, identical in every respect except the content and
which side the handset sits on. On desktop they are locked to the same 396px,
and each one closes with the same pill saying the same words. The page teaches
the shape once and then repeats it without variation, which is why the run
scans in seconds. Do not add a sixth card that is taller, and do not drop the
CTA from one.

### 10. Proof is shown at the reference's cadence, with our own evidence

The reference proves itself three times: a review row early, a repeated quote
after the capability run, and a band that is nothing but a button before the
footer. The site keeps all three shapes. Since the split they no longer sit on
one scroll: the review row and the quote are on the home page, and the closing
button strip is the last band on each of the two inner pages, so whichever page
someone lands on ends the same way.

What fills them is ours. The review row is `.rev`, and it is the reference's
card measurement exactly, a visual block first, then a headline, then a short
body, then a tag pinned to the foot with `margin-top: auto` so three cards of
unequal copy still line their tags up. The visual block is a score fill, not a
customer photo, because there are two App Store reviews and no product
photography, and a row of three faces would have to be invented. The score is
white ink on the verdict colour, the same rule the swap cards follow, so the
verdict colour is still never set as text anywhere on the page.

The pull quote carries the one real five-star review, once, at display size.
When there are enough genuine reviews to fill three cards it becomes a second
`.revs` row and this rule gets rewritten. Until then, one review is stated as
one review.

The closing strip is a single button. No heading, no body, no card. It is the
last thing before the footer and it repeats the same call to action the header
opened with. On an inner page it points back at `/#download` rather than at an
anchor on its own page, because the store buttons live on the home page.

### 11. The footer opens with the field and closes with the law

Reference order, top to bottom: newsletter headline beside a single email field
with a circular arrow button, a hairline, four link columns, then the brand and
the legal block. The circular button is the only round button on the page, and
it is round because it holds a glyph instead of a word.

The dark surface redefines `--hair` alongside the rest of its ink. It is easy to
miss, because `--ink`, `--ink-soft`, `--ink-dim` and `--rule` are all flipped in
that block and `--hair` is not obviously among them. Left alone it stays the
light value and the divider disappears.

The field is real. It posts to the same public waitlist endpoint the site has
always owned, sending the platform the user agent already told us so the
follow-up mail knows which store to link. The endpoint treats a repeat address
as success, so a double submit is harmless. A decorative field would be worse
than no field.

### 12. The hero says it, then shows it working

Copy left, product right. The left column runs proof pill, two-weight headline,
one sentence, two store pills, one line of fine print, in that order and no
other. The right column is the whole product in one glance: the scan, an arrow,
the verdict. Two handsets tilted four degrees in opposite directions so the
input leans back and the output leans forward, which makes the pair read as a
sequence rather than a set.

The two columns do not share a floor. The copy keeps the band's bottom padding
and the handsets do not: `.hero > .wrap` sets `padding-bottom: 0`, the grid
aligns to `end`, and the copy carries its own `padding-bottom` back, but only in
the side-by-side layout. So the phones run the full height of the section and
stand on it. Centred with air underneath, which is where this started, they read
as floating in the middle of a band rather than as the thing the band is about.

The arrow holds its own slot in the flex row rather than floating over the pair.
An absolutely positioned arrow lands on a handset the moment the column changes
width, and it did.

The headline is smaller than a section heading, not larger. It has two weights
and a photograph beside it, and at display size it wrapped to five lines and
drowned both. The measure is `15ch` and it enforces three lines, which is why
there is no `<br>` in it.

The two floating labels are labels, not data. The numbers on those screens are
already on those screens, and repeating them in a chip would be decoration
wearing a fact's clothes. They appear only from `1200px`. `1024px` is where the
copy moves out of the way and leaves an outer edge to hang one off, and that is
where they used to appear, but it is not the same question as whether the label
fits once it is hanging there: measured, the right-hand label crosses the gutter
at 1024 and only clears it at 1200. Below that they are dropped rather than
clipped, which is the rule, and the earlier threshold was breaking it quietly
because `body` carries `overflow-x: hidden` and swallowed the evidence.

The proof pill carries the real App Store rating, weighted by rating count
across every storefront the app is live in. It does not carry the count. The
rating is genuinely good and the count is genuinely small, and printing both
makes the sentence argue with itself. State the number that is strong, omit the
one that is not, invent neither. When the count is worth stating, add it back.

The reference for this hero has three customer faces in its pill. We do not have
photographs of our users, so there are no faces. Inventing three would be the
one dishonest pixel on the page.

### 13. Three pages, and the home page is only the claim

`index.html` is the hero, the numbers, the one real review, two doors and the
download. `product.html` is what the app is: what changed about the food, the
three steps at the shelf, the five screens, where it earns its keep.
`proof.html` is why to believe it: how the number is built, three real products
scored, the same shelf told two ways, the questions worth asking, and who is
behind it. The home page was a single scroll of all of it and read as an
argument that would not stop.

Navigation keeps all four destinations it has always had, `How it works`, `The
score`, `Screens` and `FAQ`. Only the targets moved: each one now leaves the
page instead of scrolling it. Collapsing the nav to two links alongside the
split was one change too many, because it removed something the user never
asked to lose in order to solve a problem they had not raised. The doors band
restates the two pages in full sentences, because a nav link is a word and a
card is a promise, and someone scrolling has not read the nav.

Links are written relative and with the extension, `product.html#how`, not
`/product#how`. The pretty paths only exist because `vercel.json` rewrites
them, so a root-absolute href is broken everywhere except production: on
`file://`, on any plain static server, and in every preview. The rewrites stay,
so a `/product` link someone has already shared still resolves, but nothing in
the site depends on them. Any genuinely new clean path still needs its own
hand-written entry, because this project has no automatic clean URLs and a
missing rewrite is a 404 that only production will show you.

The stylesheet and the script are extracted to `styles.css` and `site.js` and
shared verbatim, so there is one place to change a rule and no page can drift.
The header, the footer and the dock are identical markup on all three.

The dock is the one piece of behaviour that had to change. It hides itself while
real store buttons are on screen, and an inner page has none, so it now checks
for their absence and simply stays.

---

**Headings are centred.** Section heads sit centred with the body capped at
46ch under them. The two split sections and the FAQ are the exceptions, because
a heading beside its own content has a left edge to hold.

**Motion is a reveal, and it is optional.** The only animation is a short
fade-and-rise as a section enters the viewport, driven by IntersectionObserver.
It is wrapped in `@media (prefers-reduced-motion: no-preference)` and the page
renders complete with JavaScript disabled. No parallax, no scroll-jacking, no
library.

**Stack.** Three static pages sharing one `styles.css` and one `site.js`. No
build step, no framework, no dependencies. App shots are WebP. Deployed to
Vercel from `main`.

**Testing.** Three pages at 375, 768 and 1440, nine renders. Every change is
verified by screenshotting each band at all three widths and auditing for
horizontal overflow, text escaping its container, unresolved `.rise` sections,
and tap targets under 40px. Run the harness against a local server, not the
file:// URL, or the fonts do not load, and hit `.html` paths because the plain
server does not honour the Vercel rewrites.
