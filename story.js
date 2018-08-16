if (!'fetch' in window) {
  throw new Error('This browser doesn\'t support fetch() function, please use a modern browsers.')
}

var _el = {
  list: document.querySelector('.story-list'),
  item: document.querySelector('.story-item'),
  title: document.querySelector('.story-title'),
  description: document.querySelector('.story-description')
}

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

getJSON('story.json').then(function(data) {
  _el['title'].innerHTML = data['title']

  return data['parts'].map(getJSON)
    .reduce(function(sequence, partPromise) {
      return sequence.then(function() {
        return partPromise
      }).then(function(part) {
        _el['description'].insertAdjacentHTML('beforeend', '<p>'+ part.content +'</p>')
      })
    }, Promise.resolve())
})
.then(function() {
  _el['description'].insertAdjacentHTML('beforeend', '<p>Story loaded!</p>')
})
.catch(function(err) {
  _el['description'].insertAdjacentHTML('beforeend', '<p>Oopps something error ' + err + '</p>')
})