import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { onRequestPost } from '../functions/api/contact.js';
const require=createRequire('F:/stargo 网站/stargo-work-website/package.json');
const {chromium}=require('@playwright/test'); const browser=await chromium.launch();
const results=[]; const OUT='.wrangler/fix-qa-20260905';mkdirSync(OUT,{recursive:true});
async function check(name,fn){try{await fn();console.log('PASS',name);results.push({name,pass:true});}catch(e){console.log('FAIL',name,e.message);results.push({name,pass:false,error:e.message});}}
try {
 for(const lang of ['', 'en/']) for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:900}});p.setDefaultTimeout(10000);
  await p.goto('http://127.0.0.1:4200/'+lang+'index.html',{waitUntil:'load'});await p.waitForTimeout(5500);
  await check(`${lang}home ${width} FAQ keyboard`,async()=>{
   const buttons=p.locator('.toggle-header');assert.equal(await buttons.count(),4);
   for(let i=0;i<4;i++){
    const button=buttons.nth(i);await button.scrollIntoViewIfNeeded();await button.focus();await p.keyboard.press('Enter');await p.waitForTimeout(650);
    assert.equal(await button.getAttribute('aria-expanded'),'true');
    const id=await button.getAttribute('aria-controls');assert((await p.locator('#'+id).boundingBox()).height>20);
    await p.keyboard.press('Space');await p.waitForTimeout(650);assert.equal(await button.getAttribute('aria-expanded'),'false');
   }
  });
  await p.goto('http://127.0.0.1:4200/'+lang+'pricing.html',{waitUntil:'load'});await p.waitForTimeout(1200);
  await check(`${lang}pricing ${width} ten FAQs`,async()=>{
   const qs=p.locator('.faq-question-block');assert.equal(await qs.count(),10);
   for(let i=0;i<10;i++){const q=qs.nth(i);await q.scrollIntoViewIfNeeded();await q.focus();await p.keyboard.press('Enter');await p.waitForTimeout(500);assert.equal(await q.getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');await p.waitForTimeout(500);assert.equal(await q.getAttribute('aria-expanded'),'false');}
  });
  if(width===390) await check(`${lang}dark mobile menu open/close/language`,async()=>{
   await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(500);
   const menu=p.locator('.menu-button');await menu.click();await p.waitForTimeout(600);
   assert.equal(await menu.getAttribute('aria-expanded'),'true');
   assert.equal(await menu.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(244, 244, 244)');
   await p.screenshot({path:`${OUT}/${lang?'en':'zh'}-pricing-mobile-menu.png`});
   await p.locator('.nav-menu a[hreflang]').first().click();await p.waitForURL(lang?'**/pricing.html':'**/en/pricing.html');
   assert.equal(await p.locator('html').getAttribute('lang'),lang?'zh-CN':'en');
  });
  await p.close();
 }
 for(const lang of ['', 'en/']){
  const p=await browser.newPage({viewport:{width:390,height:844}});
  // Intelligence keeps the lifelogx homepage and its in-page anchors; workforce moved to
  // the lifelogx feature template, whose hero button books a demo instead.
  await check(`${lang}intelligence anchor lands`,async()=>{
   await p.goto('http://127.0.0.1:4200/'+lang+'intelligence.html');await p.waitForTimeout(1000);
   await p.locator('a[href="#lx-ontology"]').click();await p.waitForTimeout(1800);
   const y=await p.locator('#lx-ontology').evaluate(e=>e.getBoundingClientRect().top);assert(y>=-5&&y<250,`target y=${y}`);
  });
  await check(`${lang}workforce hero cta`,async()=>{
   await p.goto('http://127.0.0.1:4200/'+lang+'workforce.html');await p.waitForTimeout(1200);
   const btn=p.locator('.lx-feature-description-holder a, .lx-hero-features a.lx-button').first();
   assert.equal(await btn.count(),1,'hero button');
   await btn.click();await p.waitForURL(u=>/contact/.test(u.pathname),{timeout:15000});
   assert.equal(await p.locator('form').count()>0,true,'lands on the contact form');
  });
  await check(`${lang}short contact and newsletter relay`,async()=>{
   const original=globalThis.fetch;const mails=[];globalThis.fetch=async(url,opts)=>{mails.push(JSON.parse(opts.body));return Response.json({id:'fixture'});};
   await p.route('**/api/contact',async route=>{const req=route.request();const r=await onRequestPost({request:new Request(req.url(),{method:'POST',headers:req.headers(),body:req.postData()}),env:{RESEND_API_KEY:'fixture'}});await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
   try{
    await p.goto('http://127.0.0.1:4200/'+lang+'enterprise.html');await p.waitForTimeout(1200);
    const f=p.locator('#email-form');await f.locator('[name=Name]').fill('QA not delivered');await f.locator('[type=email]').fill('qa@example.invalid');await f.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);assert.equal(mails.length,1);assert.equal(await f.isVisible(),false);
    const n=p.locator('#Subscribe-Footer');await n.locator('[type=email]').fill('qa@example.invalid');await n.evaluate(e=>e.requestSubmit());await p.waitForTimeout(500);assert.equal(mails.length,2);assert.equal(await n.isVisible(),false);assert.match(mails[1].subject,/Newsletter request/);
   }finally{globalThis.fetch=original;await p.unroute('**/api/contact');}
  });await p.close();
 }
}finally{await browser.close();}
writeFileSync(`${OUT}/interactions-results.json`,JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
