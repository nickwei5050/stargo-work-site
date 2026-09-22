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

/** Share cover. chrome.mjs writes `token`; pages publish `file`. */
export const OG = {
  token: editorialToken('og-cover', 'png'),
  file: editorialFile('og-cover', 'png'),
  width: 1200,
  height: 630,
};

/**
 * Homepage sticky video grid (the Fearless Vision centre film plus the
 * stills around it). `theatre[centreIndex]` is replaced by `film` / `poster`
 * and is not shown as a still. The opening overlay (tools/blocks/og-intro.mjs)
 * has no image file.
 */
export const HERO = {
  film: 'assets/stargo-motion/orbit.mp4',
  poster: 'assets/stargo-motion/orbit-poster.webp',
  centreIndex: 3,
  theatre: [
    editorialToken('os-boot'),
    editorialToken('os-loading'),
    editorialToken('os-login'),
    editorialToken('os-desktop'),
    editorialToken('os-cockpit'),
    editorialToken('os-agent-center'),
    editorialToken('os-inquiries'),
  ],
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
  PRODUCT_IDS.documents,
];

/**
 * Homepage core-system cards (Scalora product switcher), desktop and phone.
 * Keys are the start of the slot title in both languages.
 */
export const HOME_MODULES = {
  'Growth OS': PRODUCT.growth,
  'Sales Desk': PRODUCT.inquiryReply,
  ERP: editorialToken('brand-family-02'),
  'AI 创作': editorialToken('os-boot'),
  'AI Creative': editorialToken('os-boot'),
};

/**
 * Homepage five business-stage cards, in page order. `file` is the generator
 * path (a product path, or an editorial token).
 */
export const HOME_STAGES = [
  { id: 'acquisition', label: '001 主动获客', file: PRODUCT.market },
  { id: 'sales', label: '002 外贸销售', file: PRODUCT.inquiryReply },
  { id: 'fulfillment', label: '003 企业履约', file: PRODUCT.documentPack },
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
  { art: OS_ART.salesDesk, shot: PRODUCT_IDS.market },
  { art: OS_ART.loading, shot: PRODUCT_IDS.reorder },
  { art: 'mobile-approvals', shot: PRODUCT_IDS.committee },
];

/**
 * Capability page, Sales Desk rows (tools/blocks/qx-news.mjs).
 * An editorial id, or a product path written as-is.
 */
export const SALES_ROWS = [OS_ART.desktop, PRODUCT.inquiry, OS_ART.inquiries];

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
export const NOTICES_CARDS = [PRODUCT.workspaceHome, PRODUCT.expertsLibrary, PRODUCT.documentPack];

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
