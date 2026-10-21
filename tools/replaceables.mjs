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
 * The Open Graph file stays `og-cover.png` at 1200×630. Renaming it means
 * updating OG.token, OG.file, and every built meta tag together.
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

/** Share cover. chrome.mjs writes `token`; pages publish `file`. */
export const OG = {
  token: editorialToken('og-cover', 'png'),
  file: editorialFile('og-cover', 'png'),
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
 *  after it keeps the os-* stills. */
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
  photoFile('s03-spreadsheet-memory', 1600),
  photoFile('s04-chasing-order', 2048),
];
/** The four scenario cards' film card (`.testimonials-card._03`): R2, the
 *  trade manager at the whiteboard, as a still where the template's
 *  portrait film played. The split photograph behind the cards
 *  (`.photo-half`, R1) is a CSS background: css/stargo-fusion.css. */
export const HOME_ROLE_CARD = photoFile('r2-trade-manager', 1024);
/** The pricing band's image card beside 企业版 (T01), in place of
 *  brand-glow-square. */
export const HOME_PRICING_CARD = photoFile('t01-enterprise-campus', 1024);
/** The homepage's four newest-article cards (B01–B04), by article slug. A
 *  slug not listed keeps its article cover from assets/blog/. The blog
 *  index, the articles and the share images keep those covers. */
export const HOME_BLOG_COVERS = {
  'stargo-work-visual-guide': photoFile('b01-visual-guide', 1600),
  'start-with-one-workflow': photoFile('b02-one-workflow', 1600),
  'from-inquiry-to-quote': photoFile('b03-inquiry-to-quote', 1600),
  'approval-gates-for-ai-in-trade': photoFile('b04-approval-handover', 1600),
};

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
if (OG.width !== 1200 || OG.height !== 630) throw new Error('replaceables: og-cover stays 1200×630');
if (!OG.file.endsWith('/og-cover.png') || !OG.token.endsWith('/og-cover.png')) {
  throw new Error('replaceables: og-cover.png keeps its name');
}
