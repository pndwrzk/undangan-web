// Service Worker for advanced image caching
const CACHE_NAME = 'wedding-images-v1';
const IMAGE_CACHE_NAME = 'wedding-images-cache-v1';

// Images to cache immediately
const CRITICAL_IMAGES = [
  '/images/foto_prewad.jpeg',
  '/images/foto_box.jpeg',
  '/images/foto_kecil.jpeg',
  '/hero.jpg',
  '/images/parallex_bg.jpeg',
];

// Install event - cache critical images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(IMAGE_CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_IMAGES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== IMAGE_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle image requests
  if (
    request.destination === 'image' ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(IMAGE_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        });
      })
    );
  }
});
