/**
 * Define Any Variable
 */
var 
  SOURCE = 'story.json',
  EL_BODY = document.querySelector('body'),
  EL_GRID = document.querySelector('.mdl-grid'),
  EL_POPUP = document.querySelector('.mdl-layout__popup'),
  EL_CLOSE = document.querySelector('.mdl-close'),
  EL_RIBBON = document.querySelector('.mdlx-ribbon'),
  EL_TITLE = document.querySelector('.page-title'),
  EL_CONTENT = document.querySelector('.page-content')

/**
 * Detect if fetch is undefined on window
 */
if (!'fetch' in window) {
  throw new Error('This browser doesn\'t support fetch() function, please use a modern browsers.')
}

/**
 * Function to create card item
 * @param {Object} data 
 */
var template = function(data) {
  var string = ''+

    '<div class="mdl-cell mdl-cell--4-col">'+
      '<div class="mdlx-card-wide mdl-card mdl-shadow--2dp">'+
        '<div class="mdl-card__title" style="background: url(\''+ data.image +'\') center / cover">'+
          '<h2 class="mdl-card__title-text">'+ data.title +'</h2>'+
        '</div>'+
        '<div class="mdl-card__supporting-text">'+
          data.content +
        '</div>'+
        '<div class="mdl-card__actions mdl-card--border">'+
          '<a class="mdl-button mdl-open mdl-button--colored mdl-js-button mdl-js-ripple-effect" data-id="'+ data.id +'">'+
            'Lebih Lanjut'+
          '</a>'+
        '</div>'+
      '</div>'+
    '</div>'

  return string
}

/**
 * Function to get source from JSON file
 * 
 * @param {String} url 
 */
var getData = function(url) {
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
var setListener = function() {
  document.querySelectorAll('.mdl-open').forEach(function(element) {
    element.addEventListener('click', function(e) {
      window.scrollTo(0, 0)
      EL_POPUP.classList.add('mdl-layout__popup-active')
      EL_BODY.classList.add('hide-scroll')
      setStory(SOURCE, element.dataset['id'])
    }, false)
  })
  EL_CLOSE.addEventListener('click', function() {
    EL_POPUP.classList.remove('mdl-layout__popup-active')
    EL_BODY.classList.remove('hide-scroll')
  }, false)
}

/**
 * Reference from Google Developer Web Fundamentals (with some change)
 * @source https://developers.google.com/web/fundamentals/primers/promises
 */
var create = function(source) {
  getData(source).then(function(data) {
    return Object.keys(data).reduce(function(sequence, partPromise) {
        return sequence.then(function() {
          return partPromise
        }).then(function(part) {
          insertText(EL_GRID, data[part])
        })
      }, Promise.resolve())
  })
  .then(function() {
    console.log('Story loaded!')
    setListener()
  })
  .catch(function(err) {
    console.error('Oopps something error : ' + err)
  })
}

/**
 * Function to create detail of story
 * @param {Object} source 
 * @param {String} id 
 */
var setStory = function(source, id) {
  EL_RIBBON.style['background-image'] = ''
  EL_TITLE.innerHTML = ''
  EL_CONTENT.innerHTML = ''

  getData(source).then(function(data) {
    var content = data[id]
    return getData(content['full']).then(function(part) {
      EL_RIBBON.style['background-image'] = 'url('+ content['image'] +')'
      EL_CONTENT.innerHTML = part['content']
      EL_TITLE.innerHTML = part['title']
    })
  })
}

/**
 * Load Service Worker
 */
if (!'serviceWorker' in navigator) {
  throw new Error('This browser doesn\'t support serviceWorker() function, please use a modern browsers.')
} else {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('worker.js').then(function(register) {
      console.log('ServiceWorker registration successful with scope: ', register.scope)
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

/**
 * Start App
 */
create(SOURCE)