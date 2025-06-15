const CACHE_NAME = "cache_snake"; // Change value to force update

const URLS_TO_CACHE = [
    "/",
    "snake.html",
    "icon_128x128.png",
    "icon_192x192.png",
    "icon_512x512.png",
    "LICENSE",
    "site.webmanifest",
    "snake_apple-touch-icon.png",
    "style.css",
    "assets/snake_add_apple.wav",
    "assets/snake_collision.mp3",
    "assets/snake_eat_apple.wav",
    "build/bedlam.js",
    "build/bedlam.py",
    "build/bedlam.map",
    "build/snake.js",
    "build/snake.py",
    "build/snake.map",
    "build/org.transcrypt.__runtime__.js",
    "build/org.transcrypt.__runtime__.py",
    "build/org.transcrypt.__runtime__.map",
    "build/snake.project"
];

// Install event: Cache assets
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Opened cache');
          return cache.addAll(URLS_TO_CACHE);
        })
    );
  });

// Fetch event: Serve from cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          // Not in cache - fetch from network
          return fetch(event.request);
        }
      )
    );
  });
  
  // Activate event: Clean up old caches
  self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
