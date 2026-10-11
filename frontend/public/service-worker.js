// Service Worker for GramHealth Connect (PWA Offline Support)
const CACHE_VERSION = 'gramhealth-v2';
const STATIC_CACHE = `gramhealth-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `gramhealth-dynamic-${CACHE_VERSION}`;

// Core application shell assets to pre-cache
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Sensitive endpoints that must NEVER be cached in the Service Worker
const SENSITIVE_PATTERNS = [
  /\/api\/auth\//i,
  /\/api\/patients\//i,
  /\/api\/users\//i,
  /\/auth\//i
];

function isSensitive(url) {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(url));
}

// Install Event — pre-cache App Shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] App Shell pre-cache warning:', err);
      });
    })
  );
});

// Activate Event — cleanup outdated caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[SW] Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — robust caching with offline resilience & SPA navigation fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POST, PUT, DELETE) - must go to network / IndexedDB draft sync
  if (request.method !== 'GET') {
    return;
  }

  // Never cache sensitive auth / patient endpoints
  if (isSensitive(url.pathname)) {
    return;
  }

  // 1. Navigation requests (HTML pages): Network-first with SPA shell fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedShell = await caches.match('/index.html');
          if (cachedShell) return cachedShell;
          return new Response(
            '<!DOCTYPE html><html><body><h1>GramHealth Connect is Offline</h1><p>The application shell is loading. Please reload once connected.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Static Vite assets, icons, fonts, CSS/JS bundles: Cache-first with background refresh
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
     url.pathname.startsWith('/icons/') ||
     url.pathname.endsWith('.js') ||
     url.pathname.endsWith('.css') ||
     url.pathname.endsWith('.svg') ||
     url.pathname.endsWith('.png') ||
     url.pathname.endsWith('.ico'))
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch update in background (Stale-While-Revalidate)
          fetch(request)
            .then((fresh) => {
              if (fresh && fresh.status === 200) {
                caches.open(STATIC_CACHE).then((c) => c.put(request, fresh));
              }
            })
            .catch(() => {/* ignore background fetch failure */});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. OpenStreetMap tile requests (Leaflet): runtime cache with limited lifespan / graceful offline
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedTile) => {
        if (cachedTile) return cachedTile;
        return fetch(request).then((tileResponse) => {
          if (tileResponse && tileResponse.status === 200) {
            const clone = tileResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return tileResponse;
        }).catch(() => {
          // Return transparent 1x1 fallback or offline tile placeholder
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#f1f5f9"/><text x="128" y="128" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="sans-serif">Map Tile Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        });
      })
    );
    return;
  }

  // 4. API GET requests (facilities, public catalog): Network-first with cache fallback
  if (url.pathname.startsWith('/api/facilities') || url.pathname.startsWith('/api/health')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'Network offline. Using local cached data.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
