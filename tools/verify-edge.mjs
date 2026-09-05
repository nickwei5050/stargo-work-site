/** Installed Edge smoke check; not a substitute for Safari/Firefox testing. */
import assert from 'node:assert/strict';import{createRequire}from'node:module';import{writeFileSync,mkdirSync}from'node:fs';
const{chromium}=createRequire('F:/stargo 网站/stargo-work-website/package.json')('@playwright/test');
const b=await chromium.launch({channel:'msedge'});const results=[];
try{for(const lang of['','en/'])for(const width of[390,1440]){
 const p=await b.newPage({viewport:{width,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const name of['index','intelligence','workforce','pricing','contact']){
  const id=`${lang}${name} ${width}`;
  try{await p.goto('http://127.0.0.1:4200/'+lang+name+'.html',{waitUntil:'load'});await p.waitForTimeout(name==='index'?5500:1200);
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(width===390){const menu=p.locator('.menu-button');await menu.click();await p.waitForTimeout(550);assert.equal(await menu.getAttribute('aria-expanded'),'true');await p.keyboard.press('Escape');await p.waitForTimeout(500);assert.equal(await menu.getAttribute('aria-expanded'),'false');}
   if(name==='pricing'){await p.locator('.w-tab-link').first().focus();await p.keyboard.press('End');await p.waitForTimeout(650);assert.equal(await p.locator('.w-tab-link').nth(1).getAttribute('aria-selected'),'true');}
   if(name==='contact'){await p.locator('#email-form').evaluate(e=>e.requestSubmit());assert(await p.locator('#email-form .stargo-form-note').isVisible());}
   assert.deepEqual(errors,[]);results.push({id,pass:true});console.log('PASS Edge',id);
  }catch(e){results.push({id,pass:false,error:e.message});console.log('FAIL Edge',id,e.message);}
 }await p.close();
}}finally{await b.close();}
const out='.wrangler/fix-qa-20260905';mkdirSync(out,{recursive:true});writeFileSync(out+'/edge-results.json',JSON.stringify(results,null,2));process.exitCode=results.some(r=>!r.pass)?1:0;
