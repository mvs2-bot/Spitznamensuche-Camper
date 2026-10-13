/* Namenssuche für den Camper-Bus – Service Worker */
const P="campernamen-",V=P+"v1";
const CORE=['./','index.html','manifest.json','icon.svg'];
const EXTRA=["https://cdn.tailwindcss.com","https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap","IMG_20261004_192113.jpg"];
const RULES=[["fonts.googleapis.com|fonts.gstatic.com|cdn.tailwindcss.com","cf"],["script.google.com|script.googleusercontent.com","nf"]];
const TILEX="^$";
const LIMIT=1;
const TILE=new RegExp(TILEX);
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
async function trim(c){const k=(await c.keys()).filter(q=>TILE.test(new URL(q.url).host));for(let i=0;i<k.length-LIMIT;i++)await c.delete(k[i]);}
async function handle(r,s){
  const c=await caches.open(V);
  const nav=r.mode==='navigate';
  const hit=await c.match(r,{ignoreSearch:nav});
  const net=()=>fetch(r).then(async res=>{if(res.ok||res.type==='opaque'){await c.put(r,res.clone());if(s==='tile')trim(c);}return res;});
  if(s==='cf')return hit||net();
  if(s==='nf'){
    try{return await Promise.race([net(),new Promise((_,j)=>setTimeout(j,4000))]);}
    catch(_){return hit||(nav?await c.match('index.html'):null)||Response.error();}
  }
  if(hit){net().catch(()=>{});return hit;}
  return net();
}
