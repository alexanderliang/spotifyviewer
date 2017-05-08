import React from 'react';
import {Glyphicon} from 'react-bootstrap'

const Search = (props)=>(
    <div>
      <form>
        <input type="text" value={props.text} id="searchfield" onChange={props.handleChange}/>
        <input type="button" value="Submit" onClick={()=>{props.getVideos(document.getElementById("searchfield").value)}}/>
      </form>
    </div>

  )



// class Search extends React.Component{ 
//   constructor(props){
//     super(props)
//     this.state = {
//       text : 'Spotify Playlist URI'
//     }
//     this.handleChange = this.handleChange.bind(this)
//   }

//   handleChange(event){
//     console.log(props)
//     this.setState({value: event.target.value})
//   }

//   render(){
//   return (
//     <div>
//       <form>
//         <input type="text" value={this.state.text} onChange={this.handleChange}/>
//         <input type="button" value="Submit" onClick={()=>{props.getVideos(this.state.text)}}/>
//       </form>
//     </div>
//   )}
// }

export default Search;