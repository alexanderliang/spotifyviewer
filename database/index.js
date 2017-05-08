var mongoose = require('mongoose');
mongoose.connect('mongodb://alack:dwiz@ds133241.mlab.com:33241/astrosalamanders/spotifyviewer');

var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var songSchema = mongoose.Schema({
  playlistOwner: String,
  playlistId: String,
  title: String,
  artist: String,
  videoUrl: String,
  songId: {type: String, unique: 1},
  lastPlayed: Date
});


var Song = mongoose.model('Song', songSchema);

Song.insert = function(songObject){
  var song = {
    playlistOwner: songObject.playlistOwner,
    playlistId: songObject.playlistId,
    title: songObject.title,
    artist: songObject.artist,
    videoUrl: songObject.videoUrl,
    songId: songObject.playlistId+songObject.videoUrl,
    lastPlayed: null
  }
  var data = new Song(song)
  data.save(function(err, data){})
}


Song.getList = function(reqObject, callback){
  reqOwner = reqObject.playlistOwner || '*'
  reqPlaylist = reqObject.playlistId || '*'
  Song.find().sort({lastPlayed: -1}).limit(25)
  //.where('playlistOwner').exists(reqOwner)
  //.where("playlistId").exists(reqPlaylist)
  .then(function(resolve, reject){
    callback(resolve)
  })
}

Song.update = function(songObject){
  console.log(songObject)
  var songId = songObject.playlistId+songObject.videoUrl
  console.log(songId)
  Song.find(({songId: songId}), function(err, doc){
    console.log(doc)
    doc[0].lastPlayed = new Date();
    doc[0].save()
    if(err){console.log(err)}
  })
}

module.exports = Song;