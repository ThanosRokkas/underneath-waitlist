# Avantt

Avantt is the typeface this page is designed on. It is a commercial webfont
from Displaay Type Foundry and the files are not in this repo, because we do
not have the right to redistribute them in a public repository.

## What to buy

<https://displaay.net>, Avantt, **web licence**, sized to the site's monthly
pageviews. Two weights are enough:

| Weight | Used for |
| --- | --- |
| Medium (500) | every heading, every paragraph, every label, every button |
| Bold (700) | one thing only, the white button on the dark hero |

Do not buy the whole family. The design uses 500 everywhere and 700 once, and
a third weight will get reached for and break the page's texture.

## Where the files go

Download the `woff2` files from your Displaay account and drop them here,
renamed exactly:

```
assets/fonts/Avantt-Medium.woff2
assets/fonts/Avantt-Bold.woff2
```

Nothing else has to change. `index.html` already declares both `@font-face`
rules and preloads the Medium file. The moment the files exist the page picks
them up.

## What happens until then

The font stack is:

```css
--font-display: "Avantt", "Switzer", system-ui, sans-serif;
```

With no Avantt files present the `@font-face` rules fail silently and the page
renders in Switzer, which is served free from Fontshare and is the closest free
neo-grotesque to Avantt that exists. Measured against Avantt at 100px:

| | advance width | cap height | x-height / cap |
| --- | --- | --- | --- |
| Avantt | 1072 | 70.0 | 0.697 |
| Switzer | 1120 | 68.0 | 0.784 |
| Host Grotesk | 1137 | 70.0 | 0.709 |
| Cabinet Grotesk | 1096 | 67.0 | 0.722 |
| Geist | 1183 | 71.0 | 0.749 |

Switzer runs about 4% wide and its x-height reads taller, so body copy looks a
touch heavier than the reference. Every other free candidate was worse on
letterform: curved R legs, angled `e` terminals, or a geometric `a`. Switzer's
advance widths track Avantt closely enough that the layout does not reflow when
the real files arrive, which is the property that actually matters here.

## Do not

Point `@font-face` at Loop's Shopify CDN copy of `Avantt-medium.woff2`. It
works, and it is someone else's licence and someone else's bandwidth.
