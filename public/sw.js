var CACHE_NAME = 'cw-service-worker';
var version = 'v2::';
var urlsToCache = [
  // '/',
  // '/sw.js',
  // '/bundle.js',
  // '/stylesheets/global.css',
  // '/manifest.json',
  '/images/blackgoatplayersheet.PNG',
  '/images/greatcthulhuplayersheet.PNG',
  '/images/crawlingchaosplayersheet.PNG',
  '/images/yellowsignplayersheet.PNG',
  '/images/sleeperplayersheet.PNG',
  '/images/windwalkerplayersheet.PNG',
  '/images/openerofthewayplayersheet.PNG',
  '/images/tchotchoplayersheet.PNG',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(version+CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)//.then(function(cache) {
        // console.log(event.request);
        // return cache.match(event.request).then(function (response) {
          // return response || fetch(event.request).then(function(response) {
            // cache.put(event.request, response.clone());
            // return response;
          // });
        // });
         .then(function(response) {
           // Cache hit - return response
           if (response) {
             console.log('hit');
             return response;
           }
           return fetch(event.request);
      })
    );
  });

  self.addEventListener("activate", function(event) {
    /* Just like with the install event, event.waitUntil blocks activate on a promise.
       Activation will fail unless the promise is fulfilled.
    */
    console.log('WORKER: activate event in progress.');
  
    event.waitUntil(
      caches
        /* This method returns a promise which will resolve to an array of available
           cache keys.
        */
        .keys()
        .then(function (keys) {
          // We return a promise that settles when all outdated caches are deleted.
          return Promise.all(
            keys
              .filter(function (key) {
                // Filter by keys that don't start with the latest version prefix.
                return !key.startsWith(version);
              })
              .map(function (key) {
                /* Return a promise that's fulfilled
                   when each outdated cache is deleted.
                */
                return caches.delete(key);
              })
          );
        })
        .then(function() {
          console.log('WORKER: activate completed.');
        })
    );
  });