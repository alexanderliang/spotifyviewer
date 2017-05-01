//React
import React from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'reactstrap'

//jQuery
import $ from 'jquery';

//Components
import List from './components/List.jsx'
import ReturnLink from './components/ReturnLink.jsx'
import Search from './components/Search.jsx'


class App extends React.Component {
  //Required
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      currentVideoID :'',
      searchText: '',
      currentUser: '',
      currentPlaylist: '',
      //userPlaylistId: location.pathname !== '/'? undefined:location.href.split('?')[1].split(':'),
      location: location.pathname
      
    }
  }

  //On-start
  componentDidMount() {
      this.getVideoDB() 
    
  }

  //Ajax Requests
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
        this.playNext('0')
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  getVideo(playlistUriUrl){
    if(playlistUriUrl.indexOf('spotify') === 0){
      var spotifyUri = playlistUriUrl.split(':')
      var spotifyUserPlaylist = [spotifyUri[2], spotifyUri[4]]
    } else {
      var spotifyUrl= playlistUriUrl.split('/')
      var spotifyUserPlaylist = [spotifyUrl[4], spotifyUrl[6]]
    }
    $.get({
      url: 'http://localhost:3000/playlist', 
      data: {
        user: spotifyUserPlaylist[0],
        playlist: spotifyUserPlaylist[1]
      },
      success: (data) => {
        window.data = JSON.parse(data)
        console.log(typeof window.data, window.data)
        this.setState({
          items: window.data,
          currentUser: window.data[0].playlistOwner,
          currentPlaylist: window.data[0].playlistId
        })
        console.log('windowdata', window.data[0].videoUrl)
        this.playNext('0')
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  updateLastPlayed(songObj){
    console.log(true)
    $.post({
      url: 'http://localhost:3000/updatelastplayed', 
      data: songObj,
      success: (data) => {
        console.log('Updated Last Played')
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }
  //Player Functions
  clickSong(songObj){
    console.log(songObj)
    window.player.loadVideoById(songObj.videoUrl)
    this.updateLastPlayed(songObj);
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

  playNext(videoIndex){
    var index = Math.floor(Math.random(data.length)*data.length)
    console.log('videoIndex', index)
    player.loadVideoById(data[index].videoUrl)
  }

  stopVideo(){
    window.player.stopVideo()
  }

  render () {
    var hasPlaylist = !!this.currentUser
    return (
      <div>
        <h1>Spotify Viewer</h1>
        <Search 
        getVideos={this.getVideo.bind(this)}
        />
        <ReturnLink player={this.state} />
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