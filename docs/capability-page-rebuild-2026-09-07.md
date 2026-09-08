# Capability page rebuild — 2026-09-07

The review asked for the whole capability page to be rebuilt out of four Webflow
templates the owner supplied (lumenis, qubix-studio, renok, cinery), one named
donor block per section, changing only the words and keeping every interaction.

## What each section is now

| Section | Donor | Block |
| --- | --- | --- |
| 页面开头 | renok | `rk-hero` — centred headline with an italic accent, paragraph, pill button |
| 一个外贸闭环 | qubix + renok | `qx-statement` (statement heading + right-set paragraph) over `rk-insight` (nine numbered rows) |
| 「找到买家」标题区 + 01 | cinery | `cn-service` — gradient split heading over the big-title service rows |
| 02 把对话变成理解 | qubix | `qx-news` — sticky image/text rows that card-stack on scroll |
| 03 报价 | renok | `rk-stats` — award line, heading, odometer counters |
| (视觉分隔) | renok | `rk-marquee` — scrolling oversized-word strip |
| 04 订单 | renok | `rk-portfolio` — staggered image/text cards over animated lines |
| 05 内容 | cinery | `cn-casestudy` — four-tile media grid with a hover logo lockup |
| (视觉分隔) | renok | `rk-marquee`, second wording |
| 06 AI 团队 | qubix | `qx-founder` — portrait grid |
| 四个基础板块 | qubix | `qx-cards` — four numbered cards on one scroll trigger |
| 完整目录 | cinery | the existing accordion, unchanged |

## How a block is built

Each block is one module in `tools/blocks/`, exporting how to cut it out of its
donor and how to fill it with this site's words. `tools/capability-donors.mjs`
runs the cuts; `tools/build-site.mjs` composes the page from the results.
`node tools/try-block.mjs <id>` builds one block on its own.

The cutting itself is `tools/donor-lib.mjs`, written after four donors had each
rediscovered the same traps one bespoke script at a time. It reproduces the
previous hand-written renok extraction byte for byte, and it carries:

- **Page-scoped interaction ids.** IX2 writes an event target as
  `<pageId>|<nodeId>` and the runtime returns `null` unless that page id equals
  the document's `data-wf-page`. A transplanted block therefore never animates,
  and the `opacity:0` the export ships becomes permanent. The scope is stripped.
- **Runtime preset names.** `slideInBottom`, `fadeIn` and friends name action
  lists the host page already defines; left alone the donor's motion is silently
  replaced by the host's. They are namespaced with everything else.
- **Bare-element typography.** Webflow puts much of a template's identity on
  `h1 { color: var(--white); font-size: 6.25rem }` with no class anywhere. A
  class-only filter drops all of it — this is what made renok's hero arrive in
  Mono's black 144px instead of renok's white 100px.
- **Runtime layout classes.** `w-layout-vflex` is `display:flex`, not
  decoration; skipping `w-` classes collapsed the hero's centred button row to
  the left edge.
- **Custom properties.** Donor rules resolve through the donor's `:root`;
  without it every colour computes to nothing and the block renders black on
  black.
- **The background parent.** Cutting just the `<section>` leaves behind the
  ancestor that supplies its ground. Blocks that need one declare `ground`.
- **Off-origin assets.** This site makes none, so every CDN reference must be
  mapped to local artwork or the extraction fails. `imageStems` maps a
  photograph and all five of its responsive variants at once.

## Repeating a donor row

Several sections need more rows than the donor draws — nine export stages on a
three-row list, six capabilities on a two-card grid. Rows are cloned with their
`data-w-id` intact, which works because the donors bind hover with
`useEventTarget: CHILDREN`: a row's hover only ever reaches that row's own
children, so clones sharing an id still animate independently. Verified on the
nine-stage list — all nine rest with their art hidden, and hovering one reveals
only that row's.

One caveat found while doing it: renok gives two of its three insight rows a
hover interaction and the third none, and that difference shows on a page of
nine (the row without one has its art sitting at full size over the number and
the description). Only rows carrying the whole interaction are used as
templates.

## Fixed along the way

- **The overlay menu's last five items never closed.** Mono's open interaction
  `a-190` names `.menu-item._01`, `._02`, `._03` and `._05` one at a time, and
  group 0 of that list is the *closed* state Webflow applies on load. Our nav
  carries ten items, so `._04` and everything from `._06` up sat at full opacity
  behind every page — invisible while every page was light, and plainly visible
  the moment this page opened on a black hero. Every uncovered item is now
  cloned from `._05` and the reveal delays dealt out evenly down the whole list.
  `chrome.mjs` was also numbering the tenth item `_010`.
- **The nav was drawn in the page's own black** against the new dark hero. The
  nav half of the dark-page treatment now stands on its own as
  `stargo-dark-nav`, because only the top of this page is dark and the nav
  scrolls away with it.

## Built in parallel, then checked adversarially

The nine remaining blocks were built by one agent each, and then a second agent
per block re-ran the checks and argued against the first one's report. That
second pass is what caught the defects worth catching:

- **The rail references were invented.** `rk-portfolio` printed `08 · 02` under
  "In the catalogue", where `02` was the card's position in the block, not the
  capability's position in the register — four of five rails pointed at a
  different capability than the card was about. The rail now carries only the
  group, which is the part that is true.
- **The counters had no unit.** `rk-stats` read "10 | Quote & Commercial" with
  nothing saying what was counted, next to an accordion that numbers the same
  group `07`. Now "07 报价与商务 · 项能力" / "capabilities in 07 Quote &
  Commercial".
- **Every fusion rule written against a block was inert.** `stargo-fusion.css`
  was attached immediately after Mono's stylesheet, so the donor sheets loaded
  *after* it and won at equal specificity. `chrome.mjs` now attaches it after
  the last stylesheet on the page. This is why the cinery titles stayed clipped
  after the clamp was written.
- **The page fetched from Webflow's CDN.** The renok hero's backdrop was a
  `background-image` in the donor's stylesheet; the extractor only policed the
  markup. It now polices CSS urls too, and a block must map or drop each one.

## Where a block's rules live

Nothing block-specific goes in `css/stargo-fusion.css`. A block's hand-written
rules live in `tools/blocks/<id>.css`, appended to its donor's sheet after the
extracted rules — so a block owns its markup, its copy-fill and its styles in
one place, and no two blocks are ever edited in the same file.

## Arriving on an anchor

Webflow ships scroll-animated elements at inline `opacity: 0`, and
`SCROLL_INTO_VIEW` only fires on the way in. The floating pill jumps to
`#story-1 … #story-4` and the hero button to `#atlas`, so a reader arriving by
any of those landed on text that had already been "passed" and would never
appear. `js/stargo-ix-arrival.js` reveals what is above the landing point after
the runtime has bound its events, and touches nothing below the fold — verified
that 31 elements are still correctly hidden on a plain load, and that every
entrance animation still plays when scrolled into.

## Verified

38 pages build; `verify-site` 0 problems, `verify-integrity` 40/40,
`verify-interactions` 16/16. The capability page at 390/768/1440/1920 in both
languages: no horizontal overflow, no console errors, no off-origin requests.
Hover checked on all four blocks that carry one — the stage art scales in and
out, the portfolio chip fades, the cinery row crossfades its background, and the
case tile slides its logo while the two arrows swap.

## Still open

- The three figures in `rk-stats` are counts computed from the register. Any
  other metric needs owner evidence before it goes on the page.
- Per-capability availability labels (Available / Pilot / Planned) still need
  owner evidence, as recorded in the live-audit close-out.
- The avatar set is 228×228 at source, so the workforce grid uses the site's
  full-size artwork instead; if portraits are wanted there, they need to be
  regenerated at about 1264px.

## 2026-09-08 — rebuilt again, against the review's own screenshots

The owner rejected the first port: "改的面目全非…要求完美复刻移植，仅仅针对文字进行
改动". Two things had gone wrong, and both were mine.

**The wrong blocks.** I had mapped sections to donor blocks from the review's
text; the review's *screenshots* (`.docx/word/media/image2…31.png`) name
different ones. Read against them, the page is now:

| Section | Screenshot | Block |
| --- | --- | --- |
| 页面开头 | image2 | renok hero **with its 3D product-card row** and silk backdrop |
| 一个外贸闭环 (title) | image4 | renok "Award winning /Studio" heading, chips and cursor |
| 一个外贸闭环 (intro) | image6 | qubix orbit hero: ring, orbiting photos, rolling stage tags |
| 九个阶段 | image7 | renok insight list, thumbnails visible as the donor shows them |
| 找到买家 + 01 | image9, 11 | cinery gradient heading + big-title rows, clapperboard photography |
| 02 | image13 | qubix Latest News, its wooden-balls and paper-box photos |
| 03 | image15 | renok Awards, its VR-visor photograph |
| 04 (+ break) | image17→18 | renok testimonials — one 300vh section whose growing circle *is* the break |
| 05 | image20 | cinery Quick Answers: gradient heading, accordion, portrait |
| break | image21 | cinery LET'S PRODUCE: gradient heading over fanned video cards |
| 06 | image23 | qubix Recent Projects grid |
| 四个基础板块 | image28 | qubix What We Do orb, extended from three nodes to four, click-to-expand |

**Substituted images.** The "no off-origin request" rule had led me to swap the
templates' photography for this site's artwork. The owner wants the templates'
own images. They are now **mirrored**: `tools/donor-lib.mjs` has a `mirror`
mode that rewrites every CDN reference (markup and CSS) to `assets/<donor>/…`,
`tools/mirror-donor-assets.mjs` fetches what is missing once, and the build
refuses to ship a reference to a file that is not on disk. 150 files, about
80 MB, most of it the cinery video cards (the largest single file is 5.7 MB,
under Cloudflare's 25 MiB limit). Runtime requests off-origin remain zero.

Typefaces went the same way: renok sets Inter Tight and Instrument Serif,
neither served here, so the headline fell to Arial and the italic accent to
oblique Arial. Both are now self-hosted under `assets/fonts/donor/`
(`css/donor-fonts.css`, OFL) and the notices page lists them.

**Language.** "中文界面就只有中文的解释" — the Chinese page now carries Chinese
only: `capTitle` no longer appends the English product name, and the nine
stage words have Chinese names (`HOME_LOOP_TABLE.stageNames`) wherever they are
the block's largest type. The hero's italic accent stays Latin by design (the
serif has no CJK glyphs).

**Method.** Thirteen agents built one block each against its screenshot, and
thirteen more verified them adversarially; the verifiers caught a renok
interaction (`growIn`) the extractor could not namespace, breakpoint `:root`
overrides it did not carry, and the duplicated break. Both extractor gaps are
fixed in `donor-lib.mjs`.

**Left as reported by the blocks.** The donor's slots hold fewer items than
some stories name: testimonials draws six cards for seven capabilities, the
project grid three, the award heading two chips. What did not fit was left out
rather than resized. On the English page cinery's one-word titles take a second
line for our multi-word product names, at the donor's size.

### Page weight

Mirroring the templates' own media made the capability page 43 MB on first
paint: cinery's break band is 27 `<video autoplay preload="metadata">` cards and
every one began downloading before a reader had scrolled anywhere near them.
The build now writes each `<source src>` as `<source data-src>` and
`js/stargo-video-defer.js` restores it a screen ahead of the band. Nothing else
changes — same elements, classes, interaction ids and autoplay — and the band is
the template's band once you reach it. First paint is 9.7 MB, and a full
scroll through the whole page 20 MB, against 43 MB before. 140 of the page's
148 images were already `loading="lazy"` from the Webflow exports; the eight
eager ones are the hero cards above the fold.

### The donors' own typefaces

A comparison pass against the live donor pages found cinery's blocks set in
Arial: the template names `"Overused Grotesk", Arial, sans-serif` and nothing on
this site served the first entry, so every cinery title drew about 15% wider
than the template's — which is why they would not fit their column and had been
scaled down. Webflow serves a template's fonts from the same CDN as its
photography, so `tools/donor-lib.mjs` now carries each donor's `@font-face`
rules and mirrors their sources alongside the images (13 files, 1.7 MB:
Overused Grotesk 300–900 and InterDisplay 400–700).

Measured after: the same string in the same face is 773px on our page and 773px
on the donor's. Three of the four Chinese rows now render at the template's full
112px where all four had been halved; only 进口商补货雷达, which needs about
888px against a 768px column, is still set two-line at half size, and the four
English product names likewise — `Account Research`, the shortest, still needs
about 1160px at the donor's size. Those are the words being longer than the
template's one-word titles, not the design being changed.

### Colours that resolved to the wrong value

cinery's service rows are grey at rest and turn white on hover. On our page they
were white at rest, so the hover did nothing visible. The interaction data was
the donor's, unchanged, and its flag correct — but a Webflow colour step names a
global swatch (`--neutral-color--primary-neutral`) *and* carries the rgb that
swatch resolved to. The name is looked up in the payload's `site` table, which
on this page is the host template's; a donor's swatch id is not in it, the
lookup fails, and the step lands on the wrong colour.

`tools/donor-lib.mjs` now drops `globalSwatchId` from any step that also carries
literal `rValue/gValue/bValue`, leaving the donor's own resolved values — which
are what the swatch meant. Measured after: rest 128,128,128 → hover 250,250,250
→ back to 128,128,128, on both the kicker and the description, exactly as the
donor. This applies to every donor block, not just this one.
