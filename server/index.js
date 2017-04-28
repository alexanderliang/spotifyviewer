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
  var array = []
  var count = 0;
  request
  .post(authOptions)
  .then((data, reject)=>{
    var token = data.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/flamekin/playlists/1KXknBsvvCqZWIzYZVh8Mh/tracks',
      headers: {'Authorization': 'Bearer ' + token},
      json: true
    };
    return request.get(options)
  })
  .then((body, reject)=>{
    body.items.forEach((track)=>{
      var string = track.track.name + ' ' + track.track.artists[0].name + ' '
      stringBody += string;
      var youtubeQuery = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+ string + '&type=video&key=' + youtube_api + '&max_result=1'

      request(youtubeQuery, function(err, data){
        body = JSON.parse(data.body)
        songObject = {
          playlistOwner : track.added_by.id,
          playlistTitle: 'spotfiy playlist',
          title: track.track.name,
          artist: track.track.artists[0].name,
          //imageArt: 'spotify image art',
          videoUrl: body.items[0].id,
          //body: data.body
        }
        count ++
        array.push(songObject)
        console.log(body.items[0].id)
        if(count === body.items.length){
          res.send(JSON.stringify(array))
          count = 0
        }
      })

      request(youtubeQuery, function(err, data){
        body = JSON.parse(data.body)
        songObject = {
          playlistOwner : track.added_by.id,
          playlistTitle: 'spotfiy playlist',
          title: track.track.name,
          artist: track.track.artists[0].name,
          //imageArt: 'spotify image art',
          videoUrl: body.items[0].id,
          //body: data.body
        }
        count ++
        array.push(songObject)
        console.log(body.items[0].id)
        if(count === body.items.length){
          res.send(JSON.stringify(array))
          count = 0
        }
      })
      
    })
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