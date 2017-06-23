//React
import React from 'react';
import ReactDOM from 'react-dom';
import {Button, ButtonGroup} from 'react-bootstrap'

//jQuery
import $ from 'jquery';

//Components
import List from './components/List.jsx'
import ReturnLink from './components/ReturnLink.jsx'
import Search from './components/Search.jsx'

var port = process.env.PORT || 3000;

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
      location: location.href
      
    }
  }

  //On-start
  componentDidMount() {
    this.state.location = this.state.location.split('?')[1]
    console.log(this.state.location, 'location')
    if(!this.state.location){
      this.getVideoDB() 
    } else {
      var linkQ = this.state.location.split(':')
      console.log('linkQ': linkQ)
      this.getVideo([linkQ[0], linkQ[1]])
    }
    function youtubeOnLoad(){
      var player;
      window.onYouTubePlayerAPIReady = function onYouTubePlayerAPIReady() {
        window.player = new YT.Player('player', {
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
      }

      //window.onYouTubePlayerAPIReady()
      // when video ends
      function onPlayerStateChange(event) {
      console.log(event.data)
        if(event.data === 0) {
          var index = Math.floor(Math.random(data.length)*data.length)
          console.log(index)
          player.loadVideoById(data[index].videoUrl)
        }
      }

    }
    setTimeout(youtubeOnLoad, 1000)

  }
  
  //Ajax Requests
  getVideoDB(){
    $.get({
      url: '/playlistdb', 
      data: {},
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
    } else if(playlistUriUrl.indexOf('https://') === 0){
      var spotifyUrl= playlistUriUrl.split('/')
      var spotifyUserPlaylist = [spotifyUrl[4], spotifyUrl[6]]
    } else {
      var spotifyUserPlaylist=[playlistUriUrl[0], playlistUriUrl[1]]
    }

    $.get({
      url: '/playlist', 
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
      url: '/updatelastplayed', 
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

  handleKeyPress(e){console.log(e)}
  dropBomb(){

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
      <div onKeyDown={console.log('hello')} >
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
          <ButtonGroup>
            <Button  onClick={this.playPauseVideo}>Play/Pause</Button>{' '}
            <Button  bsStyle="success" onClick={this.playNext}>Next</Button>{' '}
            <Button  bsStyle="danger" onClick={this.stopVideo}>Stop</Button>{' '}
          </ButtonGroup>
        </div>
        <List 
        items = {this.state.items} 
        clickSong = {this.clickSong.bind(this)}
        />
      </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));


// //
//           <Button outline color="primary">Previous</Button>{' '}
//           <Button outline color="info" onclick={this.toggleMute}>Shuffle</Button>{' '}
//           <Button outline color="link" onclick={this.toggleMute}>Mute</Button>{' '}