const CACHE='portal-v13';
const SHELL=['./','./index.html','./projetos.json','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./bg-parede.jpg','./bg-parede-mini.jpg','./bg-noite.jpg','./bg-noite-mini.jpg','./bg-entardecer.jpg','./bg-entardecer-mini.jpg','./bg-ondas.jpg','./bg-ondas-mini.jpg'];
self.addEventListener('install',event=>{
self.skipWaiting();
event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(SHELL.map(url=>fetch(new Request(url,{cache:'reload'})).then(r=>r.ok?cache.put(url,r):null).catch(()=>null)))))
});
self.addEventListener('activate',event=>{
event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))
});
self.addEventListener('fetch',event=>{
const request=event.request;
if(request.method!=='GET')return;
const url=new URL(request.url);
if(url.origin!==self.location.origin)return;
event.respondWith(
fetch(new Request(request.url,{cache:'no-store',credentials:'same-origin'}))
.then(response=>{
if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}
return response
})
.catch(()=>caches.match(request).then(hit=>hit||(request.mode==='navigate'?caches.match('./index.html'):Response.error())))
)
});
