import React from 'react';

const ListItem = (props) => (
  <div onClick = {function(){props.clickSong(props.songObj)}}>
    {props.artist + ' - ' + props.songname}
  </div>
)

export default ListItem;