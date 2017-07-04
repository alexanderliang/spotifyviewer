var express = require('express')
var Promise = require('bluebird')
var request = require('request-promise')
var bodyParser = require('body-parser')
var cors = require('cors')
var cookieParser = require('cookie-parser')
var querystring = require('querystring')
var db = require('../database')
var path = require('path')
var keys = require('../keys.js')

const client_id = keys.spotifyClientId
const client_secret = keys.spotifySecret
const youtube_api = keys.googleApiKey

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
  form: {grant_type: 'client_credentials'},
  json: true
};

var app = express()

app.use(cors())
app.use('/',express.static('client/dist'))
app.use(bodyParser())

app.get('/playlist', function(req, res){
  console.log(req.url)
  var spotifyUser = req.query.user
  var spotifyPlaylistId = req.query.playlist
  var stringBody = ''
  var array = []
  var count = 0;
  var playlistLength;

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
    playlistLength = body.items.length;
    body.items.forEach((track)=>{
      var string = track.track.name + ' ' + track.track.artists[0].name + ' video'
      stringBody += string;
      var youtubeQuery = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+ string + '&type=video&key=' + youtube_api + '&max-results=1&iv_load_policy=3&fs=1'

      var ytoptions = {
        url: youtubeQuery,
        json: true
      };
      request(ytoptions)
      .then((data, reject) => {
        songObject = {
          playlistOwner : spotifyUser,
          playlistId: spotifyPlaylistId,
          title: track.track.name,
          artist: track.track.artists[0].name,
          //imageArt: 'spotify image art',
          videoUrl: data.items[0].id.videoId
          //body: data.body
        }
        count ++
        array.push(songObject)
        db.insert(songObject)
        console.log(count, playlistLength)
        if(count === playlistLength - 1){
          setTimeout(()=>{
            res.send(JSON.stringify(array))
            count = 0
          }, 250)
        }
      })
      .catch((err)=>{
        console.log(err)
        count++
        if(count === 5){
          setTimeout(()=>{
            res.send(JSON.stringify(array))
            count = 0
          }, 500)
          
        }
      })

      
    })
  })
})

app.get('/playlistdb', function(req, res){
  songRequest = {}
  db.getList(songRequest, function(data){
    res.send(data)
  })

})

app.post('/updatelastplayed', function(req, res){
  db.update(req.body)
  res.status(200)
  res.send('congrats')
})


app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})