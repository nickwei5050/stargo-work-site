import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { SITE, req } from './paths.mjs';
import { CAP_REAL } from './replaceables.mjs';
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
  /* The homepage theatre: the brand film in the centre and six code-drawn desktop windows round it
     (tools/code-art-theatre.mjs), not the photographs W01–W06 they replaced — a merge that brings a still back fails here. */
  for(const file of ['index.html','en/index.html']) {
    const doc = await p.evaluate(h => { const d = new DOMParser().parseFromString(h,'text/html'); const g = d.querySelector('.video-grid'); return { hosts: g ? [...g.querySelectorAll('[data-sg-scene^="desk-"]')].map(e => e.dataset.sgScene) : [], film: !!(g && g.querySelector('video[data-stargo-video]')), stills: g ? g.querySelectorAll('img').length : -1 }; }, readFileSync(file,'utf8'));
    const errors = [];
    if (doc.hosts.length !== 6 || new Set(doc.hosts).size !== 6) errors.push('theatre windows: '+doc.hosts.join(','));
    if (!doc.film) errors.push('theatre film missing');
    if (doc.stills !== 0) errors.push('theatre stills: '+doc.stills);
    if (/stargo-photo\/w0[1-6]-/.test(readFileSync(file,'utf8'))) errors.push('a W01–W06 photograph is referenced');
    results.push({ name:file+' theatre',pass:errors.length===0,errors }); console.log(errors.length?'FAIL':'PASS',file+' theatre',errors.join('; '));
  }
  /* The capability page's real screens (2026-10-24). The owner, 17:27 UTC: 「你现在也全是代码了，我系统的画面都没有了！
     我需要真实系统截图放在特定的地方」. Since then the four area cards, the Sales Desk rows 1 and 3, the quote band, the
     图片 / 视频 portrait and the first AI-team card show crops of the system's own screens (tools/replaceables.mjs
     CAP_REAL, tools/real-capabilities.mjs), each where its scene was, in that order, with the 真实界面 · 演示数据 tag
     and an alt that says what the screen shows, then the demo-data caption once. The scenes they replaced
     (areaGrowth … areaTeam, inbox, account, quote, creative, crewRoles) must not come back beside them, nor
     their scripts; the Growth OS rows, the 每项工作 ring, crewBoard and the team card stay drawn in code. A merge
     that drops a slot or brings a scene back fails here. */
  const capIds = [...CAP_REAL.areas.map(a=>a.id), CAP_REAL.inbox.id, CAP_REAL.account.id, CAP_REAL.quote.id, CAP_REAL.creative.id, CAP_REAL.crew.id];
  for(const file of ['capabilities.html','en/capabilities.html']) {
    const html = readFileSync(file,'utf8');
    const doc = await p.evaluate(h => { const d = new DOMParser().parseFromString(h,'text/html'); return {
      slots: [...d.querySelectorAll('[data-real]')].map(s => { const img = s.querySelector('picture > img.sg-real-img'); return { id: s.dataset.real, tag: (s.querySelector('.sg-real-tag')?.textContent||'').trim(), alt: img?.getAttribute('alt')||'', src: img?.getAttribute('src')||'', w: +(img?.getAttribute('width')||0), h: +(img?.getAttribute('height')||0), srcset: !!img?.getAttribute('srcset'), sources: [...s.querySelectorAll('picture > source')].map(x => (x.getAttribute('srcset')||'').split(/[\s,]+/)[0]), inScene: !!s.closest('[data-sg-scene]') }; }),
      scenes: [...d.querySelectorAll('[data-sg-scene]')].map(e => e.dataset.sgScene) }; }, html);
    const errors = [];
    if (doc.slots.map(s=>s.id).join() !== capIds.join()) errors.push('real slots: '+doc.slots.map(s=>s.id).join(','));
    for (const s of doc.slots) {
      if (!/^(真实界面 · 演示数据|Real screen · demo data)$/.test(s.tag)) errors.push(s.id+' tag: '+s.tag);
      const cap = file.startsWith('en/') ? ' — product screenshot · demo data' : '。真实界面截图（演示数据）';   // the editorial pass adds it
      const said = s.alt.endsWith(cap) ? s.alt.slice(0, -cap.length) : null;
      if (said === null || said.length < 8 || /演示数据|demo data/i.test(said)) errors.push(s.id+' alt: '+s.alt);
      if (!s.w || !s.h || !s.srcset) errors.push(s.id+' img lacks width/height/srcset');
      for (const u of [s.src, ...s.sources]) if (!u || !existsSync(u.replace(/^(\.\.\/)+/,'').split('?')[0])) errors.push(s.id+' missing file: '+u);
      if (s.inScene) errors.push(s.id+' sits inside a scene host');
    }
    const back = doc.scenes.filter(n => /^(area(Growth|Context|Deal|Team)|inbox|account|quote|creative|crewRoles)$/.test(n));
    if (back.length) errors.push('replaced scenes back: '+back.join(','));
    for (const keep of ['lanes','crewBoard','team']) if (!doc.scenes.includes(keep)) errors.push('kept scene missing: '+keep);
    for (const gone of ['stargo-motion-areas','stargo-motion-sales','stargo-motion-quote','stargo-motion-creative']) if (html.includes(gone+'.js') || html.includes(gone+'.css')) errors.push('replaced scenes still load '+gone);
    if (!html.includes('css/stargo-real-capabilities.css')) errors.push('css/stargo-real-capabilities.css not linked');
    results.push({ name:file+' real screens',pass:errors.length===0,errors }); console.log(errors.length?'FAIL':'PASS',file+' real screens',errors.join('; '));
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
