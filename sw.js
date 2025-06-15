const cacheName = "cache_snake"; // Change value to force update

self.addEventListener("install", event => {
	// Kick out the old service worker
	self.skipWaiting();

	event.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"/",
                "favicon.ico",
                "icon-128x128.png",
				"icon-192x192.png",
				"icon-512x512.png",
                "LICENSE",
                "site.webmanifest",
				"snake_apple-touch-icon.png",
				"style.css",
				"build/bedlam.js",
                "build/org.transcrypt.__runtime__.js",
				"build/snake.js",
				"build/snake.project",
                "assets/snake_add_apple.wav",
                "assets/snake_collision.mp3",
                "assets/snake_eat_apple.wav"
			]);
		})
	);
});

self.addEventListener("activate", event => {
	// Delete any non-current cache
	event.waitUntil(
		caches.keys().then(keys => {
			Promise.all(
				keys.map(key => {
					if (![cacheName].includes(key)) {
						return caches.delete(key);
					}
				})
			)
		})
	);
});

// Offline-first, cache-first strategy
// Kick off two asynchronous requests, one to the cache and one to the network
// If there's a cached version available, use it, but fetch an update for next time.
// Gets data on screen as quickly as possible, then updates once the network has returned the latest data.
self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
		})
	);
});