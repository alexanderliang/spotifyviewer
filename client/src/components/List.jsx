import React from 'react';
import ListItem from './ListItem.jsx';

const List = (props) => (
  <div>
    <h4> Songs </h4>
    <div id = "songlist">
    {console.log(Array.isArray(props.items))}
    {props.items.map((item, i)=>{
      return <ListItem songObj={item} songname={item.title} artist={item.artist} clickSong={props.clickSong} key={i} listNumber={i + 1} />
    })}
    </div>
  </div>
)


export default List;