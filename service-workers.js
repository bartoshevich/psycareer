---
layout: null
---

'use strict'

let version = '{{site.time | date: '%Y%m%d%H%M%S'}}::';


let urlsToCache = [
  '/',
  '/me/',
  '/author/',
  '/poleznye-ssylki/',
  '/style/style.css',
  '/uzkaya-specializaciya/',
  '/tabu-v-reklame/',
  '/sfery-specializacii-psixologa/',
  '/sovet-nachinayushhim-psixologam-po-reklame-uslug/',
  '/rekomendacii-po-napolneniyu-sajta-dlya-psixologa/',
  '/sait-psihologa-tipichnie-oshibki/',
  '/images/218.png'
 ];


let CACHE_NAME = 'version + psycareer';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});



self.addEventListener('activate', (event) => {
  let cacheKeeplist = ['CACHE_NAME'];

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
