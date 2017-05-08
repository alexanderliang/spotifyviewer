import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4> Songs </h4>
    <div id = "songlist">
    {console.log(Array.isArray(props.items))}
    {props.items.map((item)=>{
      return <ListItem songObj={item} songname={item.title} artist={item.artist} clickSong={props.clickSong}/>
    })}
    </div>
  </div>
)


export default List;