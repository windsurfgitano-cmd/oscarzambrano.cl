// Verificación local y capturas de una página estática. No genera imágenes por IA.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.OSCAR_PLAYWRIGHT_PATH || 'playwright');
const root=path.join(__dirname,'public');
const qa=path.join(__dirname,'qa');
fs.mkdirSync(qa,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(filename,(error,bytes)=>{
    if(error){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream'});res.end(bytes);
  });
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;
  let browser;
  try{
    browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
    const errors=[];const snapshots=[];
    for(const [label,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small-mobile',320,740]]){
      const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
      await page.goto(base,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const check=await page.evaluate(()=>({
        title:document.title,
        width:innerWidth,
        overflow:document.documentElement.scrollWidth>innerWidth,
        images:[...document.images].map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.getAttribute('src')})),
        instagram:document.querySelector('.instagram-link').getAttribute('href'),
        heading:document.querySelector('h1').innerText,
        loadedFonts:document.fonts.check('16px Anton')&&document.fonts.check('16px Inter')
      }));
      if(check.overflow||!check.loadedFonts||check.images.some(i=>!i.loaded))errors.push(label+' has layout or asset failure');
      if(check.instagram!=='https://www.instagram.com/oscarzambrano.cl/')errors.push('Instagram URL incorrect');
      await page.keyboard.press('Tab');
      const focused=await page.evaluate(()=>document.activeElement.className);
      if(focused!=='skip-link')errors.push(label+' skip navigation not focusable');
      await page.mouse.click(2,2);
      await page.screenshot({path:path.join(qa,label+'.png'),fullPage:true});
      snapshots.push({label,...check});
      await page.close();
    }
    // Portada social: composición nativa de texto, firma y recurso ya existente.
    const share=await browser.newPage({viewport:{width:1200,height:630},reducedMotion:'reduce'});
    await share.goto(base,{waitUntil:'networkidle'});
    await share.setContent(`<!doctype html><html lang="es"><head><link rel="stylesheet" href="${base}/styles.css"><style>
      html,body{width:1200px;height:630px;overflow:hidden;background:#07050d}main{height:630px;position:relative;padding:58px 64px;color:white}
      .signature{width:340px;height:75px;position:relative;z-index:3}.copy{position:relative;z-index:3;width:670px}
      h1{font:400 104px/1.12 Anton;text-transform:uppercase;letter-spacing:-3px;margin:70px 0 24px}
      p{font:400 22px/1.5 Inter;color:#c9c1df}img{position:absolute;right:0;top:0;width:460px;height:630px;object-fit:cover;object-position:50% 14%;mask-image:linear-gradient(to right,transparent,#000 18%)}
    </style></head><body><main><svg class="signature" viewBox="230 1150 272 60"><image href="${base}/assets/firma-referencia.png" width="752" height="1344"/></svg><div class="copy"><h1>En<br>construcción.</h1><p>IA práctica. Herramientas que puedes usar.</p></div><img src="${base}/assets/oscar-chibi.png" alt=""></main></body></html>`,{waitUntil:'networkidle'});
    await share.evaluate(()=>document.fonts.ready);
    await share.screenshot({path:path.join(root,'assets','compartir.png')});
    await share.close();
    for(const resource of ['/favicon.svg','/robots.txt','/sitemap.xml','/assets/oscar-chibi.png','/assets/firma-referencia.png','/assets/compartir.png','/assets/licencias/Anton-OFL.txt','/assets/licencias/Inter-OFL.txt']){
      const response=await fetch(base+resource);if(response.status!==200)errors.push(resource+' '+response.status);
    }
    fs.writeFileSync(path.join(qa,'resultados.json'),JSON.stringify({snapshots,errors},null,2));
    console.log(JSON.stringify({screens:snapshots.map(s=>s.label),errors,shareImage:'1200x630'},null,2));
    if(errors.length)process.exitCode=1;
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close();});
