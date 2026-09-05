import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire('F:/stargo 网站/stargo-work-website/package.json');
const { chromium } = require('@playwright/test');
const files = [...readdirSync('.').filter(f=>f.endsWith('.html')), ...readdirSync('en').filter(f=>f.endsWith('.html')).map(f=>'en/'+f)];
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
        const targetFile = url.pathname.slice(1) || 'index.html'; const target = docs[targetFile];
        if(!target) { errors.push('missing page: '+raw); continue; }
        if(raw.endsWith('#')) errors.push('placeholder: '+raw);
        if(url.hash && !target.getElementById(decodeURIComponent(url.hash.slice(1)))) errors.push('missing anchor: '+raw);
        if(a.target==='_blank') errors.push('internal new tab: '+raw);
      }
      return {file,errors};
    });
  }, files.map(f=>[f,readFileSync(f,'utf8')]));
  for(const c of checks) { results.push({ name:c.file,pass:c.errors.length===0,errors:c.errors }); console.log(c.errors.length?'FAIL':'PASS',c.file,[...new Set(c.errors)].join('; ')); }
  for(const lang of ['', 'en/']) {
    await p.goto('http://127.0.0.1:4200/'+lang+'pricing.html',{waitUntil:'load'}); await p.waitForTimeout(1800);
    await p.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const audit = await p.evaluate(async()=>{ const a=await axe.run(document,{runOnly:{type:'rule',values:['aria-prohibited-attr','aria-required-parent','aria-valid-attr-value','link-name','color-contrast']}}); return { violations:a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})), incomplete:a.incomplete.map(v=>({id:v.id,count:v.nodes.length})) }; });
    writeFileSync(`${OUT}/${lang?'en':'zh'}-pricing-axe.json`,JSON.stringify(audit,null,2));
    results.push({name:lang+'pricing accessibility',pass:audit.violations.length===0,errors:audit.violations}); console.log(audit.violations.length?'FAIL':'PASS',lang+'pricing accessibility',audit.violations.map(v=>v.id));
  }
} finally { await browser.close(); }
writeFileSync(`${OUT}/integrity-results.json`,JSON.stringify(results,null,2));
process.exitCode=results.some(r=>!r.pass)?1:0;
