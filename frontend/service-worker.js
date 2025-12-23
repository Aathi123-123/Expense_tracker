/* Service worker stub: implement caching routes as needed. */
const CACHE_NAME = 'save-karo-v1'
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (e) => {
  // Simple network-first strategy for API-less static app
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})
