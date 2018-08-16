/**
 * Detect if fetch is undefined on window
 */
if (!'fetch' in window) {
  throw new Error('This browser doesn\'t support fetch() function, please use a modern browsers.')
}

/**
 * Define any dynamic element on browser
 */
var _el = {
  list: document.querySelector('.story-list'),
  item: document.querySelector('.story-item'),
  title: document.querySelector('.story-title'),
  description: document.querySelector('.story-description')
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
var insertText = function(el, text) {
  return _el[el].insertAdjacentHTML('beforeend', '<p>'+ text +'</p>')
}

/**
 * Reference from Google Developer Web Fundamentals (with some change)
 * @source https://developers.google.com/web/fundamentals/primers/promises
 */
getJSON('story.json').then(function(data) {
  _el['title'].innerHTML = data['title']

  return data['parts'].map(getJSON)
    .reduce(function(sequence, partPromise) {
      return sequence.then(function() {
        return partPromise
      }).then(function(part) {
        insertText('description', part.content)
      })
    }, Promise.resolve())
})
.then(function() {
  insertText('description', 'Story loaded!')
})
.catch(function(err) {
  insertText('description', 'Oopps something error ' + err)
})