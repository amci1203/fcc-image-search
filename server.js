// server.js
// where your node app starts

// init project
const express = require('express')
const GoogleImages = require('google-images')
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY)

const PORT = process.env.PORT || 8000

// simple array to hold 10 most recent searches
const latestSearches = []
const pushSearch = search => {
  latestSearches.unshift(search)
  if (latestSearches.length === 11) {
    latestSearches.pop()
  }
}

express()
.use(express.static('app'))

.get("/", (req, res) => {
  res.send("<pre>\
    \n\n\n\
    Welcome to my Image Searcher!\n\n\
    Use /search/:term?offset to search for images to your heart's content!\n\
    Use /search/latest to see the most recent search terms and when they were made!\n\
    \n\n\
    Enjoy!!!\
  </pre>")
})
.get('/search/latest', (req, res) => {
  res
    .set({'Content-Type': 'application/json; charset=utf-8'})
    .send(JSON.stringify(latestSearches, null,  ' '))
})
.get('/search/:term', (req, res) => {
  const { term } = req.params
  const when = new Date().toISOString()
  const page = req.query.offset || 1
  client.search(decodeURIComponent(term), { page })
  .then(images => {
    pushSearch({ term, when })
    res
    .set({'Content-Type': 'application/json; charset=utf-8'})
    .send(JSON.stringify(images, null,  ' '))
  })
})



.listen(PORT, () => {
  console.log(`Your app is listening on port ${ PORT }`)
})

