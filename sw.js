const CACHE_NAME = 'scrivania-linguistica-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/editors.html',
  '/quadretti-grandi.html',
  '/quadretti-piccoli.html',
  '/righe-grandi.html',
  '/righe-quadretti.html',
  '/righe.html',
  '/tastiere/arabo.html',
  '/tastiere/coreano.html',
  '/tastiere/giapponese.html',
  '/tastiere/hindi.html',
  '/tastiere/russo.html',
  '/tastiere/thai.html',
  '/tastiere/turco.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/sw-register.js'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching App Shell');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate Strategy with Cache Fallback
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;

  // Ignore analytics / external dynamic scripts if necessary, but handle app routes
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and cachedResponse exists, use it
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
