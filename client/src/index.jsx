import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import List from './components/List.jsx'
import List from './components/Search.jsx'

//import List from './components/List.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      items: [],
      currentVideoID :'MQ-z21t8AkI'
    }
  }

  clickSong(songObj){
    var App = this
    console.log(songObj)
    this.setState({currentVideoID: songObj.videoUrl})
  }

  componentDidMount() {
    $.get({
      url: 'http://localhost:3000/playlist', 
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
      <h1>SpotifyTube</h1>

      <iframe id="player" type="text/html" width="640" height="390"
        src={"http://www.youtube.com/embed/" +this.state.currentVideoID + "?enablejsapi=1&autoplay=1"}
        frameborder="0" />
      <List items = {this.state.items} clickSong = {this.clickSong.bind(this)}/>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));