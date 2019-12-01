import React, { Component } from 'react'

import './contact.css'

// the component used to display a contact in the ContactList component
function ContactItem(props)
{
  //check the values of some props attribute in order to avoid display an null / empty attribute
  var phn = ""
  if(props.phonenumber !== ""){
    phn=<div>Phone number: {props.phonenumber}<br/></div>;
  }
  var grp = ""
  if(props.groupname !== ""){
    grp=<div>Group: {props.groupname}</div>;
  }
  var email = ""
  if(props.email !== ""){
    email=<div>Email: {props.email}</div>;
  }
  return(
    <div className="contactitem">
      <table width="100%" >
        <tbody>
        <tr className="container">
          <td className="first">
            <b>{props.name} , {props.firstname}</b><br/>
            id:{props.index}<br/>
            {phn}
            {email}
            {grp}
            </td>
            <td className="second">
                <button className="rightbutton" onClick={() => {props.onDelete(props.index) }}>delete</button>
                <button className="rightbutton" onClick={() => {window.location.href = "/contactdetail?id="+props.index}}>Update</button>
            </td>
          </tr>
          </tbody>
      </table>
      <hr size='1'/>
    </div>
  )
}

// the ContactList component
class ContactList extends Component{
  constructor(){
    super();
    this.state ={contacts: []};
  }
  // initializes the component
  componentDidMount() {
    this.getAllContacts()
  }
  // get all the contacts by maki the API call
  getAllContacts()
  {
    //const url = process.env.REACT_APP_URL_API
    const url = window._env_.API_URL;
    fetch(url + '/api/v1/contacts')
    .then(res => res.json())
    .then((data) => {
      this.setState({contacts: data})
    })
    .catch(console.log)
  }
  //  handleDelete(index)
  handleDelete = index =>{
      console.log(this);
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
      fetch(url + "/api/v1/contacts/" + index, requestOptions).then((response) => {
        return response.json();
      }).then((result) => {
        if(result === 1)
        {
          this.getAllContacts()
        }
        else{
          alert("an error occurs during the delete action")
        }
      });
    }
  // render the components
  render(){
    //compute the list of HTML / React component
    const items = [];
    for (const [index,value] of this.state.contacts.entries()){
      items.push(<ContactItem key={index} rank={index} firstname={value.firstname} name={value.name} index={value.id} email={value.email} phonenumber={value.phonenumber} groupname={value.groupname} onDelete={this.handleDelete}/>)
    }
    return(
      <div>
        <div className="title">Contact</div>
        <br/>
        <div className="text"> Contacts count: {this.state.contacts.length}</div>
        <div className="text"> Create new contact : <button onClick={() => {window.location.href = "/contactdetail"}}> Create </button></div>
        <div className="item-list">{items}</div>
      </div>)
  }
}

export default ContactList
