---
layout: null
---

var version = '{{site.time | date: '%Y%m%d%H%M%S'}}::';


var urlsToCache = [
  '/',
  '/poleznye-ssylki/',
  '/author/',
  '/style/style.css'
 ];



var CACHE_NAME = 'version + psycareer';

self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('activate', (event) => {
  var cacheKeeplist = ['CACHE_NAME'];

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (cacheKeeplist.indexOf(key) !== 0) {
          return caches.delete(key);
        }
      }));
    })
  );
});




self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {

    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {

        let responseClone = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/offline/');
      });
    }
  }));
});

{% comment %}



var CACHE = 'cache-update-and-refresh';

self.addEventListener('install', function(evt) {
  console.log('The service worker is being installed.');

  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll([
      '/',
      '/uzkaya-specializaciya/',
      '/poleznye-ssylki/',
      '/author/',
      '/style/likely.css',
      '/tabu-v-reklame/',
      '/sfery-specializacii-psixologa/',
      '/style/style.css'
    ]);
  }));
});


self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');

  evt.respondWith(fromCache(evt.request));

  evt.waitUntil(
    update(evt.request)

    .then(refresh)
  );
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {

      var message = {
        type: 'refresh',
        url: response.url,

        eTag: response.headers.get('ETag')
     };

     client.postMessage(JSON.stringify(message));
    });
  });
}






{% endcomment %}
