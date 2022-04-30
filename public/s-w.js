const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'public/js/err.js',
  'public/js/index.js',
  'public/js/pwindb.js',
  'public/css/styles.css',
];
const APP_PREFIX = "Pwudget-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;


self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('success: '+ CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      let keepDat = keylist.filter(
          function(key) {
            return key.indexOf(APP_PREFIX);
          }
      );
      keepDat.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function(key, i) {
          if (keepDat.indexOf(key) === -1){
            console.log("deleting: " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        }
      )
    )
})
);

  // self.clients.claim();
});

// Intercept fetch requests
self.addEventListener('fetch', function(evt) {
  //   
  evt.respondWith(
      caches.match(evt.request).then( 
        function (request) {
          return request || fetch(evt.request);
      }
    )
  );
});