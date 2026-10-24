/**
 * Motion-scene regression check (2026-10-24). Real browser, every page in zh
 * and en, four screens; every code-drawn scene host ([data-sg-scene], run by
 * js/stargo-motion.js) is scrolled into view one at a time, the way a visitor
 * reaches it, and checked for the three things the engine promises:
 *
 *   (a) it is built when it nears the screen, and it ticks: the runner's scene
 *       clock (host.__sgT) runs within 1.5 s (with prefers-reduced-motion it
 *       shows the still and stays still); a picture that holds a frame that long
 *       (a scene's designed pause) is a warning, not a failure;
 *   (b) its stage fits inside the host (a host that fits to the screen,
 *       data-sg-fit="viewport", inside the screen: the page grows that host
 *       over a screen-sized picture, so its tag is judged once it covers the screen);
 *   (c) its 动态示意 / 演示数据 tag is there, opaque and not clipped (on the
 *       homepage doors, by either half).
 *
 * A host the page does not show at that screen (a hidden twin, a parked tab, the
 * homepage doors on a phone) is reported as skipped with the reason. A host that
 * only shows part of the way through a pinned section is found by walking that
 * section and checked at the middle and the end of the stretch where it shows
 * most. Also reported, as warnings (not failures): the smallest rendered type in
 * each scene and any text the host or a box inside it cuts.
 *
 *   node tools/verify-motion.mjs                         # site at BASE_URL (default http://127.0.0.1:4200)
 *   VIEWPORTS=1440x900,1280x720,768x1024t,390x844m …     # t: touch tablet, m: phone (default: these four)
 *   PAGES=index.html,en/index.html …                     # default: every page, zh and en
 *   SCENES=loop,night …                                  # only these scenes
 *   RM=1 …                                               # prefers-reduced-motion run
 *
 * Exits non-zero on any failure. Report: .wrangler/motion-qa/report-<viewports>[-rm].json (QA_OUT to change).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { ALL_PAGES } from './chrome.mjs';
import { SITE, req } from './paths.mjs';

const pw = req('@playwright/test');
process.chdir(SITE);
const BASE = (process.env.BASE_URL || 'http://127.0.0.1:4200').replace(/\/+$/, '');
const RM = process.env.RM === '1';
const VIEWPORTS = (process.env.VIEWPORTS || '1440x900,1280x720,768x1024t,390x844m').split(',').map((v) => {
  const m = /^(\d+)x(\d+)([tm]?)$/.exec(v.trim());
  if (!m) throw new Error(`VIEWPORTS: cannot read ${v}`);
  return { name: v.trim(), width: +m[1], height: +m[2], touch: !!m[3] };
});
const ONLY = process.env.SCENES ? new Set(process.env.SCENES.split(',')) : null;   // SCENES=loop,night … checks only these
const PAGES = process.env.PAGES ? process.env.PAGES.split(',') : [...ALL_PAGES].flatMap((p) => [p, `en/${p}`]);
const OUT = process.env.QA_OUT || '.wrangler/motion-qa';
mkdirSync(OUT, { recursive: true });
const NAV = +(process.env.NAV_TIMEOUT || 60000);

/* In-page kit, installed once per page as window.__vm. */
const KIT = `window.__vm = (() => {
  const TAG = /动态示意|演示数据|示意|Illustrative|Illustration|[Dd]emo data/;
  const INF = [-1e9, -1e9, 1e9, 1e9];
  const hosts = () => [...document.querySelectorAll('[data-sg-scene]')];
  const vp = () => [0, 0, innerWidth, innerHeight];
  const R = (r) => [r.left, r.top, r.right, r.bottom];
  const isect = (a, b) => [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  const area = (a) => Math.max(0, a[2] - a[0]) * Math.max(0, a[3] - a[1]);
  const inside = (a, b, tol) => a[0] >= b[0] - tol && a[1] >= b[1] - tol && a[2] <= b[2] + tol && a[3] <= b[3] + tol;
  const clips = (cs) => cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || /paint|strict|content/.test(cs.contain);
  // the part of the page an element's content can show in: every clipping box from el (or its parent) up
  function clipOf(el, self) {
    let box = INF;
    for (let a = self ? el : el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.display !== 'contents' && clips(cs)) box = isect(box, R(a.getBoundingClientRect()));
    }
    return box;
  }
  function opacity(el, stop) {
    let o = 1;
    for (let a = el; a && a !== stop; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; }
    return o;
  }
  function px(e) {
    const fs = parseFloat(getComputedStyle(e).fontSize);
    if (e instanceof SVGElement) { const m = e.getScreenCTM(); return m ? fs * Math.hypot(m.a, m.b) : fs; }
    const st = e.closest('.sg-mo-stage');
    return st && st.offsetWidth ? fs * st.getBoundingClientRect().width / st.offsetWidth : fs;
  }
  const frames = (n) => new Promise((r) => { const f = () => (--n <= 0 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function jump(y) { if (typeof lenis !== 'undefined' && lenis && lenis.scrollTo) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y); }
  // scroll like a visitor: no more than ~a screen per frame pair, so scroll-driven sections pass through their states
  async function go(y) {
    y = Math.round(Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight)));
    let cur = scrollY, guard = 0;
    while (Math.abs(y - cur) > 1 && guard++ < 400) { cur = y > cur ? Math.min(y, cur + innerHeight * 0.9) : Math.max(y, cur - innerHeight * 0.9); jump(cur); await frames(2); }
  }
  function seen(h) {
    const r = h.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return { a: 0, f: 0, why: 'zero size' };
    if (h.checkVisibility && !h.checkVisibility({ visibilityProperty: true })) return { a: 0, f: 0, why: 'hidden' };
    if (opacity(h, document.documentElement) < 0.05) return { a: 0, f: 0, why: 'transparent' };
    const a = area(isect(isect(R(r), clipOf(h, false)), vp()));
    return { a, f: a / Math.min(area(R(r)), innerWidth * innerHeight), why: a ? '' : 'off screen or clipped' };
  }
  async function place(i, which) {
    const h = hosts()[i];
    if (!h) return { how: 'gone' };
    const r = h.getBoundingClientRect();
    const top = r.top + scrollY, y0 = r.height > innerHeight ? top - 40 : top - (innerHeight - r.height) / 2;
    let s = { why: 'zero size' };
    const direct = which === 'pin' || which === 'end';   // straight to the section walk
    if (!direct) {
      if (r.width >= 8 && r.height >= 8) await go(y0);
      await frames(3); await sleep(350);   // let a fade-in that the scroll started finish
      s = seen(h);
      if (s.f >= 0.45) return { how: 'natural', f: +s.f.toFixed(2) };
    }
    // a host in a sideways scroller: bring it to the scroller's middle
    for (let a = h.parentElement; !direct && a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (/auto|scroll/.test(cs.overflowX) && a.scrollWidth > a.clientWidth + 4) {
        a.scrollLeft += h.getBoundingClientRect().left - a.getBoundingClientRect().left - (a.clientWidth - h.offsetWidth) / 2;
        await frames(3); await sleep(200); s = seen(h);
        if (s.f >= 0.45) return { how: 'scroller', f: +s.f.toFixed(2) };
        break;
      }
    }
    // walk a stretch of the page and settle where the host shows most: first around its own place (a picture
    // that shows while its row is active), then through the tall section it is pinned in
    async function walk(from, to, steps, how) {
      const pts = [];
      for (let k = 0; k <= steps; k++) { await go(from + (to - from) * k / steps); await frames(2); await sleep(90); const v = seen(h); pts.push({ y: scrollY, a: v.f >= 0.45 ? +v.f.toFixed(2) : 0, why: v.why }); }
      const max = Math.max(...pts.map((p) => p.a));
      if (!max) return { why: (pts.find((p) => p.why) || {}).why };
      const run = pts.filter((p) => p.a >= max - 0.02);   // the stretch where the most of it shows (a zoom settles there)
      const pick = which === 'end' ? run[run.length - 1] : run[Math.floor((run.length - 1) / 2)];
      await go(pick.y); await frames(3); await sleep(400);
      const v = seen(h);
      return v.f >= 0.45 ? { how, f: +v.f.toFixed(2), at: +((pick.y - from) / ((to - from) || 1)).toFixed(2) } : { why: 'shows only in passing' };
    }
    const vh = innerHeight;
    if (!direct && r.width >= 8 && r.height >= 8) { const w = await walk(y0 - vh * 2, y0 + vh * 2, 26, 'near'); if (w.how) return w; s.why = w.why || s.why; }
    let sec = h.parentElement;
    while (sec && sec !== document.body && sec.offsetHeight < vh * 1.6) sec = sec.parentElement;
    if (!sec || sec === document.body) return { how: 'none', why: s.why };
    const st = sec.getBoundingClientRect().top + scrollY;
    const w = await walk(st, st + sec.offsetHeight - vh, 25, 'pinned');
    return w.how ? w : { how: 'none', why: 'not shown anywhere in its section (' + (w.why || s.why) + ')' };
  }
  async function measure(i, rm) {
    const h = hosts()[i], o = { scene: h.dataset.sgScene, fit: h.dataset.sgFit || '', label: (h.getAttribute('aria-label') || '').length, hidden: h.getAttribute('aria-hidden') === 'true' };
    let st = h.querySelector(':scope > .sg-mo-stage');
    for (let k = 0; k < 14 && !(st && st.childElementCount); k++) { await sleep(150); st = h.querySelector(':scope > .sg-mo-stage'); }
    o.built = !!(st && st.childElementCount);
    o.on = h.classList.contains('sg-mo-on');
    if (!o.built) return o;
    // (a) ticks: the runner's scene clock (host.__sgT) runs, and the stage changes (other than the runner's own fit transform)
    let n = 0;
    const mo = new MutationObserver((ms) => { for (const m of ms) if (!(m.target === st && m.attributeName === 'style')) n++; });
    await sleep(250);
    mo.observe(st, { subtree: true, childList: true, attributes: true, characterData: true });
    const c0 = h.__sgT, t0 = performance.now();
    while (performance.now() - t0 < (rm ? 1200 : 1500)) { await sleep(100); if (!rm && n >= 3 && h.__sgT - c0 > 0.2) break; }
    mo.disconnect();
    o.mut = n; o.ms = Math.round(performance.now() - t0);
    o.clock = h.__sgT === undefined ? null : +((h.__sgT - (c0 || 0))).toFixed(2);
    // (b) the stage inside the host (inside the on-screen part of a screen-fitted host)
    const hr = R(h.getBoundingClientRect()), sr = R(st.getBoundingClientRect());
    // a screen-fitted host (the homepage band) is a window the page grows over a screen-sized picture: the
    // stage must stay on screen, and is judged against the host only once the host covers the screen
    o.covers = +(area(isect(hr, vp())) / area(vp())).toFixed(2);
    const fitBox = o.fit === 'viewport' ? vp() : hr;
    o.stageOut = [fitBox[0] - sr[0], fitBox[1] - sr[1], sr[2] - fitBox[2], sr[3] - fitBox[3]].map((v) => Math.max(0, Math.round(v)));
    o.scale = +(st.getBoundingClientRect().width / (st.offsetWidth || 1)).toFixed(3);
    o.layout = (/\\bis-([\\w-]+)/.exec(st.className) || /\\bis-([\\w-]+)/.exec(h.className) || [])[1] || '';
    const shown = isect(isect(hr, clipOf(h, false)), o.fit === 'viewport' ? vp() : INF);
    o.hostCut = +(1 - area(isect(hr, clipOf(h, false))) / (area(hr) || 1)).toFixed(2);
    // (c) the honesty tag
    const cands = [...st.querySelectorAll('*')].filter((e) => [...e.childNodes].some((c) => c.nodeType === 3 && TAG.test(c.data)));
    const tag = cands.find((e) => /tag/.test(e.getAttribute('class') || '')) || cands[0];
    if (tag) {
      const tr = R(tag.getBoundingClientRect());
      o.tag = { t: tag.textContent.trim().slice(0, 40), op: +opacity(tag, h).toFixed(2), px: +px(tag).toFixed(1), inHost: inside(tr, shown, 1.5), inScreen: inside(tr, vp(), 1.5), cut: !inside(tr, clipOf(tag, true), 1.5) };
      if (o.fit === 'viewport' && o.covers < 0.95) { o.tag.inHost = true; o.tag.cut = false; o.tag.growing = true; }   // still growing over it
    } else o.tag = null;
    // warnings: smallest type on show, and text that a box cuts
    const small = [], cut = [], done = new Set();
    let min = 99;
    const w = document.createTreeWalker(st, NodeFilter.SHOW_TEXT);
    for (let nd; (nd = w.nextNode());) {
      const e = nd.parentElement;
      if (!nd.data.trim() || done.has(e)) continue;
      done.add(e);
      if (opacity(e, h) < 0.35) continue;
      const rg = document.createRange(); rg.selectNodeContents(nd);
      const r = R(rg.getBoundingClientRect());
      if (area(r) < 4 || !area(isect(r, isect(shown, vp())))) continue;
      const p = px(e);
      min = Math.min(min, p);
      if (p < 11.95) small.push(nd.data.trim().slice(0, 24) + ' ' + p.toFixed(1));
      const cs = getComputedStyle(e);
      if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth) continue;
      if (!inside(r, clipOf(e, true), 1.5)) cut.push(nd.data.trim().slice(0, 24));
    }
    o.minPx = min === 99 ? null : +min.toFixed(1);
    o.small = small.slice(0, 6); o.nSmall = small.length;
    o.cut = cut.slice(0, 6); o.nCut = cut.length;
    return o;
  }
  // a host whose own tag is cut by its box passes if a twin of the same scene beside it shows the tag (the homepage doors)
  function twinTag(i) {
    const h = hosts()[i], g = h.parentElement && h.parentElement.parentElement;
    if (!g) return false;
    return hosts().some((x, j) => j !== i && x.dataset.sgScene === h.dataset.sgScene && g.contains(x) && [...x.querySelectorAll('*')].some((e) => {
      if (![...e.childNodes].some((c) => c.nodeType === 3 && TAG.test(c.data))) return false;
      const r = R(e.getBoundingClientRect());
      return opacity(e, x) > 0.3 && inside(r, isect(clipOf(e, true), vp()), 1.5);
    }));
  }
  function pinned(i) {
    for (let a = hosts()[i].parentElement; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).position === 'sticky') return true;
    return false;
  }
  return { count: () => hosts().length, place, measure, twinTag, pinned, list: () => hosts().map((h) => h.dataset.sgScene) };
})();`;

const browser = await pw.chromium.launch();
const report = [];
let fails = 0;
const say = (s) => console.log(s);

for (const v of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    hasTouch: v.touch, isMobile: v.touch,
    reducedMotion: RM ? 'reduce' : 'no-preference',
  });
  for (const p of PAGES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e).split('\n')[0]));
    page.on('console', (m) => { if (m.type() === 'error' && !/ERR_NO_BUFFER_SPACE|ERR_INSUFFICIENT_RESOURCES|ERR_NETWORK_CHANGED|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 160)); });
    const url = `${BASE}/${p}`;
    try {
      await page.goto(url, { waitUntil: 'load', timeout: NAV });
    } catch (e) {
      report.push({ vp: v.name, page: p, status: 'fail', why: ['load: ' + String(e.message || e).slice(0, 120)] });
      fails++; say(`FAIL ${v.name} ${p} load`); await page.close(); continue;
    }
    await page.evaluate(KIT);
    const n = await page.evaluate(() => window.__vm.count());
    if (!n) { say(`  ${v.name} ${p}: no scenes`); if (errs.length) { fails++; report.push({ vp: v.name, page: p, status: 'fail', why: errs.slice(0, 3) }); say(`FAIL ${v.name} ${p} errors ${errs[0]}`); } await page.close(); continue; }
    if (/(^|\/)index\.html$/.test(p)) await page.waitForTimeout(4500);   // the homepage's intro
    else await page.waitForTimeout(600);
    const names = await page.evaluate(() => window.__vm.list());
    // one look at host i from where place() put it: the three checks, and the warnings
    async function look(i, pl, which) {
      const scene = names[i];
      const row = { vp: v.name, page: p, i, scene, at: pl.how + (pl.at != null ? '@' + pl.at : '') + (which === 'end' ? ' end' : '') };
      const m = await page.evaluate(([i, rm]) => window.__vm.measure(i, rm), [i, RM]);
      Object.assign(row, m);
      const why = [];
      if (!m.built) why.push('not built');
      else {
        if (!RM && (m.clock === null ? m.mut < 1 : m.clock < 0.2)) why.push(`does not tick (clock +${m.clock} s, ${m.mut} changes in ${m.ms} ms)`);
        if (RM && (m.mut > 2 || m.clock > 0)) why.push(`ticks under reduced motion (clock +${m.clock} s, ${m.mut} changes)`);
        if (Math.max(...m.stageOut) > 2) why.push(`stage outside its host by ${m.stageOut.join('/')} px (l/t/r/b), scale ${m.scale}`);
        if (!m.tag) why.push('no 动态示意 / 演示数据 tag');
        else if (m.tag.op < 0.3 || !m.tag.inHost || m.tag.cut || (m.fit === 'viewport' && !m.tag.inScreen)) {
          if (await page.evaluate((i) => window.__vm.twinTag(i), i)) row.tagViaTwin = true;
          else why.push(`tag not visible (${JSON.stringify(m.tag)})`);
        }
        if (!m.label && !m.hidden) why.push('host has no aria-label');
      }
      const warn = [];
      if (m.nSmall) warn.push(`${m.nSmall} text(s) under 12px: ${m.small.join(', ')}`);
      if (m.nCut) warn.push(`${m.nCut} text(s) cut: ${m.cut.join(', ')}`);
      if (m.tag && m.tag.px < 11.95) warn.push(`tag ${m.tag.px}px`);
      if (!RM && m.built && m.mut < 1) warn.push(`picture static for ${m.ms} ms`);
      row.status = why.length ? 'fail' : 'ok'; row.why = why; row.warn = warn;
      return row;
    }
    function log(row) {
      say(`  ${row.status === 'ok' ? 'ok  ' : 'FAIL'} ${v.name} ${p} #${row.i} ${row.scene} [${row.at}] scale ${row.scale} min ${row.minPx}px clock +${row.clock} mut ${row.mut}${row.why.length ? ' :: ' + row.why.join('; ') : ''}${row.warn.length ? ' (warn: ' + row.warn.join('; ') + ')' : ''}`);
    }
    for (let i = 0; i < n; i++) {
      if (ONLY && !ONLY.has(names[i])) continue;
      let midHow = '';
      for (const which of ['mid', 'end']) {
        if (which === 'end' && midHow !== 'pinned') break;   // the second look, at the end of the stretch, is for pinned hosts only
        let pl = await page.evaluate(([i, w]) => window.__vm.place(i, w), [i, which]);
        if (which === 'mid') midHow = pl.how;
        if (pl.how === 'none' || pl.how === 'gone') { const row = { vp: v.name, page: p, i, scene: names[i], status: 'skip', why: [pl.why || pl.how] }; report.push(row); say(`  skip ${v.name} ${p} #${i} ${names[i]}: ${row.why[0]}`); break; }
        let row = await look(i, pl, which);
        // a host in a pinned section may have been caught mid-zoom where it is first reached: judge it where the section settles
        if (row.status === 'fail' && pl.how !== 'pinned' && row.built && await page.evaluate((i) => window.__vm.pinned(i), i)) {
          const pl2 = await page.evaluate((i) => window.__vm.place(i, 'pin'), i);
          if (pl2.how === 'pinned') {
            const row2 = await look(i, pl2, 'mid');
            if (row2.status === 'ok') { row2.warn.push(`where first reached (${row.at}, mid-zoom): ${row.why.join('; ')}`); row = row2; }
          }
        }
        if (row.status === 'fail') {
          fails++;
          mkdirSync(`${OUT}/shots`, { recursive: true });
          row.shot = `${OUT}/shots/${v.name}${RM ? '-rm' : ''}-${p.replace(/\//g, '_').replace(/\.html$/, '')}-${i}-${row.scene}${which === 'end' ? '-end' : ''}.jpg`;
          await page.screenshot({ path: row.shot, type: 'jpeg', quality: 60 });
        }
        report.push(row);
        log(row);
      }
    }
    if (errs.length) { fails++; report.push({ vp: v.name, page: p, status: 'fail', why: errs.slice(0, 3) }); say(`FAIL ${v.name} ${p} errors: ${errs.slice(0, 3).join(' | ')}`); }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
const file = `${OUT}/report-${VIEWPORTS.map((v) => v.name).join('_')}${RM ? '-rm' : ''}.json`;
writeFileSync(file, JSON.stringify(report, null, 1));
const c = (s) => report.filter((r) => r.status === s).length;
say(`\nmotion: ${c('ok')} ok, ${c('fail')} failed, ${c('skip')} skipped; ${report.filter((r) => r.warn && r.warn.length).length} with warnings. Report: ${file}`);
process.exit(fails ? 1 : 0);
