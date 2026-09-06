/** Local Cloudflare emulator: routes, headers and truthful unconfigured form.
 * No RESEND_API_KEY is supplied; this must never send email. */
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {SITE_PAGES} from './chrome.mjs';
const base=process.env.WORKER_URL||'http://127.0.0.1:4201';const results=[];
async function check(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS',name);}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL',name,e.message);}}
for(const path of SITE_PAGES.flatMap(p=>{const c=p==='index.html'?'':p.replace(/\.html$/,'');return ['/'+c,'/en/'+c];}))await check(path,async()=>{const r=await fetch(base+path);assert.equal(r.status,200);assert.equal(r.headers.get('x-content-type-options'),'nosniff');assert((await r.text()).includes('STARGO'));});
await check('clean URL redirect',async()=>{const r=await fetch(base+'/pricing.html',{redirect:'manual'});assert([301,308].includes(r.status));assert.match(r.headers.get('location'),/\/pricing$/);});
await check('real 404 status',async()=>assert.equal((await fetch(base+'/qa-page-that-does-not-exist')).status,404));
await check('sitemap and robots',async()=>{const r=await fetch(base+'/sitemap.xml');assert.equal(r.status,200);const s=await r.text();assert.equal([...s.matchAll(/<loc>/g)].length,SITE_PAGES.length*2);assert((await(await fetch(base+'/robots.txt')).text()).includes('Disallow: /api/'));});
const valid={form:'contact',lang:'en',fields:[{key:'name',label:'Name',value:'QA not delivered'},{key:'email',label:'Email',value:'qa@example.invalid'}]};
const post=d=>fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':'5077b1a8-10cd-4c52-a2d2-81b3f9ec9055'},body:JSON.stringify(d)});
await check('invalid JSON shape returns controlled 400',async()=>assert.equal((await post(null)).status,400));
await check('valid form without credentials returns 503, not success',async()=>{const r=await post(valid);assert.equal(r.status,503);assert.equal(r.headers.get('cache-control'),'no-store');assert.deepEqual(await r.json(),{ok:false,error:'not-configured'});});
await check('GET endpoint refuses submission',async()=>assert.equal((await fetch(base+'/api/contact')).status,405));
const out='.wrangler/fix-qa-20260905';mkdirSync(out,{recursive:true});writeFileSync(out+'/worker-results.json',JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
