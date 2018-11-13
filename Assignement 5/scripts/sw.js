


// Files to cache
var cacheName = 'assignement3';
var appShellFiles = [
  '/Find-My-Transport/assignement3/',
  '/Find-My-Transport/assignement3/index.html',
  '/Find-My-Transport/assignement3/bulma.min.css',
  '/Find-My-Transport/assignement3/scripts/main.js',
  '/Find-My-Transport/assignement3/scripts/sw.js',
  '/Find-My-Transport/assignement3/scripts/manifest.json',
  '/Find-My-Transport/assignement3/images/big.png',
  '/Find-My-Transport/assignement3/images/images512.jpeg',
  '/Find-My-Transport/assignement3/images/images192.jpeg',
  '/Find-My-Transport/assignement3/images/taxi.jpeg',
  
];

var contentToCache = appShellFiles;

// Installing Service Worker
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(contentToCache);
    })
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) {
      console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then(function(response) {
        return caches.open(cacheName).then(function(cache) {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
