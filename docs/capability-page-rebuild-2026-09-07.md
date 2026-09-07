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
