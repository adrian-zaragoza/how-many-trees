const express = require('express')
const favicon = require('serve-favicon');
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const sslRootCAs = require('ssl-root-cas')
sslRootCAs.inject()

// app.use(favicon(path.join(__dirname, 'public', 'images', 'treeicon.svg')))
app.use('/public', express.static('public'));
const PORT = process.env.PORT || 8000; // process.env accesses heroku's environment variables


app.use(express.static('public'))

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// create route to get single book by its isbn
app.post('/carbonfootprint', jsonParser, (request, response) => {
  // make api call using fetch
  const myHeaders = new fetch.Headers({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer DoRWhU2QqYwELzPyS10VQ'
});
  //console.log(request.body)
  fetch('https://www.carboninterface.com/api/v1/estimates', {
    "method": 'post',
    "headers": myHeaders,
    "body": JSON.stringify(request.body)
  })
  .then((response) => {
      console.log("This is the response", response)
      return response.text();
  }).then((body) => {
      console.log("This is the body", body)
      let results = JSON.parse(body)
      console.log(results)   // logs to server
      response.send(results) // sends to frontend
    }).catch(function (error){
      console.log(error)
    })
});

// create a search route
// app.get('/search', (request, response) => {
//   fetch(`http://openlibrary.org/search.json?q=${request.query.string}`)
//   .then((response) => {
//       return response.text();
//   }).then((body) => {
//       let results = JSON.parse(body)
//       console.log(results)
//       response.send(results)
//     });
// });



app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}