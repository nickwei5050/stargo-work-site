/**
 * Reserved visual slots for the STARGO WORK marketing site (stargo.pages.dev).
 *
 * This is the list to edit when a hero film, a module card, a product
 * screenshot, or the share cover is replaced. The human-readable map is
 * assets/replaceables/README.md.
 *
 * Two kinds of path:
 *   - A token `assets/stargo/<id>.<ext>` is what the generator writes.
 *     tools/editorial-images.mjs rewrites that prefix to
 *     `assets/stargo-editorial/` before the page is saved. The file on disk
 *     is the editorial path. Do not write the editorial path into a token
 *     slot: the rewrite would run twice.
 *   - A product path (`assets/stargo-product/…`) or the hero film
 *     (`assets/stargo-motion/…`) is written as the final URL. Overwrite that
 *     file, including its width variants, and leave the name alone: every
 *     page loads it as `…?v=<content hash>` (tools/asset-version.mjs, Z18),
 *     so the new bytes are a new URL and the year-long immutable cache cannot
 *     keep the old picture. For anything that must disappear from browsers
 *     that already hold it (a screenshot blurred for privacy), prefer a new
 *     file name as well, so the old URL no longer exists on the site.
 *   - An owner photograph (`assets/stargo-photo/<id>-<width>.webp`, registered
 *     in tools/imagegen/photo-assets.json; AI-generated, captioned as such by
 *     tools/editorial-images.mjs) is written as the final URL too, but never
 *     overwritten: /assets is cached immutable for a year, so a new picture
 *     gets a new id and tools/imagegen/prepare-photos.mjs writes it (it
 *     refuses to replace a file with different bytes).
 *
 * The share card (OG) is the owner's photograph O01 since 2026-10-21, a
 * 1200×630 JPEG written by tools/imagegen/prepare-share-card.mjs. Like every
 * owner photograph it is never overwritten: a new card gets a new name here.
 *
 * Nothing here is new artwork. Every id is a file that already ships.
 */

/** Generator token. Rewritten to assets/stargo-editorial/ at page-write time. */
export const editorialToken = (id, ext = 'webp') => `assets/stargo/${id}.${ext}`;
/** File on disk, and the URL after the editorial rewrite. */
export const editorialFile = (id, ext = 'webp') => `assets/stargo-editorial/${id}.${ext}`;
/** Owner product screenshot. Written as this path; width variants sit beside it. */
export const productFile = (id) => `assets/stargo-product/${id}.webp`;
/** Owner photograph: its widest file. The narrower ones carry their own width in the name. */
export const photoFile = (id, width = 2048) => `assets/stargo-photo/${id}-${width}.webp`;

/**
 * Share cover: og:image and twitter:image of every page that has no picture of
 * its own (an article shares its own cover, tools/chrome.mjs). chrome.mjs
 * writes `token`; pages publish `file`. Since 2026-10-21 it is the owner's
 * photograph O01 (site-images/batch-8, a container ship at blue hour), cut to
 * 1200×630 and written as a JPEG, because link previews do not all read WebP.
 * It replaced the generated og-cover.png (editorialFile('og-cover', 'png')),
 * which stays on disk. `id` keys its alt text in tools/editorial-images.mjs.
 */
export const OG = {
  id: 'o01-share-cover',
  token: 'assets/stargo-photo/o01-share-cover-1200x630.jpg',
  file: 'assets/stargo-photo/o01-share-cover-1200x630.jpg',
  width: 1200,
  height: 630,
};

/**
 * Homepage sticky video grid (the Fearless Vision centre film plus the
 * stills around it, under 「同一个工作空间，连接日常经营。」). `theatre[centreIndex]`
 * is replaced by `film` / `poster` and is not shown as a still. The opening
 * overlay (tools/blocks/og-intro.mjs) has no image file.
 *
 * Since 2026-10-21 the six stills are the owner's photographs
 * (site-images/batch-3, W01–W06): trade office, workshop, warehouse, QC
 * room, owner's office, showroom. They replaced the os-* stills here only; the
 * os-* files keep their other places (hero mosaic, photo strips, dashboard and
 * slide images, other pages).
 *
 * Since 2026-10-23 (owner: 能用代码的图片都改成代码) the six cells around the
 * film are code-drawn windows of the STARGO WORK desktop instead of those
 * photographs: `code[i]` names the motion scene that takes cell i
 * (js/stargo-motion-desk.js, placed by tools/code-art-theatre.mjs). They tell
 * one demo deal clockwise from the top left: Growth OS, Sales Desk, 报价审批,
 * ERP, AI 创作, 经营驾驶舱. `theatre` keeps the photographs for the record;
 * none of W01, W03–W06 is drawn on the site any more (W02 still is, in the
 * capability ring). `poster` is the film's own first frame since the same day.
 */
export const HERO = {
  film: 'assets/stargo-motion/orbit.mp4',
  poster: 'assets/stargo-motion/orbit-poster.webp',
  centreIndex: 3,
  code: ['desk-sales', 'desk-growth', 'desk-cockpit', null, 'desk-quote', 'desk-erp', 'desk-creative'],
  theatre: [
    photoFile('w01-trade-office'),
    photoFile('w02-workshop'),
    photoFile('w03-warehouse'),
    editorialToken('os-desktop'),
    photoFile('w04-qc-lab'),
    photoFile('w05-owner-office'),
    photoFile('w06-showroom'),
  ],
};

/**
 * The side menu's 预约企业演示 contact card, on every page that has the menu
 * (tools/chrome.mjs): a still photograph where the magical-orb clip played
 * (G02, 2026-10-21). The orb clip stays everywhere else it is drawn — the
 * navbar logo and the pricing cards.
 */
export const MENU_CARD = photoFile('g02-menu-harbour-night', 768);

/**
 * Capability page, 「每项 工作」 ring (tools/blocks/cn-produce.mjs): cards that
 * show a still photograph instead of their clip, by the clip's video id.
 * W02 (2026-10-21) takes the outer ring's video-15 card and the inner ring's
 * card that repeats video-11.
 *
 * Since the owner's batches 1, 2 and 6 (2026-10-21) every card is a still.
 * The outer ring's thirteen clips take H01-H10, P03, C08 and W02 in DOM order;
 * the inner ring repeats the outer ring's clips, so each of its cards takes the
 * still of the clip it repeats (video-10 twice: H09 both times), except the
 * second repeat of video-11, which takes C08 instead of a second P03 so every
 * still is in the inner ring too. The ids are the manifests' own.
 *
 * Since 2026-10-24 (lane "vignettes") every card draws the code vignette of
 * the photograph named here instead (tools/code-art-vignettes.mjs, placed by
 * its page pass after tools/blocks/cn-produce.mjs has written the stills), so
 * none of these files is fetched by the page; the map stays the record.
 */
export const RING_STILLS = {
  /* outer ring */
  '883ab066-dd39-71d8-e308-0e0f4d18fa80': photoFile('h01-port-blue-hour', 1024),      // video-8
  '883ab066-dd39-71d8-e308-0e0f4d18fa82': photoFile('h02-night-inquiry', 1024),       // video-2
  '883ab066-dd39-71d8-e308-0e0f4d18fa84': photoFile('h03-sample-wall', 1024),         // video-1
  '883ab066-dd39-71d8-e308-0e0f4d18fa86': photoFile('h04-caliper-qc', 1024),          // video-6
  '883ab066-dd39-71d8-e308-0e0f4d18fa88': photoFile('h05-assembly-line', 1024),       // video-4
  '883ab066-dd39-71d8-e308-0e0f4d18fa8a': photoFile('h06-packing', 1024),             // video-3
  '883ab066-dd39-71d8-e308-0e0f4d18fa8c': photoFile('h07-owner-walk', 1024),          // video-7
  '883ab066-dd39-71d8-e308-0e0f4d18fa8e': photoFile('h08-product-shoot', 1024),       // video-9
  '883ab066-dd39-71d8-e308-0e0f4d18fa90': photoFile('h09-container-loading', 1024),   // video-10
  '883ab066-dd39-71d8-e308-0e0f4d18fa92': photoFile('h10-video-showing', 1024),       // video014
  '883ab066-dd39-71d8-e308-0e0f4d18fa94': photoFile('p03-fulfilment', 768),           // video-11
  '883ab066-dd39-71d8-e308-0e0f4d18fa96': photoFile('c08-product-references', 1024),  // video-16
  '883ab066-dd39-71d8-e308-0e0f4d18fa98': photoFile('w02-workshop'),                  // video-15
  /* inner ring, in DOM order */
  '883ab066-dd39-71d8-e308-0e0f4d18fa9c': photoFile('h01-port-blue-hour', 1024),      // video-8
  '883ab066-dd39-71d8-e308-0e0f4d18fa9e': photoFile('h03-sample-wall', 1024),         // video-1
  '883ab066-dd39-71d8-e308-0e0f4d18faa0': photoFile('h02-night-inquiry', 1024),       // video-2
  '883ab066-dd39-71d8-e308-0e0f4d18faa2': photoFile('h05-assembly-line', 1024),       // video-4
  '883ab066-dd39-71d8-e308-0e0f4d18faa4': photoFile('h04-caliper-qc', 1024),          // video-6
  '883ab066-dd39-71d8-e308-0e0f4d18faa6': photoFile('h07-owner-walk', 1024),          // video-7
  '883ab066-dd39-71d8-e308-0e0f4d18faa8': photoFile('h06-packing', 1024),             // video-3
  '883ab066-dd39-71d8-e308-0e0f4d18faaa': photoFile('h09-container-loading', 1024),   // video-10
  '883ab066-dd39-71d8-e308-0e0f4d18faab': photoFile('p03-fulfilment', 768),           // video-11
  '883ab066-dd39-71d8-e308-0e0f4d18faad': photoFile('h09-container-loading', 1024),   // video-10 again
  '883ab066-dd39-71d8-e308-0e0f4d18faae': photoFile('h08-product-shoot', 1024),       // video-9
  '883ab066-dd39-71d8-e308-0e0f4d18faaf': photoFile('c08-product-references', 1024),  // video-11, 2nd repeat
  '883ab066-dd39-71d8-e308-0e0f4d18fab1': photoFile('w02-workshop'),                  // video-11 repeat (W02)
  '883ab066-dd39-71d8-e308-0e0f4d18fab3': photoFile('h10-video-showing', 1024),       // video014
};

/**
 * The capability page's other photograph slots (the owner's batches 1, 2, 5
 * and 6, 2026-10-21), each named by the batch manifest with the picture it
 * showed until then. Every path is the photograph's widest file; the blocks
 * write it as the src and tools/editorial-images.mjs adds the narrower widths,
 * the size and the manifest's alt. Crop points are in css/stargo-fusion.css
 * (the "capability page" block). The other places the replaced files appear
 * (the homepage, enterprise, the side menu's slides, the Growth OS rows'
 * hover thumbnails) keep them.
 */
export const CAP_PHOTOS = {
  /* 四个板块，十四类能力 (the four area cards, C01–C04) and 一条业务主线's eight
     orbit thumbnails were photographs here until 2026-10-23; they are drawn in
     code now (tools/code-art-capareas.mjs: the motion scenes of
     js/stargo-motion-areas.js, and static SVG for the orbit). */
  /* Growth OS (tools/blocks/cn-service.mjs): since 2026-10-23 the rows'
     four full-bleed backgrounds are code-drawn (GROWTH_ROWS[].scene); the
     night photographs C11v2-C14 are no longer placed. */
  /* Sales Desk (tools/blocks/qx-news.mjs, through SALES_ROWS): 统一询盘入口 and
     客户全景. The middle row keeps its product screen. Since 2026-10-23 these four
     slots (inbox, customer360, quote, creative) are drawn in code on the page
     (scenes inbox, account, quote, creative: tools/motion-capsales.mjs); the
     photographs stay here as the slot's source tag and the way back. */
  inbox: photoFile('c05-unified-inbox', 768),
  customer360: photoFile('c06-customer-360', 1600),
  /* 报价 (tools/blocks/rk-stats.mjs, CAP_V6A.quote.image in tools/copy.mjs). */
  quote: photoFile('c07-quote-approval', 768),
  /* 图片 / 视频 (tools/blocks/cn-faq.mjs): the portrait beside the accordion. */
  creative: photoFile('c08-product-references', 1024),
  /* 让 AI 团队把活干完 (tools/blocks/qx-projects.mjs): all three cards are
     code-drawn scenes since 2026-10-23 (CAP_V6A.team.cards[].motion in
     tools/copy.mjs; C09 and C10 were the first two). */
};

/* The demo band behind the glass form (index, capabilities, enterprise) is a
   CSS background: css/stargo-fusion.css sets .photo-section to G01,
   assets/stargo-photo/g01-cta-loading-bay-dusk-2048.webp. */

/**
 * The blog (group "blog", 2026-10-21; site-images/batch-8, B01–B07): each
 * article's cover photograph, by article slug (tools/blog.mjs POSTS).
 * It is the picture of the article's hero and of its card in the blog index
 * (blog.html) and in every article's 「更多文章」 list (tools/build-site.mjs).
 * A slug not listed keeps its cover from assets/blog/ there. The covers in
 * assets/blog/ (tools/blog-covers.mjs) stay what the articles share
 * (og:image, twitter:image, the BlogPosting image); the homepage's and
 * workforce's article cards take the same photographs through their own
 * lists, HOME_BLOG_COVERS and WORKFORCE_BLOG_COVERS. Values are each
 * photograph's widest file; tools/editorial-images.mjs writes the srcset, the
 * size and the alt, css/stargo-fusion.css (the "blog" block at its end) the
 * crop point.
 *
 * Since 2026-10-23 (lane "blog") none of these photographs is placed: every
 * one of those slots draws the article's cover in code (tools/blog-art.mjs,
 * css/stargo-blog-art.css; tools/build-site.mjs coverFor). The three lists
 * stay as the record of what B01–B07 were and where they went; the files stay
 * in assets/stargo-photo/ until the owner decides.
 */
export const BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01v2-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
  'approval-gates-for-ai-in-trade': photoFile('b04v2-approval-handover', 1600),
  '288-ai-employees-not-288-chatbots': photoFile('b05-288-relay', 1600),
  'ai-operating-system-for-global-trade': photoFile('b06-browser-os', 1600),
  'enterprise-ontology-explained': photoFile('b07v2-knowledge-library', 1600),
};

/**
 * intelligence.html, both languages (group "blog", 2026-10-21;
 * site-images/batch-8, I01–I03), in place of the Lifelogx template's
 * photographs: `observe` the full-bleed picture under the four lines
 * 观察真实流程 … 用实际结果改进 (#lx-more), `closing` the picture of the pink
 * closing card (#lx-evolution), `phone` the hand-held phone of the "no
 * writing" band, whose screen layer (since 2026-10-23 the code-drawn 'feed'
 * scene, js/stargo-motion-phone.js) stays laid over it.
 */
export const INTEL_PHOTOS = {
  observe: photoFile('i01-observe-process', 2048),
  /* the closing card's picture (I02) is code-drawn since 2026-10-23: the
     'improve' scene (js/stargo-motion-improve.js, tools/build-site.mjs lxPage) */
  phone: photoFile('i03-hand-phone-blank', 768),
};

/**
 * Editorial ids, no extension. Order is the chrome photo-strip cycle
 * (tools/chrome.mjs SCREENS). Published file: editorialFile(id).
 */
export const OS_ART = {
  cockpit: 'os-cockpit',
  salesDesk: 'os-sales-desk',
  inquiries: 'os-inquiries',
  agentCenter: 'os-agent-center',
  quoteStudio: 'os-quote-studio',
  tradeExecution: 'os-trade-execution',
  desktop: 'os-desktop',
  login: 'os-login',
  boot: 'os-boot',
  loading: 'os-loading',
};

/** Released product screenshots. Stems match tools/imagegen/product-assets.json.
 *  gos01, gos09, gos11 and sw033 keep these names; their pixels are the
 *  2026-09-22 curated stills (growth analytics, control centre, workspace
 *  home, sales workbench). */
export const PRODUCT_IDS = {
  workspace: 'sw003-ai-workspace-home',
  experts: 'sw004-experts-library',
  teams: 'sw006-expert-teams',
  workflows: 'sw008-workflow-library',
  inquiry: 'sw028-sales-desk-inquiry-reply',
  documents: 'sw033-sales-desk-document-pack',
  growth: 'gos10-growth-control-tower',
  market: 'gos01-market-thesis',
  reorder: 'gos09-reorder-radar',
  committee: 'gos05-buying-committee',
  reactivation: 'gos11-dormant-reactivation',
  /* Clean captures of the product with demonstration data (2026-10-21,
     site-images/screens-final), cut to the slot that shows them. They replace
     sw033 and gos01 (a live mailbox and an infrastructure panel) and the
     generated renders behind sw028 and brand-family-02. */
  caseDesk: 'live09-sales-desk-case-4x3',
  caseStage: 'live09-sales-desk-case-3x2',
  erpItems: 'live23-erp-items-16x9',
  erpStage: 'live23-erp-items-3x2',
  growthHome: 'live05-growth-home-2x1',
  growthTile: 'live05-growth-home-16x9',   // the same capture on a 16:9 plate (homemore, 2026-10-23)
  growthStartThumb: 'live05-growth-home-start-5x4',
  needs: 'live52-mobile-case-needs',
  quoteApproval: 'live18-quote-approval-16x9',
  desktopHome: 'live01-desktop-home-16x9',
  caseWide: 'live09-sales-desk-case-16x9',
  mobileCase: 'live52-mobile-case-16x9',
  mobilePair: 'live51-52-mobile-pair-16x9', // both phone captures whole on one 16:9 plate (homemore, 2026-10-23)
};

export const PRODUCT = Object.fromEntries(
  Object.entries(PRODUCT_IDS).map(([key, id]) => [key, productFile(id)]),
);
/* Names the homepage and notices builders already use. */
PRODUCT.workspaceHome = PRODUCT.workspace;
PRODUCT.expertsLibrary = PRODUCT.experts;
PRODUCT.inquiryReply = PRODUCT.inquiry;
PRODUCT.documentPack = PRODUCT.documents;

/**
 * Hero rotating gallery (tools/blocks/ro-gallery.mjs). Six screens, each
 * shown four times. Stems only; the block adds assets/stargo-product/ and .webp.
 *
 * Since 2026-10-23 (homemore lane) all six are real captures of the product
 * with demo data, every one 16:9 like the tile: the web desktop, the Growth
 * OS home, the ERP item list, the two phone screens (deal board and an
 * inquiry, whole, side by side), the Sales Desk case and quote approval. They replaced, in the same slots, the generated
 * marketing composites sw003 (workspace), sw004 (experts), sw006 (teams),
 * sw008 (workflows) and sw028 (inquiry reply).
 */
export const GALLERY_TILES = [
  PRODUCT_IDS.desktopHome,
  PRODUCT_IDS.growthTile,
  PRODUCT_IDS.erpItems,
  PRODUCT_IDS.mobilePair,
  PRODUCT_IDS.caseWide,
  PRODUCT_IDS.quoteApproval,
];

/**
 * Homepage core-system cards (Scalora product switcher), desktop and phone.
 * Keys are the start of the slot title in both languages.
 */
export const HOME_MODULES = {
  'Growth OS': PRODUCT.growth,
  'Sales Desk': PRODUCT.caseDesk,
  ERP: PRODUCT.erpItems,
  'AI 创作': editorialToken('os-boot'),
  'AI Creative': editorialToken('os-boot'),
};

/**
 * Homepage five business-stage cards, in page order. `file` is the generator
 * path (a product path, an editorial token or an owner photograph).
 *
 * Since 2026-10-21 all five are the owner's photographs (site-images/batch-2,
 * P01–P05). They replaced, in order, the Growth OS home, the Sales Desk case
 * and the ERP item list (the clean captures placed the same morning), the
 * brand-family-01 illustration and the gos11 workspace home. Those product
 * files keep their other places; the old values are kept here so the owner
 * can put a screen back by swapping one line.
 *   001 PRODUCT.growthHome · 002 PRODUCT.caseStage · 003 PRODUCT.erpStage
 *   004 editorialToken('brand-family-01') · 005 PRODUCT.reactivation
 *
 * Since 2026-10-23 (homemore) none of these is placed: the five cards are
 * code-drawn scenes (tools/code-art-homemore.mjs, js/stargo-motion-stages.js).
 * The list stays as the record of what can go back, one line per card.
 */
export const HOME_STAGES = [
  { id: 'acquisition', label: '001 主动获客', file: photoFile('p01-prospecting', 480) },
  { id: 'sales', label: '002 外贸销售', file: photoFile('p02-sales', 480) },
  { id: 'fulfillment', label: '003 企业履约', file: photoFile('p03-fulfilment', 768) },
  { id: 'collection', label: '004 回款与服务', file: photoFile('p04-payment-docs', 480) },
  { id: 'reorder', label: '005 复购与改进', file: photoFile('p05-reorder', 480) },
];

/**
 * The homepage's other owner photographs (2026-10-21; site-images/batch-1,
 * batch-2, batch-4 and batch-8), slot by slot. Each value is the photograph's
 * widest file; tools/editorial-images.mjs writes the narrower ones into the
 * srcset, the alt and the size, and css/stargo-fusion.css (the "home" block
 * at its end) the crop point. Only these homepage slots change: every file
 * they replace keeps its other places.
 */
/** The opening mosaic the white hero card shrinks to reveal
 *  (`.hero-photo-wrapper` up and down; tools/chrome.mjs). The mosaic cycles
 *  the os-* stills in a fixed order; each os-* still becomes, wherever it
 *  falls in the mosaic, the photograph the batch-1 manifest names for it
 *  (H01–H10). The cursor tooltip's picture rotator (`.image-text-rotator`)
 *  after it keeps the os-* stills.
 *  Since 2026-10-24 (lane "vignettes"; owner: 能用代码的图片都改成代码) no
 *  photograph is placed here: tools/code-art-vignettes.mjs draws, in each
 *  tile, the vignette of the photograph this map names (VIGNETTE_OF), in the
 *  same cycle order and box. The map stays the record and the way back. */
export const HOME_MOSAIC = {
  'os-cockpit': photoFile('h05-assembly-line', 1024),
  'os-sales-desk': photoFile('h02-night-inquiry', 1024),
  'os-inquiries': photoFile('h03-sample-wall', 1024),
  'os-agent-center': photoFile('h06-packing', 1024),
  'os-quote-studio': photoFile('h04-caliper-qc', 1024),
  'os-trade-execution': photoFile('h01-port-blue-hour', 1024),
  'os-desktop': photoFile('h10-video-showing', 1024),
  'os-login': photoFile('h07-owner-walk', 1024),
  'os-boot': photoFile('h08-product-shoot', 1024),
  'os-loading': photoFile('h09-container-loading', 1024),
};
/** The four pain-point cards under the loop band, in page order (S01–S04).
 *  They replaced silo-email, silo-whatsapp, silo-excel and silo-erp. */
export const HOME_SILOS = [
  photoFile('s01-inquiry-rework', 1600),
  photoFile('s02-scattered-chats', 1600),
  photoFile('s03v2-spreadsheet-memory', 1600),
  photoFile('s04-chasing-order', 2048),
];
/** The four scenario cards' film card (`.testimonials-card._03`): R2, the
 *  trade manager at the whiteboard, as a still where the template's
 *  portrait film played. The split photograph behind the cards
 *  (`.photo-half`, R1) is a CSS background: css/stargo-fusion.css. */
export const HOME_ROLE_CARD = photoFile('r2-trade-manager', 1024);
/** The pricing band's image card beside 企业版 (T01), in place of
 *  brand-glow-square. Not placed since 2026-10-23 (homemore): the card is the
 *  code-drawn 'org' scene (js/stargo-motion-org.js); kept so the photograph
 *  can go back with one line. */
export const HOME_PRICING_CARD = photoFile('t01-enterprise-campus', 1024);
/** The homepage's four newest-article cards (B01–B04), by article slug. A
 *  slug not listed keeps its article cover from assets/blog/. The blog index
 *  and the articles show the same photographs (BLOG_COVERS); only the
 *  articles' share images keep the assets/blog/ covers. Not placed since
 *  2026-10-23: the cards draw their covers in code (see BLOG_COVERS). */
export const HOME_BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01v2-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
  'approval-gates-for-ai-in-trade': photoFile('b04v2-approval-handover', 1600),
};

/**
 * Capability page, Growth OS rows (tools/blocks/cn-service.mjs).
 * `art` was the full-bleed editorial id; from 2026-10-21 the full-bleed
 * backgrounds were the owner's photographs (C11v2-C14), and since 2026-10-23
 * they are code-drawn scenes: `scene` names each row's background
 * (js/stargo-motion-growth.js — 企业研究 a company file assembling, 贸易情报
 * shipping lanes, 补货判断 PT Surya's order rhythm, 关键角色 the buying
 * committee). `art` is only the hover thumbnail of a row whose `shot` (the
 * hover thumbnail's product stem) is null.
 */
export const GROWTH_ROWS = [
  { art: 'brand-family-01', shot: null, scene: 'dossier' },
  { art: OS_ART.salesDesk, shot: PRODUCT_IDS.growthStartThumb, scene: 'lanes' },
  { art: OS_ART.loading, shot: PRODUCT_IDS.reorder, scene: 'rhythm' },
  { art: 'mobile-approvals', shot: PRODUCT_IDS.committee, scene: 'committee' },
];

/**
 * Capability page, Sales Desk rows (tools/blocks/qx-news.mjs).
 * An editorial id, or a product or photograph path written as-is. Rows 1 and
 * 3 are the owner's photographs since 2026-10-21 (C05, C06; they had
 * os-desktop and os-inquiries).
 */
export const SALES_ROWS = [CAP_PHOTOS.inbox, PRODUCT.needs, CAP_PHOTOS.customer360];

/** Capability showcase story pictures. Editorial ids. */
export const STORY_ART = {
  growthOs: OS_ART.cockpit,
  salesDesk: OS_ART.salesDesk,
  quote: OS_ART.quoteStudio,
  erp: OS_ART.tradeExecution,
  creative: 'brand-family-01',
  team: OS_ART.agentCenter,
  desktop: OS_ART.desktop,
  login: OS_ART.login,
  knowledge: 'brand-ontology',
  improvement: 'brand-loop',
};

/** Notices “keep reading” cards, in card order. Since 2026-10-23 (homemore)
 *  the first is the real Growth OS home capture (it was the sw003 composite;
 *  the web-desktop capture live01 is kept off this card because at this size
 *  its 'Stargo Office 365.app' icon label is readable) and the second, 数字员工,
 *  is the code-drawn 'team' scene (`motion`, placed by tools/build-site.mjs; it
 *  was the sw004 composite). */
export const NOTICES_CARDS = [PRODUCT.growthTile, { motion: 'team' }, PRODUCT.quoteApproval];

/**
 * The owner's photographs on about, contact, pricing and workforce
 * (2026-10-21; site-images/batch-4, batch-5 and batch-8), slot by slot. Each
 * value is the photograph's widest file; tools/editorial-images.mjs writes the
 * narrower ones into the srcset, the alt and the size, and
 * css/stargo-fusion.css (the "pages" block at its end) the crop point. Only
 * these slots change: every file they replace keeps its other places.
 *
 * The about page's introduction band behind 「从真实业务出发…」 (A01, the
 * empty workshop at dawn) is a CSS background: css/stargo-fusion.css.
 */
/** The four scenario slides of the testimonial slider on about.html
 *  (tools/blocks/cn-about-reviews.mjs) and pricing.html (cn-reviews.mjs),
 *  keyed by the cinery portrait each one showed (R1–R4, the slides' own
 *  order: sales rep, trade manager, sales director, general manager). Only
 *  the slides' cover picture changes; the 56px avatars in the pricing card's
 *  rating block keep the template portraits. */
export const ROLE_SLIDES = {
  '695ffb11547e68b53adbfd91_client-04': photoFile('r1-sales-rep', 1639),
  '695ffb11eb1deaba179419b4_client-02': photoFile('r2-trade-manager', 1024),
  '695ffb115a835fdec642a548_client-03': photoFile('r3-sales-director', 1024),
  '695ffb11be2d7e781e33b929_client-01': photoFile('r4-general-manager', 1024),
};
/** about.html's four AI-employee tiles (tools/blocks/cn-about-projects.mjs),
 *  by the clip's video id: a still in place of each cinery case-study film,
 *  matched by the tile's role (D01 市场信号, D07 报价, D02 跟进, D05 统筹).
 *  Since 2026-10-23 the tiles draw these roles in code (tools/code-art-people.mjs
 *  ABOUT_CASE_SCENES); kept as the record of which photograph each replaced. */
export const ABOUT_CASE_STILLS = {
  'fb6f08c0-bccf-aeab-a33d-45198963fe74': photoFile('d01-market-research', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963fe90': photoFile('d07-quotation', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963feae': photoFile('d02-follow-up', 1024),
  'fb6f08c0-bccf-aeab-a33d-45198963feca': photoFile('d05-coordination', 1024),
};
/** contact.html's quote card (`.testimonials-card._03.rl`, beside the
 *  form): K01, the meeting table, as a still where the template's
 *  Professional Portrait film played. */
export const CONTACT_CARD = photoFile('k01-meeting-table', 768);
/** workforce.html's five marquee role cards (`.lx-feature-hero-card.lx-_1`
 *  … `lx-_5`, each drawn twice for the loop) and the collage card in the
 *  desktop item (报告 AI 员工), keyed by the lifelogx asset id of the
 *  picture each showed (D01–D06). Since 2026-10-23 the cards are static code
 *  cards and the collage card the 'deskReport' scene (tools/code-art-people.mjs
 *  roleCard, tools/build-site.mjs); kept as the record, the build only checks
 *  that the six slots are still there. */
export const WORKFORCE_ROLES = {
  '6941e78a09a85d0bd053b266': photoFile('d01-market-research', 1024),   // Item → Variant 1
  '694ab25174cbe821ec5d8930': photoFile('d02-follow-up', 1024),         // ChatGPT Image Dec 23, 2025, 04_16_19 PM
  '6942777374324a552a47ab30': photoFile('d03-product-spec', 480),       // Link - image 64 → bELwQd7…
  '694277a49143d5ea0557c371': photoFile('d04-finance', 480),            // Link - image 64 → ujtmvGk…
  '694aada59524a64f6280d410': photoFile('d05-coordination', 1024),      // ChatGPT Image Dec 23, 2025, 03_56_21 PM
  '694277bf9dc048830e6fca2e': photoFile('d06-reporting', 480),          // Link - image 64 → V9yoYRx… (the collage card)
};
/** workforce.html's three article cards under 文章 / 我们写下来的 (B01–B03),
 *  by article slug. They showed the articles' covers, which are fitted
 *  product screenshots (tools/blog-covers.mjs: sw004, sw008, sw028); the
 *  blog index and the articles show the same photographs (BLOG_COVERS), and
 *  only the articles' share images keep those covers. Not placed since
 *  2026-10-23: the cards draw their covers in code (see BLOG_COVERS). */
export const WORKFORCE_BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01v2-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
};

/** Workforce / About pictures that reuse a hero or product slot. The
 *  workforce tile and the capability page's teamwork card (workforceTile and
 *  teamCard, both PRODUCT.teams until 2026-10-23) are the code-drawn 'team'
 *  scene now (tools/motion-scenes.mjs). */
export const PLACED = {
  // Feeds only the lifelogx about build that tools/build-site.mjs discards (its result is `void`ed):
  // about.html / en/about.html never show the poster, so this slot has nothing on a page to replace.
  aboutBigImage: HERO.poster,
};
/* The quote band's picture and the 图片 / 视频 portrait (STORY_ART.quoteBand
   and PLACED.creativePicture until 2026-10-21) are CAP_PHOTOS.quote and
   CAP_PHOTOS.creative. */

/**
 * Enterprise page (enterprise.html and en/enterprise.html, the Mono studio
 * layout: tools/build-site.mjs PAGES['enterprise.html'] and fromStudio). Since
 * 2026-10-21 every picture on it is one of the owner's photographs
 * (site-images/batch-7, E01–E13), in place of the site's concept art; the
 * editorial files they replaced keep their places on the other pages and in
 * the hidden nav-menu rotator.
 * - `cockpit`: the three scroll-revealed pictures in the column beside
 *   「(老板驾驶舱)」. They were E05 the dawn office, E06 the owner on the phone
 *   at a stopped machine and E07 the ledger; on 2026-10-23 the owner chose to
 *   replace these three with code-drawn motion (tools/motion-scenes.mjs), so
 *   each entry names a scene, in page order: the cockpit overview, a blocker
 *   a person takes over, and usage against the budget limit. E05–E07 stay
 *   registered and published, unplaced (tools/verify-editorial.mjs RETIRED).
 * - `principle`: the rounded parallax picture beside 「(原则)」, E08 the
 *   emergency stop.
 * - `modules`: the five cards under 「五个管理组件 (5)」, in card order: E09
 *   pegboard, E10 badge reader, E11 stamp, E12 clipboard, E13 key cabinet
 *   (its own file, not os-login). A card draws its picture whole, so the
 *   picture's shape sets the card's height.
 * The four sticky story panels (决定, 核对, 连接, 经营; E01–E04) are CSS
 * backgrounds, set in css/stargo-fusion.css (the batch 7 block).
 * Since 2026-10-23 `principle`, `modules` and E01–E04 are drawn in code on the
 * built pages (tools/code-art-enterprise.mjs replaces them after the page is
 * built); the entries stay so the pipeline and the files stay as they were.
 */
export const ENTERPRISE_PHOTOS = {
  cockpit: [{ motion: 'cockpit-overview' }, { motion: 'cockpit-blocker' }, { motion: 'cockpit-budget' }],
  principle: photoFile('e08-emergency-stop', 1024),
  modules: ['e09-capabilities', 'e10-access', 'e11-approval', 'e12-records', 'e13-key-cabinet'].map((id) => photoFile(id, 480)),
};

if (HERO.theatre.length !== 7) throw new Error('replaceables: hero theatre is seven cells');
if (HERO.centreIndex !== 3) throw new Error('replaceables: the film replaces theatre cell 3');
if (HERO.code.length !== 7 || HERO.code[HERO.centreIndex] !== null) throw new Error('replaceables: the theatre\'s code-drawn windows take the six cells around the film');
if (OG.width !== 1200 || OG.height !== 630) throw new Error('replaceables: the share card stays 1200×630');
/* A JPEG or PNG (link previews do not all read WebP), named with its size,
   written as the final URL (no editorial token to rewrite). */
if (OG.token !== OG.file || !/^assets\/[\w/-]+-1200x630\.(?:jpg|png)$/.test(OG.file)) {
  throw new Error(`replaceables: the share card is a 1200x630 JPEG or PNG named with its size, not ${OG.file}`);
}
