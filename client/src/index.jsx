import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx'
import Search from './components/Search.jsx'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      currentVideoID :'MQ-z21t8AkI',
      searchText: '',
      userPlaylistId: location.href !== '/'? undefined:location.href.split('?')[1].split(':')
    }
  }

  clickSong(songObj){
    console.log(songObj)
    this.setState({currentVideoID: songObj.videoUrl})
  }

  componentDidMount() {
    if(this.state.userPlaylistId){
      var spotifyUri ='spotify:user:' + this.state.userPlaylistId[0]+':playlist:' + this.state.userPlaylistId[1]
    }

    this.getVideo(spotifyUri)
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
        window.data = JSON.parse(data)
        this.setState({items:JSON.parse(data)})
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  getVideo(playlistURI){
    console.log(playlistURI)
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
        this.setState({items:JSON.parse(data)})
      },
      error: (err) => {
        console.log('err', err);
      }
    });
  }

  render () {
    return (<div>
      <h1>Spotify Viewer</h1>
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
      <List 
      items = {this.state.items} 
      clickSong = {this.clickSong.bind(this)}
      />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));