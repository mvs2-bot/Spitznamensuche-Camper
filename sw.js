/* Namenssuche für den Camper-Bus – Service Worker
   Bei Änderungen an Dateien die Versionsnummer (V) hochzählen. */
const P="campernamen-",V=P+"v9";
const CORE=['./','index.html','shared/ios-nav.js','manifest.json','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','logo.jpg'];
const EXTRA=[];
const RULES=[["script.google.com|script.googleusercontent.com","nf"]];
const NET_TIMEOUT=8000; // Apps Script braucht manchmal etwas länger
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await c.addAll(CORE);await Promise.allSettled(EXTRA.map(u=>c.add(u)));await self.skipWaiting();})());});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(P)&&k!==V)await caches.delete(k);await self.clients.claim();})());});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.protocol!=='https:'&&u.protocol!=='http:')return;
  let s=null;
  if(u.origin===location.origin)s=r.mode==='navigate'?'nf':'swr';
  else{const m=RULES.find(x=>new RegExp(x[0]).test(u.host));s=m?m[1]:null;}
  if(s)e.respondWith(handle(r,s));
});
async function handle(r,s){
  const c=await caches.open(V);
  const nav=r.mode==='navigate';
  const hit=await c.match(r,{ignoreSearch:nav});
  const net=()=>fetch(r).then(async res=>{if(res.ok||res.type==='opaque')await c.put(r,res.clone());return res;});
  if(s==='cf')return hit||net();
  if(s==='nf'){
    try{return await Promise.race([net(),new Promise((_,j)=>setTimeout(j,NET_TIMEOUT))]);}
    catch(_){return hit||(nav?await c.match('index.html'):null)||Response.error();}
  }
  if(hit){net().catch(()=>{});return hit;}
  return net();
}
