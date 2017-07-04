import React from 'react';

const ListItem = (props) => (
  <div onClick = {function(){props.clickSong(props.songObj)}}>
    {props.listNumber + '. ' + props.artist + ' - ' + props.songname}
  </div>
)

export default ListItem;