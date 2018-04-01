const version = '1.0.4';
const staticCacheName = 'msw-restrev-';
const staticCache = staticCacheName + version;
const staticCacheUrls = [
  '/',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/registerSW.js',
  '/index.html',
  '/restaurant.html',
  '/assets/data/restaurants.json',
  '/manifest.json',
  '/assets/css/styles.css',
  'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
  'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2',
  '/assets/img/1.jpg',
  '/assets/img/2.jpg',
  '/assets/img/3.jpg',
  '/assets/img/4.jpg',
  '/assets/img/5.jpg',
  '/assets/img/6.jpg',
  '/assets/img/7.jpg',
  '/assets/img/8.jpg',
  '/assets/img/9.jpg',
  '/assets/img/10.jpg',
  '/assets/img/restaurant-icon.svg'
];

function servePhoto(request) {
  // Regex to store the assets images without type
  const storageUrl = request.url.replace(/-(s|m|l|xl|m@2x|s@2x)\.(jpg|webp|png|svg)$/, '');

  return caches.open(staticCache)
    .then(cache => cache.match(storageUrl)
      .then((response) => {
        if (response) return response;

        return fetch(request).then((networkResponse) => {
          cache.put(storageUrl, networkResponse.clone());
          return networkResponse;
        }).catch(() => console.log('Fetch Images fail', request.url));
      }));
}


self.addEventListener('install', (event) => {
  // Open a cache and add the static resources
  event.waitUntil(caches.open(staticCache)
    .then(cache => cache.addAll(staticCacheUrls))
    .catch(error => console.log('Error addingAll to cache, ', error)));
});

self.addEventListener('activate', (event) => {
  console.log('Activating new service worker...');
  const cacheWhitelist = [staticCache];

  // Remove old cache versions
  event.waitUntil(caches.keys().then((cacheNames) => {
    Promise.all(cacheNames.map((cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        caches.delete(cacheName);
      }
      return caches;
    }));
  }));
});

self.addEventListener('fetch', (event) => {
  console.log('Fetch event for ', event.request.url);

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/assets/img/')) {
      console.log('Adding a new image to cache, ', event.request);
      event.respondWith(servePhoto(event.request));
      return;
    }
  }

  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request))
    .catch(error => console.log('Error in cache.match, ', error)));
});

self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
