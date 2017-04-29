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
app.use(bodyParser())
app.get('/', function(req, res){
})

//app.get('/login', function (req, res) {})

app.get('/playlist', function(req, res){
  console.log(req.query)
  var spotifyUser = req.query.user
  var spotifyPlaylistId = req.query.playlist
  var stringBody = ''
  var array = []
  var count = 0;
  request
  .post(authOptions)
  .then((data, reject)=>{
    var token = data.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/'+spotifyUser+'/playlists/'+spotifyPlaylistId+'/tracks',
      headers: {'Authorization': 'Bearer ' + token},
      json: true
    };
    return request.get(options)
  })
  .then((body, reject)=>{
    body.items.forEach((track)=>{
      var string = track.track.name + ' ' + track.track.artists[0].name + ' '
      stringBody += string;
      var youtubeQuery = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+ string + '&type=video&key=' + youtube_api + '&max-results=1&iv_load_policy=3&fs=1'

      var ytoptions = {
        url: youtubeQuery,
        json: true
      };
      request(ytoptions).then((data, reject) => {
        songObject = {
          playlistOwner : track.added_by.id,
          playlistTitle: 'spotfiy playlist',
          title: track.track.name,
          artist: track.track.artists[0].name,
          //imageArt: 'spotify image art',
          videoUrl: data.items[0].id.videoId
          //body: data.body
        }
        count ++
        array.push(songObject)
        if(count === 28){
          res.send(JSON.stringify(array))
          count = 0
        }
      }).catch(()=>{
        count++
      })

      
    })
  })
})


app.get('/youtube', function(req, res){
  var token;
  request
  .post(authOptions)
  .then(function(resolve, reject){
    token = resolve;
  })
  .then(function(resolve, reject){
    res.end(JSON.stringify(token))
  })

  
})







app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})