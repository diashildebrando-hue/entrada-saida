// Guarda o app no aparelho para abrir sem internet. Com internet, busca sempre a versão mais nova.
const CACHE = "registro-entrada-saida-v5";
const ARQUIVOS = ["./", "./index.html", "./manifest.webmanifest", "./icone-192.png", "./icone-512.png", "./dados.bin", "./fotos.bin",
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ARQUIVOS.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const pagina = req.mode === "navigate";
  if (pagina) {   // página: tenta a internet primeiro (versão nova); sem internet, a guardada
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put("./index.html", c)); return r; })
      .catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  if (/\.bin(\?|$)/.test(req.url)) {   // lista e fotos: internet primeiro (versão nova); sem internet, a guardada
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then(k => k.put(req.url.split("?")[0], c)); } return r; })
      .catch(() => caches.match(req.url.split("?")[0])));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req).then(resp => {
    if (resp.ok && (req.url.startsWith(self.location.origin) || req.url.includes("cdnjs.cloudflare.com"))) { const c = resp.clone(); caches.open(CACHE).then(k => k.put(req, c)); }
    return resp;
  })));
});
