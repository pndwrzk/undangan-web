// Service Worker for advanced image and audio caching
const CACHE_NAME = 'wedding-assets-v1';
const IMAGE_CACHE_NAME = 'wedding-images-cache-v1';
const AUDIO_CACHE_NAME = 'wedding-audio-cache-v1';

// Images to cache immediately
const CRITICAL_IMAGES = [
  '/images/foto_prewad.jpeg',
  '/images/foto_box.jpeg',
  '/images/foto_kecil.jpeg',
  '/hero.jpg',
  '/images/parallex_bg.jpeg',
];

// Audio files will be cached on first play
const AUDIO_EXTENSIONS = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

// Install event - cache critical images
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_IMAGES);
      }),
      caches.open(AUDIO_CACHE_NAME) // Create audio cache
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => 
            name !== CACHE_NAME && 
            name !== IMAGE_CACHE_NAME && 
            name !== AUDIO_CACHE_NAME
          )
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

  // Handle audio requests with special strategy
  if (
    request.destination === 'audio' ||
    url.pathname.match(AUDIO_EXTENSIONS) ||
    url.pathname.startsWith('/api/music/serve/')
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving audio from cache:', url.pathname);
            return cachedResponse;
          }

          console.log('[SW] Fetching audio from network:', url.pathname);
          return fetch(request).then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the audio file
            cache.put(request, responseToCache).then(() => {
              console.log('[SW] Cached audio:', url.pathname);
            });

            return response;
          }).catch((error) => {
            console.error('[SW] Audio fetch failed:', error);
            throw error;
          });
        });
      })
    );
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
