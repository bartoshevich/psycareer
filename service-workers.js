---
layout: null
---



var version = '{{site.time | date: '%Y%m%d%H%M%S'}}::';


var urlsToCache = [
  '/',
  '/uzkaya-specializaciya/',
  '/poleznye-ssylki/',
  '/author/',
  '/style/likely.css',
  '/style/likely.js',
  '/tabu-v-reklame/',
  '/sfery-specializacii-psixologa/',
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


{% comment %}

 // Remove caches whose name is no longer valid
 var clearOldCaches = function() {
  return caches.keys()
      .then(function (keys) {
          return Promise.all(keys
              .filter(function (key) {
                return key.indexOf(version) !== 0;
              })
              .map(function (key) {
                return caches.delete(key);
              })
          );
      })
};


{% endcomment %}



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
