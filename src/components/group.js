import React, { Component } from 'react'
import './group.css'

 class CreateGroupItem extends Component {
   // constructor
   constructor(props){
     super(props);
     this.myparent = props.inputref;
   }
   // handle the create event
   onCreate(name){
     //Check first if a name is provided to create the new group
     //if no name is provided, display an alert and immediate return
     if(name==="") {
       alert("Please, enter a name for the new group");
       return;
     }
     // get the parent compoment used to send the refresh of the list after having  creating a new group
     var parent = this._reactInternalFiber._debugOwner.stateNode;
     // make the POST API call to create the group
     const requestOptions = {
      method: 'POST',
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        name: name})
    };
    //const url = process.env.REACT_APP_URL_API
    const url = window._env_.API_URL; 
    fetch(url + "/api/v1/groups", requestOptions).then((response) => {
       return response.json();
     }).then((result) => {
       // ask to refresh the displayed list
       parent.handleCreate();
     })
   }
   // display the html elements used to create a new group (input +  button)
   render(){
     return(
       <div className="text">
         Create a new group: <input className="create" type="text" name="newgroupname" ref={(input) => this.textInput = input}/>
         <button className="create" onClick={() => {this.onCreate(this.textInput.value) }} >Create</button>
       </div>
     )
   }
 }

// the component used to display one group in the list
 function GroupItem(props)
 {
   return(
     <div className="groupitem">
       name: <b>{props.name}</b> id: {props.index} <button onClick={() => {props.onDelete(props.index) }} className="rightbutton">delete</button>
       <button onClick={() => {props.onUpdate(props.index, props.name, props.rank) }} className="rightbutton">Update</button>
       <hr size='1'/>
     </div>
   )
 }

// the component Grouplist that display a list of groups and all the compoantns needed to manage it
 class GroupList extends Component {
   constructor(){
     super();
     this.state ={groups: []};
     this.myRef = React.createRef();
   }

  // load the data of the component by making an API call
  componentDidMount() {
    this.getAllGroups()
  }
  // make the API call to get all the groups
  getAllGroups()
  {
    //const url = process.env.REACT_APP_URL_API
    const url = window._env_.API_URL; 
    fetch(url+'/api/v1/groups')
    .then(res => res.json())
    .then((data) => {
      this.setState({groups: data})
    })
    .catch(console.log)
  }

  handleCreate() {
    this.getAllGroups()
  }

//  handleDelete manage the delete request of a group
// index the id of the group to delete
  handleDelete = index =>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const requestOptions = {
      method: 'DELETE',
      headers: headers,
    };
    // Note: I'm using arrow functions inside the `.fetch()` method.
    // This makes it so you don't have to bind component functions like `setState`
    // to the component.
    //const url = process.env.REACT_APP_URL_API
    const url = window._env_.API_URL; 
    fetch(url + "/api/v1/groups/" + index, requestOptions).then((response) => {
      return response.json();
    }).then((result) => {
      if(result === 1)
      {
        // refresh the data array by calling the GET all group API
        this.getAllGroups()
      }
     console.log(result);
    });
  }

  // Execute the update of a group by calling API
  // id id of the group
  // name current name of the group
  // rank the rank of the group inside the data array managed by the component
  handleUpdate = (id, name, rank) =>{
    var nname = prompt("Modify the name of the group", name);
    const requestOptions = {
     method: 'PUT',
     headers: {"Content-type": "application/json"},
     body: JSON.stringify({
       name: nname})
   };
   //const url = process.env.REACT_APP_URL_API
   const url = window._env_.API_URL; 
   fetch(url + "/api/v1/groups/" + id, requestOptions).then((response) => {
      return response.json();
    }).then((result) => {
      //here, I modify the data array containing the group rather to do another call to GET all groups API
      // I do it just to do a test
      var data = this.state.groups;
      data[rank]=result;
      this.setState({group: data})
    })
  }

  render() {
      //generate an array with the list elements
      // no loop inside the return function
      const items = [];
      for (const [index,value] of this.state.groups.entries()){
        items.push(<GroupItem key={index} rank={index} name={value.name} index={value.id} onDelete={this.handleDelete} onUpdate={this.handleUpdate}/>)
      }
      return (
        <div ref={this.myRef} >
          <div className="title"> Group List </div>
          <br/>
          <div className="text"> Manage the list of groups </div>
          <br/>
          <CreateGroupItem inputref={this.myref}/>
          <br/>
          <div className="text">Group count : {items.length}</div><br/>
          <div className="item-list" >{items}</div>
        </div>
    )
  }
}

export default GroupList
