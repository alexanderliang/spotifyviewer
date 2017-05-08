import React from 'react';
import {Button, Glyphicon} from 'react-bootstrap'

const ReturnLink = (props) => {
  var returnLink = window.location.origin + '/?' + props.player.currentUser+ ':'+  props.player.currentPlaylist
  if(props.player.currentUser){
    return (
      <div>
        <a href={returnLink}>
          <Button>Return Link</Button>
        </a>
      </div>
    )
  } else {
    return(
      <div>
        <div>
          <Glyphicon glyph="music" /> 
            Search for a playlist.
          <Glyphicon glyph="music" />
        </div>
      </div>)
  }
}

export default ReturnLink;

//      var returnLink = window.location.origin + '/?' + this.state.currentUser+ ':'+  this.state.currentPlaylist