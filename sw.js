/* ИЗЮМ — service worker: стратегия Network-First для HTML, CSS и JS + офлайн-кеш. */
var VERSION = 'izyum-v7';
var CORE = [
  '/', '/index.html', '/catalog.html', '/calculator.html', '/contacts.html',
  '/privacy.html', '/offline.html',
  '/assets/css/style.css?v=20261102',
  '/assets/js/data.js?v=20261102', '/assets/js/app.js?v=20261102', '/assets/js/catalog.js?v=20261102', '/assets/js/calculator.js?v=20261102',
  '/assets/img/reflex.webp', '/assets/img/shon.webp', '/assets/img/lacoon-beige.webp',
  '/assets/img/minotti.webp', '/assets/img/cloud-armchair-powder.webp', '/assets/img/tatlin.webp', '/assets/img/bed-cloud.webp',
  '/assets/img/chair-romeo.webp',
  '/assets/icons/icon-192.png', '/favicon.svg', '/manifest.webmanifest'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(CORE).catch(function () {}); }));
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

  var isCode = /\.(css|js|html|json|webmanifest)$/i.test(url.pathname);
  if (isCode) {
    /* Для CSS и JS всегда сначала запрашиваем свежую версию из сети */
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match(req, { ignoreSearch: true });
      })
    );
    return;
  }

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
