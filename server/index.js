var express = require('express')
var Promise = require('bluebird')
var request = require('request-promise')
var bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
var querystring = require('querystring')


const client_id = 'd215473e60534fc0aa136eee0317bf33'
const client_secret = 'cf375c132e234194b100de60bbb01c39'
const youtube_api = 'AIzaSyD3gTN8crYzbM5CLzAkBNN_9bceOxWaG34'

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
  form: {grant_type: 'client_credentials'},
  json: true
};

var app = express()

app.use(cors())
app.use(express.static('client/dist'))

app.get('/', function(req, res){
  res.send
})

//app.get('/login', function (req, res) {})

app.get('/playlist', function(req, res){
  var stringBody = ''
  var object
  request
  .post(authOptions)
  .then((body, reject)=>{
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/flamekin/playlists/1KXknBsvvCqZWIzYZVh8Mh/tracks',
      headers: {'Authorization': 'Bearer ' + token},
      json: true
    };
    request
    .get(options)
    .then((body, reject)=>{
      res.send(JSON.stringify(body))
      body.items.forEach((track)=>{
        var string = track.track.name + ' ' + track.track.artists[0].name + ' '
        stringBody += string;
        //console.log(stringBody)
      })
      console.log(stringBody)
  }).then(console.log(stringBody))
  })
})

app.get('/youtube', function(req, res){
  var token;
  request
  .post(authOptions)
  .then(function(resolve, reject){
    //console.log(resolve)
    token = resolve;
  })
  .then(function(resolve, reject){
    res.end(JSON.stringify(token))
  })

  
})







app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})