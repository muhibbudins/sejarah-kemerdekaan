/**
 * Cache name
 */
var CACHE_NAME = 'history-of-indonesia'
/**
 * Caching assets
 */
var CACHE_URLS = [
  /**
   * Assets Files
   */
  'assets/material-icon.woff2',
  'assets/style.css',
  'assets/material.red-pink.min.css',
  'assets/material.min.js',

  /**
   * Main JavaScript File
   */
  'story.js',
  
  /**
   * Stories Data
   */
  'stories/detik-detik.json',
  'stories/isi-teks.json',
  'stories/latar-belakang.json',
  'stories/penyebaran-teks.json',
  'stories/peristiwa-rengasdengklok.json',

  /**
   * External Images
   */
  'https://upload.wikimedia.org/wikipedia/commons/9/90/Indonesian_flag_raised_17_August_1945.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/4/4e/Peristiwa%2BRengasdengklok.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/b7/Indonesia_flag_raising_witnesses_17_August_1945.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/b/bc/Proklamasi_Klad.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/0/07/Proklamasi.png'
]

/**
 * Define fetching listener
 */
self.addEventListener('fetch', function(event) {
  event
  .respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response
      }

      var fetchRequest = event.request.clone()

      return fetch(fetchRequest).then(
        function(response) {
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          var responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache)
            })

          return response
        }
      )
    })
  )
})

/**
 * Define install listener
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache already installed')
        return cache.addAll(CACHE_URLS)
      })
  )
})