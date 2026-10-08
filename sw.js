const CACHE_NAME = 'pepsi-vip-v2';
const urlsToCache = [
  'home.html',
  'yf-life fund.html',
  'profit.html',
  'me.html',
  'invite.html',
  'device.html',
  'recharge.html',
  'withdraw.html',
  'config.js',
  'toast.js',
  'manifest.json',
  'wrec.html',
  'rerec.html',
  'accounting.html',
  'bankcard.html',
  
];

// Install stage: cache all core files instantly
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate stage: clean up old obsolete caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch stage: Stale-While-Revalidate for 0-delay instant page loads
self.addEventListener('fetch', event => {
  // Skip cross-origin requests or API calls from being cached by the service worker
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle dynamic navigation/HTML requests with instant cache response + background update
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network fallback ignored if offline
      });

      // Return cached version immediately if available, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});