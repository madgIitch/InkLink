/* global self, caches, fetch */
const CACHE_NAME = "inklink-shell-v1";
const PRECACHE = [
"/",
"/favicon.ico",
"/manifest.webmanifest",
"/icons/icon-192.png",
"/icons/icon-256.png",
"/icons/icon-384.png",
"/icons/icon-512.png"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open("inklink-shell-v1");
      // Añade de una en una ignorando fallos
      await Promise.allSettled(
        [
          "/",
          "/favicon.ico",
          "/manifest.webmanifest",
          "/icons/icon-192.png",
          "/icons/icon-256.png",
          "/icons/icon-384.png",
          "/icons/icon-512.png"
        ].map(async (url) => {
          try {
            await cache.add(url);
          } catch (e) {
            // Evita que un 404 tumbe toda la instalación
            console.warn("[SW] No se pudo precachear:", url, e);
          }
        })
      );
      self.skipWaiting();
    })()
  );
});



self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
)
);
self.clients.claim();
});


// Estrategia:
// - Navegaciones (document) → Network-first con fallback a cache (app shell)
// - Estáticos (script/style/font/image) → Stale-while-revalidate
self.addEventListener("fetch", (event) => {
const req = event.request;
const url = new URL(req.url);


// Sólo manejar GET
if (req.method !== "GET") return;


// 1) Navegaciones (App Shell)
if (req.mode === "navigate") {
event.respondWith(
fetch(req)
.then((res) => {
const resClone = res.clone();
caches.open(CACHE_NAME).then((c) => c.put("/", resClone));
return res;
})
.catch(() => caches.match("/"))
);
return;
}


// 2) Estáticos — Stale-While-Revalidate
if (["script", "style", "image", "font"].includes(req.destination)) {
event.respondWith(
caches.match(req).then((cached) => {
const networkFetch = fetch(req)
.then((res) => {
const resClone = res.clone();
caches.open(CACHE_NAME).then((c) => c.put(req, resClone));
return res;
})
.catch(() => cached); // si offline, devolvemos cache si existe
return cached || networkFetch;
})
);
return;
}


// 3) Por defecto, intentar red
event.respondWith(
fetch(req).catch(() => caches.match(req))
);
});