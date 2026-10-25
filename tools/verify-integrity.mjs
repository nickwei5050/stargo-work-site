import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { SITE, req } from './paths.mjs';
import { HERO } from './replaceables.mjs';
const { chromium } = req('@playwright/test');
/* Repo-relative paths below; run from anywhere. */
process.chdir(SITE);
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4200';
const files = [...readdirSync('.').filter(f=>f.endsWith('.html')), ...readdirSync('en').filter(f=>f.endsWith('.html')).map(f=>'en/'+f), ...readdirSync('blog').map(f=>'blog/'+f), ...readdirSync('en/blog').map(f=>'en/blog/'+f)];
const browser = await chromium.launch(); const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const results = []; const OUT = '.wrangler/fix-qa-20260905'; mkdirSync(OUT, { recursive: true });
try {
  const checks = await p.evaluate(sources => {
    const docs = Object.fromEntries(sources.map(([f,h])=>[f,new DOMParser().parseFromString(h,'text/html')]));
    return Object.entries(docs).map(([file,doc])=> {
      const errors = [], ids = new Set();
      doc.querySelectorAll('[id]').forEach(e=>{ if(ids.has(e.id)) errors.push('duplicate id: '+e.id); ids.add(e.id); });
      for(const a of doc.querySelectorAll('a[href]')) {
        const raw = a.getAttribute('href'); const url = new URL(raw,'http://site.test/'+file);
        if(url.origin !== 'http://site.test') continue;
        const path = url.pathname.slice(1); /* clean URLs (/pricing, /en/) map to their files, as the server does */
        const targetFile = path === '' || path.endsWith('/') ? path+'index.html' : /\.html$/.test(path) ? path : path+'.html'; const target = docs[targetFile];
        if(!target) { errors.push('missing page: '+raw); continue; }
        if(raw.endsWith('#')) errors.push('placeholder: '+raw);
        if(url.hash && !target.getElementById(decodeURIComponent(url.hash.slice(1)))) errors.push('missing anchor: '+raw);
        if(a.target==='_blank') errors.push('internal new tab: '+raw);
      }
      return {file,errors};
    });
  }, files.map(f=>[f,readFileSync(f,'utf8')]));
  for(const c of checks) { results.push({ name:c.file,pass:c.errors.length===0,errors:c.errors }); console.log(c.errors.length?'FAIL':'PASS',c.file,[...new Set(c.errors)].join('; ')); }
  /* The homepage theatre: the brand film in the centre and, round it, six slots with the system's own
     screens (tools/real-theatre.mjs; tools/replaceables.mjs HERO.real records which crop each cell
     shows, in the ring's DOM order). Not the photographs W01–W06 of 2026-10-23 and earlier, and not
     the code-drawn desk windows (js/stargo-motion-desk.js) that stood in for the screens until the
     owner asked for real captures on 2026-10-24 — a merge that brings either back fails here. Each
     slot's <img> carries the alt (the slot itself is not role="img"), and the grid holds no other image. */
  const theatreIds = HERO.real.filter(Boolean).map(c => c.id);
  for(const file of ['index.html','en/index.html']) {
    const html = readFileSync(file,'utf8');
    const doc = await p.evaluate(h => { const d = new DOMParser().parseFromString(h,'text/html'); const g = d.querySelector('.video-grid'); if (!g) return null;
      const slots = [...g.querySelectorAll('.sg-real')];
      return { slots: slots.map(s => s.dataset.real || ''), roleImg: slots.filter(s => s.hasAttribute('role') || s.hasAttribute('aria-label')).length,
        alts: slots.map(s => { const i = s.querySelectorAll('img'); return i.length === 1 && i[0].classList.contains('sg-real-img') ? (i[0].getAttribute('alt') || '').trim() : ''; }),
        tags: slots.filter(s => s.querySelector('.sg-real-tag')).length,
        hosts: g.querySelectorAll('[data-sg-scene]').length, film: !!g.querySelector('video[data-stargo-video]'),
        stills: g.querySelectorAll('img:not(.sg-real-img), img.stargo-still').length }; }, html);
    const errors = [];
    if (!doc) errors.push('theatre grid missing');
    else {
      if (doc.slots.join() !== theatreIds.join()) errors.push('theatre slots: '+doc.slots.join(',')+' (HERO.real: '+theatreIds.join(',')+')');
      if (doc.roleImg) errors.push(doc.roleImg+' theatre slot(s) carry role/aria-label; the <img> carries the alt');
      if (doc.alts.some(a => !a)) errors.push('theatre slot without exactly one alt-bearing .sg-real-img');
      if (doc.tags !== 6) errors.push('theatre slots with a 真实界面 tag: '+doc.tags);
      if (doc.hosts !== 0) errors.push('theatre motion hosts: '+doc.hosts);
      if (!doc.film) errors.push('theatre film missing');
      if (doc.stills !== 0) errors.push('theatre stills: '+doc.stills);
    }
    if (/stargo-photo\/w0[1-6]-/.test(html)) errors.push('a W01–W06 photograph is referenced');
    if (/stargo-motion-desk\.(js|css)/.test(html)) errors.push('the desk scenes (stargo-motion-desk) are loaded');
    results.push({ name:file+' theatre',pass:errors.length===0,errors }); console.log(errors.length?'FAIL':'PASS',file+' theatre',errors.join('; '));
  }
  { // nor does any other page load the desk scenes: they were the theatre's alone
    const desk = files.filter(f => /stargo-motion-desk\.(js|css)/.test(readFileSync(f,'utf8')));
    results.push({ name:'desk scenes unplaced',pass:desk.length===0,errors:desk }); console.log(desk.length?'FAIL':'PASS','desk scenes unplaced',desk.join(', '));
  }
  for(const lang of ['', 'en/']) {
    await p.goto(BASE+'/'+lang+'pricing.html',{waitUntil:'load'}); await p.waitForTimeout(1800);
    await p.addScriptTag({path:req.resolve('axe-core/axe.min.js')});
    const audit = await p.evaluate(async()=>{ const a=await axe.run(document,{runOnly:{type:'rule',values:['aria-prohibited-attr','aria-required-parent','aria-valid-attr-value','link-name','color-contrast']}}); return { violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})), incomplete:a.incomplete.map(v=>({id:v.id,count:v.nodes.length})) }; });
    writeFileSync(`${OUT}/${lang?'en':'zh'}-pricing-axe.json`,JSON.stringify(audit,null,2));
    results.push({name:lang+'pricing accessibility',pass:audit.violations.length===0,errors:audit.violations}); console.log(audit.violations.length?'FAIL':'PASS',lang+'pricing accessibility',audit.violations.map(v=>v.id));
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/integrity-results.json`,JSON.stringify(results,null,2));
process.exitCode=results.some(r=>!r.pass)?1:0;
