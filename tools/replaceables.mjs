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
 *     file, including its width variants, and leave the name alone.
 *   - An owner photograph (`assets/stargo-photo/<id>-<width>.webp`, registered
 *     in tools/imagegen/photo-assets.json) is written as the final URL too, but
 *     never overwritten: /assets is cached immutable for a year, so a new
 *     picture gets a new id and tools/imagegen/prepare-photos.mjs writes it.
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
 */
export const HERO = {
  film: 'assets/stargo-motion/orbit.mp4',
  poster: 'assets/stargo-motion/orbit-poster.webp',
  centreIndex: 3,
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
 */
export const RING_STILLS = {
  '883ab066-dd39-71d8-e308-0e0f4d18fa98': photoFile('w02-workshop'),
  '883ab066-dd39-71d8-e308-0e0f4d18fab1': photoFile('w02-workshop'),
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
 * (og:image, twitter:image, the BlogPosting image) and what the homepage and
 * workforce cards show until their own groups place them. Values are each
 * photograph's widest file; tools/editorial-images.mjs writes the srcset, the
 * size and the alt, css/stargo-fusion.css (the "blog" block at its end) the
 * crop point.
 */
export const BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
  'approval-gates-for-ai-in-trade': photoFile('b04-approval-handover', 1600),
  '288-ai-employees-not-288-chatbots': photoFile('b05-288-relay', 1600),
  'ai-operating-system-for-global-trade': photoFile('b06-browser-os', 1600),
  'enterprise-ontology-explained': photoFile('b07-knowledge-library', 1600),
};

/**
 * intelligence.html, both languages (group "blog", 2026-10-21;
 * site-images/batch-8, I01–I03), in place of the Lifelogx template's
 * photographs: `observe` the full-bleed picture under the four lines
 * 观察真实流程 … 用实际结果改进 (#lx-more), `closing` the picture of the pink
 * closing card (#lx-evolution), `phone` the hand-held phone of the "no
 * writing" band, whose text-free screen (mobile-core) stays laid over it.
 */
export const INTEL_PHOTOS = {
  observe: photoFile('i01-observe-process', 2048),
  closing: photoFile('i02-keep-or-revert', 768),
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
  growthStartThumb: 'live05-growth-home-start-5x4',
  needs: 'live52-mobile-case-needs',
  quoteApproval: 'live18-quote-approval-16x9',
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
 */
export const GALLERY_TILES = [
  PRODUCT_IDS.workspace,
  PRODUCT_IDS.experts,
  PRODUCT_IDS.teams,
  PRODUCT_IDS.workflows,
  PRODUCT_IDS.inquiry,
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
 * path (a product path, or an editorial token).
 */
export const HOME_STAGES = [
  { id: 'acquisition', label: '001 主动获客', file: PRODUCT.growthHome },
  { id: 'sales', label: '002 外贸销售', file: PRODUCT.caseStage },
  { id: 'fulfillment', label: '003 企业履约', file: PRODUCT.erpStage },
  { id: 'collection', label: '004 回款与服务', file: editorialToken('brand-family-01') },
  { id: 'reorder', label: '005 复购与改进', file: PRODUCT.reactivation },
];

/**
 * Capability page, Growth OS rows (tools/blocks/cn-service.mjs).
 * `art` is the full-bleed editorial id. `shot` is the hover thumbnail stem,
 * or null when the row keeps the editorial art.
 */
export const GROWTH_ROWS = [
  { art: 'brand-family-01', shot: null },
  { art: OS_ART.salesDesk, shot: PRODUCT_IDS.growthStartThumb },
  { art: OS_ART.loading, shot: PRODUCT_IDS.reorder },
  { art: 'mobile-approvals', shot: PRODUCT_IDS.committee },
];

/**
 * Capability page, Sales Desk rows (tools/blocks/qx-news.mjs).
 * An editorial id, or a product path written as-is.
 */
export const SALES_ROWS = [OS_ART.desktop, PRODUCT.needs, OS_ART.inquiries];

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
  quoteBand: OS_ART.quoteStudio,
  knowledge: 'brand-ontology',
  improvement: 'brand-loop',
};

/** Notices “keep reading” cards, in card order. */
export const NOTICES_CARDS = [PRODUCT.workspaceHome, PRODUCT.expertsLibrary, PRODUCT.quoteApproval];

/** Workforce / About pictures that reuse a hero or product slot. */
export const PLACED = {
  workforceTile: PRODUCT.teams,
  aboutBigImage: HERO.poster,
  teamCard: PRODUCT.teams,
  creativePicture: OS_ART.boot,
};

if (HERO.theatre.length !== 7) throw new Error('replaceables: hero theatre is seven cells');
if (HERO.centreIndex !== 3) throw new Error('replaceables: the film replaces theatre cell 3');
if (OG.width !== 1200 || OG.height !== 630) throw new Error('replaceables: the share card stays 1200×630');
/* A JPEG or PNG (link previews do not all read WebP), named with its size,
   written as the final URL (no editorial token to rewrite). */
if (OG.token !== OG.file || !/^assets\/[\w/-]+-1200x630\.(?:jpg|png)$/.test(OG.file)) {
  throw new Error(`replaceables: the share card is a 1200x630 JPEG or PNG named with its size, not ${OG.file}`);
}
