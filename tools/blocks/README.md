# tools/blocks — one file per capability-page block

The capability page is assembled from blocks lifted out of four Webflow
templates. Each block lives in its own module here so blocks can be built
independently without two of them ever editing the same file.

A block module exports two things:

```js
/** How to cut the block out of its donor. Consumed by tools/capability-donors.mjs. */
export const donor = {
  id: 'cn-service',            // fragment file name: tools/fragments/<id>.html
  donor: 'cinery',             // key in tools/capability-donors.mjs DONORS
  scope: '.cn-service',        // root class every extracted rule is scoped under
  page: 'index.html',          // html file inside tools/templates/<donor>/
  start: '<section class="…',  // EXACT unique substring where the cut begins
  end: '…</section>',          // EXACT substring where the cut ends (included)
  wrap: ['outer', 'inner'],    // optional donor ancestors to put back, outermost first
  imageStems: { 'pexels-x': 'assets/stargo-editorial/os-cockpit.webp' },
  ground: '#000',              // optional: paint the scope root, when only the
                               // donor's <body> supplied the block's background
};

/**
 * Fill the donor markup with this site's words.
 * @param {string} frag  the extracted fragment, as written to tools/fragments/<id>.html
 * @param {object} ctx   { C, lang, t, escapeHtml, capTitle, art }
 * @returns {string} the block's html, WITHOUT the scope wrapper (added by the caller)
 */
export function render(frag, ctx) { … }
```

`ctx` carries:

| key | what it is |
| --- | --- |
| `C` | everything `tools/copy.mjs` exports |
| `lang` | `'zh'` or `'en'` |
| `t(v)` | resolves a `{zh,en}` pair, passes strings through |
| `escapeHtml(s)` | escape for text content |
| `capTitle(name, zhName)` | a capability's name, Chinese-first on the Chinese page |
| `art(name)` | `assets/stargo-editorial/<name>.webp` |

## Rules — read these before anything else

The owner's brief, verbatim: **"要求完美复刻移植，仅仅针对文字进行改动"** — a
perfect port of the template block, changing the words and nothing else. The
review document (F:/stargo 网站/.docx/word/media/imageN.png) shows exactly which
block each section is, with the template's own photographs in place.

- **The template's images stay, EXCEPT where the owner's own product imagery
  replaces them (owner instruction, 2026-09-18).** The original rule was: never
  substitute this site's artwork for the donor's photographs. The owner has now
  authorised replacing *brand, product and feature* pictures with the product
  screenshots supplied in the 2026-09-18 handoff (registered in
  `tools/imagegen/product-assets.json`, described and given their alt text in
  `tools/editorial-images.mjs`). Everything else about that rule is unchanged:
  keep `donor.mirror` at its default (`assets/<donor>`) so every CDN photo,
  poster, clip and icon still mirrors locally, keep real brand marks, functional
  icons, decorative textures and masks, and use `images`/`imageStems`/`cssImages`
  to *drop* something that cannot ship (map to `'none'`). A swap must keep the
  element, its classes, its interaction ids and the donor's geometry: only the
  file behind it changes, plus the minimum of `aspect-ratio` / `object-fit` /
  padding needed to show a 16:9 interface without cutting its navigation. Do not
  restore a template photograph over a placed product image in a later pass.
- **The template's type, sizes, colours and layout stay.** Do not add CSS that
  changes a font-size, a width, a colour or a layout the donor set. If our words
  do not fit a slot, change the words — use the shorter form (a capability's
  Chinese name, a shorter label from copy.mjs) — or report it in `copyDropped`.
  `tools/blocks/<id>.css` exists only for what an extraction cannot carry: a
  colour or typeface the donor kept on `body`, a rule written against a Webflow
  node id. Nothing else.
- **One language per page.** The Chinese page shows Chinese only, the English
  page English only ("不是所有的观众都能看得懂英文"). `capTitle(lang)` already
  does this; never print the English product name on the Chinese page.

- **Change words, never structure.** Replace text between existing tags. Do not
  add, remove or reorder elements, and never strip a `data-w-id`, an inline
  `style`, or a class — those are what the transplanted interactions bind to.
- **Repeat by cloning a unit.** To show N rows where the donor ships M, slice one
  unit out of `frag` and repeat it. Keep each clone's `data-w-id`: the donor's
  hover interactions address their targets with `useEventTarget: CHILDREN`, so
  clones sharing an id still animate independently.
- **Fail loudly.** If an expected anchor is missing from `frag`, throw. A silent
  no-op replace ships donor lorem ipsum to production.
- **Every capability name is resolved against `C.CAPABILITY_GROUPS`**, so the
  narrative cannot drift from the catalogue.

## Try one

```
node tools/try-block.mjs cn-service
```

Extracts the block, prints what came out, writes the fragment to
`tools/fragments/`, and renders it in both languages.

## A block's own CSS

A block may put hand-written rules in `tools/blocks/<id>.css`. They are appended
to its donor's stylesheet after the extracted rules, so they win at equal
specificity, and they live with the block — two blocks are never edited in the
same file.

Use it for what an extraction cannot know:

- rules the donor kept on `body` (its typeface, its text colour) — those never
  travel with a cut section;
- rules Webflow wrote against a generated node id (`#w-node-…`), which is not a
  class and so is not extracted;
- type drawn for one English word that now has to hold a capability's full name.

Scope every rule under the block's own root class, exactly as the extractor
does. Do not put block rules in `css/stargo-fusion.css`.
