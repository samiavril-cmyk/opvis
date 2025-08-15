const CACHE = 'op-viz-cache-v1'
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
]
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    await cache.addAll(ASSETS)
    self.skipWaiting()
  })())
})
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    try {
      const res = await fetch(e.request)
      const cache = await caches.open(CACHE)
      cache.put(e.request, res.clone())
      return res
    } catch {
      const cache = await caches.open(CACHE)
      const res = await cache.match(e.request)
      if (res) return res
      throw new Error('Network error')
    }
  })())
})
