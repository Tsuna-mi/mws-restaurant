const version = '1.0.14';
const staticCacheName = 'msw-restrev-';
const staticCache = staticCacheName + version;
const contentImgsCache = `${staticCacheName}imgs`;
const allCaches = [
  staticCache,
  contentImgsCache
];

function servePhoto(request) {
  // Regex to store the assets images without type
  const storageUrl = request.url.replace(/-(s|m|l|xl|m@2x|s@2x)\.(jpg|webp|png|svg)$/, '');

  return caches.open(contentImgsCache)
    .then(cache => cache.match(storageUrl)
      .then((response) => {
        if (response) return response;

        return fetch(request).then((networkResponse) => {
          cache.put(storageUrl, networkResponse.clone());
          return networkResponse;
        }).catch(() => console.log('Fetch fail', request.url));
      }));
}

self.addEventListener('install', (event) => {
  // Open a cache and add the static resources
  event.waitUntil(caches.open(staticCache).then((cache) => {
    cache.addAll([
      '/',
      'js/dbhelper.js',
      'js/main.js',
      'js/restaurant_info.js',
      'restaurant.html',
      'assets/data/restaurants.json',
      'manifest.json',
      'assets/css/styles.css',
      'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
      'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2'
    ]);
    cache.keys().then(keys => console.log(keys));
  }));
});

self.addEventListener('activate', (event) => {
  // Remove old cache versions
  event.waitUntil(caches.keys().then((cacheNames) => {
    Promise.all(cacheNames.filter(cacheName =>
      cacheName.startsWith(staticCacheName) && !allCaches.includes(cacheName))
      .map(cacheName => caches.delete(cacheName)));
  }));
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/assets/img/')) {
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  // Check if we have the request cached or not
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)));
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
