/* eslint-disable no-restricted-globals */
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installed");
    self.skipWaiting(); // Activate immediately
  });
  
  self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activated");
    event.waitUntil(self.clients.claim());
  });
  
  // Cache images using CacheFirst strategy
  self.addEventListener("fetch", (event) => {
    if (event.request.destination === "image") {
      event.respondWith(
        caches.open("image-cache").then(async (cache) => {
          const cachedResponse = await cache.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    }
  });
  