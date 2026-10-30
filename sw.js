/* ИЗЮМ — service worker v2: поддержка офлайн-режима, новых моделей и тёмной темы. */
var VERSION = 'izyum-v3';
var CORE = [
  '/', '/index.html', '/catalog.html', '/calculator.html', '/contacts.html',
  '/privacy.html', '/offline.html',
  '/assets/css/style.css',
  '/assets/js/data.js', '/assets/js/app.js', '/assets/js/catalog.js', '/assets/js/calculator.js',
  '/assets/img/cloud.webp', '/assets/img/reflex.webp', '/assets/img/shon.webp', '/assets/img/lacoon.webp',
  '/assets/img/minotti.webp', '/assets/img/cloud-armchair.webp', '/assets/img/tatlin.webp', '/assets/img/bonaldo.webp',
  '/assets/icons/icon-192.png', '/favicon.svg', '/manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(VERSION).then(function (c) { c.put(url.pathname === '/' ? '/' : url.pathname, copy); });
        return res;
      }).catch(function () {
        return caches.match(url.pathname, { ignoreSearch: true }).then(function (r) { return r || caches.match('/offline.html'); });
      })
    );
    return;
  }

  var cacheable = url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!cacheable) return;
  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
