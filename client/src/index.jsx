import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx'
import Search from './components/Search.jsx'
import {Button} from 'reactstrap'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      currentVideoID :'',
      searchText: '',
      currentUser: '',
      currentPlaylist: '',
      userPlaylistId: location.href !== '/'? undefined:location.href.split('?')[1].split(':')
    
    }
  }


  componentDidMount() {
    if(this.state.userPlaylistId){
      var spotifyUri ='spotify:user:' + this.state.userPlaylistId[0]+':playlist:' + this.state.userPlaylistId[1]
    }
    console.log(this.state.userPlaylistId)
    this.getVideoDB()
  }

  getVideoDB(playlistURI){
    console.log(playlistURI)
    var playlistURI = playlistURI || 'spotify:user:flamekin:playlist:09bNKlhOeHWeMr3ur0inkG'
    var uri = playlistURI.split(':')
    $.get({
      url: 'http://localhost:3000/playlistdb', 
      data: {
        user: uri[2],
        playlist: uri[4]
      },
      success: (data) => {
        window.data = data
        console.log(data[0])
        this.setState({items:data})
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  getVideo(playlistURI){
    var context = this
    var playlistURI = playlistURI || 'spotify:user:flamekin:playlist:09bNKlhOeHWeMr3ur0inkG'
    var uri = playlistURI.split(':')
    $.get({
      url: 'http://localhost:3000/playlist', 
      data: {
        user: uri[2],
        playlist: uri[4]
      },
      success: (data) => {
        window.data = JSON.parse(data)
        console.log(typeof window.data, window.data)
        this.setState({
          items: window.data,
          currentUser: window.data[0].playlistOwner,
          currentPlaylist: window.data[0].playlistId

        })
      },
      error: (err) => {
        console.log('err', err);
      }
    });

  }

  clickSong(songObj){
    console.log(songObj)
    window.player.loadVideoById(songObj.videoUrl)
  }

  playPauseVideo(){
    var playing = window.player.getPlayerState()
    if(playing === 2 || playing === 5){window.player.playVideo()}
    else if(playing === 1){window.player.pauseVideo()}
    else if(playing === 0){this.playNext()}
  }

  previous(){

  }

  toggleShuffle(){

  }

  toggleMute(){
    console.log(true)
    var muted = window.player.isMuted();
    console.log(muted)
    if(!muted){
      player.window.unMute()
    } else {
      player.window.mute()
    }
  }

  playNext(){
    var index = Math.floor(Math.random(data.length)*data.length)
    player.loadVideoById(data[index].videoUrl)
  }

  stopVideo(){
    window.player.stopVideo()
  }

  render () {
    if(this.currentUser){
      var returnLink = window.location.origin + '/?' + this.state.currentUser+ ':'+  this.state.currentPlaylist
    } else {
      var returnLink = ''
    }
    return (
      <div>
        <h1>Spotify Viewer</h1>
          <h3>Return Link</h3>
          <div>{returnLink}</div>
        <Search 
        getVideos={this.getVideo.bind(this)}
        />
        <iframe 
        id="player" 
        type="text/html" 
        width="640" 
        height="390"
        src={"http://www.youtube.com/embed/" +this.state.currentVideoID + "?enablejsapi=1&autoplay=1"}
        frameBorder="0" 
        allowFullScreen="allowfullscreen"
        />
        <div>
          <Button outline color="primary">Previous</Button>
          <Button outline color="success" onClick={this.playPauseVideo}>Play/Pause</Button>
          <Button outline color="warning" onClick={this.playNext}>Next</Button>
          <Button outline color="danger" onClick={this.stopVideo}>Stop</Button>
          <Button outline color="info" onclick={this.toggleMute}>Shuffle</Button>
          <Button outline color="link" onclick={this.toggleMute}>Mute</Button>
        </div>
        <List 
        items = {this.state.items} 
        clickSong = {this.clickSong.bind(this)}
        />
      </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));