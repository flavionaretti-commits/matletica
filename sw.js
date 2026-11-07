const CACHE='matletica-v1.5.1-identity';
const ASSETS=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest','./manifest.webmanifest?v=identity-2',
  './icons/icon-192.png','./icons/icon-512.png',
  './assets/solly/normal.png','./assets/solly/sorpreso.png','./assets/solly/arrabbiato.png','./assets/solly/vittoria.png','./assets/solly/triste.png',
  './assets/gabby/normal.png','./assets/gabby/sorpresa.png','./assets/gabby/arrabbiata.png','./assets/gabby/congelata.png','./assets/gabby/triste.png'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('matletica-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); const root=new URL('./',self.location).pathname;
  if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(root)) return;
  if(u.pathname.endsWith('/manifest.webmanifest')) { e.respondWith(fetch(e.request,{cache:'no-store'})); return; }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match('./index.html'))));
});
