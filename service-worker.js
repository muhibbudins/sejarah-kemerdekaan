var CACHE_NAME = 'history-of-indonesia'
var CACHE_URLS = [
  'https://unpkg.com/purecss@1.0.0/build/pure-min.css',
  'https://unpkg.com/purecss@1.0.0/build/grids-responsive-min.css',
  'css/blog-old-ie.css',
  'css/blog.css',
  'stories/proklamasi/part-1.json',
  'stories/proklamasi/part-2.json',
  'stories/proklamasi/part-3.json'
]

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log('Installing cache')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache already installed')
        return cache.addAll(CACHE_URLS)
      })
  )
	event.registerForeignFetch({
		scopes:['/'],
		origins:['*'] // or simply '*' to allow all origins
	})
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
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

self.addEventListener('foreignfetch', event => {
	event.respondWith(fetch(event.request).then(response => {
		return {
			response: response,
			origin: event.origin,
			headers: ['Content-Type']
		}
	}))
})