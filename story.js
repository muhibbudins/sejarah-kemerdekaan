var SOURCE = 'story.json'

/**
 * Detect if fetch is undefined on window
 */
if (!'fetch' in window) {
  throw new Error('This browser doesn\'t support fetch() function, please use a modern browsers.')
}

var template = function(data) {
  return `
    <div class="mdl-cell mdl-cell--4-col">
      <div class="mdlx-card-wide mdl-card mdl-shadow--2dp">
        <div class="mdl-card__title" style="background: url('${data.image}') center / cover;">
          <h2 class="mdl-card__title-text">${data.title}</h2>
        </div>
        <div class="mdl-card__supporting-text">
          ${data.content}
        </div>
        <div class="mdl-card__actions mdl-card--border">
          <a class="mdl-button mdl-open mdl-button--colored mdl-js-button mdl-js-ripple-effect" data-id="${data.id}">
            Lebih Lanjut
          </a>
        </div>
      </div>
    </div>
  `
}

/**
 * Function to get source from JSON file
 * 
 * @param {String} url 
 */
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    return fetch(url)
      .then(function(res) {
        return res.json()
      })
      .then(function(res) {
        resolve(res)
      })
      .catch(function(err) {
        reject(err)
      })
  })
}

/**
 * Insert any text to defined element on browser
 * 
 * @param {String} el 
 * @param {String} text 
 */
var insertText = function(el, string) {
  return el.insertAdjacentHTML('beforeend', template(string))
}

/**
 * Create Listener
 */
var createListener = function() {
  var body = document.querySelector('body')
  var title = document.querySelectorAll('.mdl-open')
  var popup = document.querySelector('.mdl-layout__popup')
  var close = document.querySelector('.mdl-close')

  title.forEach(function(element) {
    element.addEventListener('click', function(e) {
      window.scrollTo(0, 0);
      popup.classList.add('mdl-layout__popup-active')
      body.classList.add('hide-scroll')
      createStory(SOURCE, element.dataset['id'])
    }, false)
  })
  close.addEventListener('click', function() {
    popup.classList.remove('mdl-layout__popup-active')
    body.classList.remove('hide-scroll')
  }, false)
}

/**
 * Reference from Google Developer Web Fundamentals (with some change)
 * @source https://developers.google.com/web/fundamentals/primers/promises
 */
var createList = function(source) {
  getJSON(source).then(function(data) {
    return Object.keys(data).reduce(function(sequence, partPromise) {
        return sequence.then(function() {
          return partPromise
        }).then(function(part) {
          insertText(document.querySelector('.mdl-grid'), data[part])
        })
      }, Promise.resolve())
  })
  .then(function() {
    console.log('Story loaded!')
    createListener()
  })
  .catch(function(err) {
    console.error('Oopps something error : ' + err)
  })
}

var createStory = function(source, id) {
  document.querySelector('.mdlx-ribbon').style['background-image'] = ''
  document.querySelector('.page-title').innerHTML = ''
  document.querySelector('.page-content').innerHTML = ''
  console.log(source, id)
  getJSON(source).then(function(data) {
    var content = data[id]
    return getJSON(content['full']).then(function(part) {
      document.querySelector('.mdlx-ribbon').style['background-image'] = `url(${content['image']})`
      document.querySelector('.page-content').innerHTML = part['content']
      document.querySelector('.page-title').innerHTML = part['title']
    })
  })
  .then(function() {
    console.log('Story loaded!')
  })
  .catch(function(err) {
    console.error('Oopps something error : ' + err)
  })
}

/**
 * Load Service Worker
 */
// if (!'serviceWorker' in navigator) {
//   throw new Error('This browser doesn\'t support serviceWorker() function, please use a modern browsers.')
// } else {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('worker.js').then(function(register) {
//       // Registration was successful
//       console.log('ServiceWorker registration successful with scope: ', register.scope);
//     }, function(err) {
//       // registration failed :(
//       console.log('ServiceWorker registration failed: ', err);
//     })
//   })
// }

/**
 * Create Post
 */
createList(SOURCE)