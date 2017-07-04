import React from 'react';

const Search = (props)=>(
    <div>
      <form>
        <input type="text" value={props.text} id="searchfield" onChange={props.handleChange}/>
        <input type="button" value="Submit" onClick={()=>{props.getVideos(document.getElementById("searchfield").value)}}/>
      </form>
    </div>

  )

export default Search;