import React, { Component } from 'react'

import './contact.css'

// the component managing the group selection of the contact
class GroupSelect extends Component
{
  constructor(props)
  {
    super(props);
    var grid =0;
    if(props.value !== 0) grid = props.value
    this.state ={items: [], selectValue:grid};
    //bind the handleChange with the component (allow to get this in handleChange)
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    const requestOptions = {
      method: 'GET',
      headers: {"Content-type": "application/json"}
    };
    //const url = process.env.REACT_APP_URL_API
    const url = window._env_.API_URL;  
    fetch(url + "/api/v1/groups", requestOptions).then((response) => {
      return response.json();
    }).then((result) => {
      var items = [];
      for (const [index,value] of result.entries()){
        items.push(<option key={index} value={value.id}>{value.name}</option>)
      }
      this.setState({items: items})
    })
  }

  UNSAFE_componentWillReceiveProps(props)
  {
    this.setState({selectValue:props.value})
  }

  getValue()
  {
    return this.state.selectValue;
  }

  handleChange(e){
    this.setState({selectValue:e.target.value});
  }

  render(){
    var data = this.state.items;
    return(
      <select name="group" value={this.state.selectValue} onChange={this.handleChange} >
        <option key='gs0' value='0'>no group</option>
        {data}
      </select>
    )
  }
}
// the component showing the details of a contact
class ContactDetail extends Component{
  constructor(props)
  {
    super(props);
    this.state ={"grid":"3"}
  }
  // initialises the component
  // action depend of mode : update or create
  componentDidMount() {
    var s = window.location.search;
    // chech if we are in update mode or create mode
    // in case of update mode, value of the contact should retrieved and populated on the page
    if (s !== "")
    {
      var ids= s.substring(s.lastIndexOf("=") + 1)
      var id = parseInt(ids,10)
      //var url = process.env.REACT_APP_URL_API + "/api/v1/contacts/" + id;
      const url = window._env_.API_URL + "/api/v1/contacts/"+id;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      const requestOptions = {
        method: "GET",
        headers: headers
      };
      // Note: I'm using arrow functions inside the `.fetch()` method.
      // This makes it so you don't have to bind component functions like `setState`
      // to the component.
      fetch(url, requestOptions).then((response) => {
        return response.json();
      }).then((result) => {
       this.setState({"method":"PUT","url":url,"name": result.name, "firstname": result.firstname, "phonenumber":result.phonenumber,"email":result.email,"grid":result.groupid})
      });
    }
    else {
      //const url = process.env.REACT_APP_URL_API + "/api/v1/contacts"
      const url = window._env_.API_URL + "/api/v1/contacts/";
      this.setState({"method":"POST","url":url,"name":"","firstname": "", "phonenumber":"","email":"","grid":0})
    }
  }
  // handle the submit action
  handleSubmit(name,firstname,phonenumber,email,group)
  {
    var payload = {}
    if (name !== "") {payload.name=name;}
    if (firstname !== "") {payload.firstname=firstname;}
    if (phonenumber !== "") {payload.phonenumber=phonenumber;}
    if (email !== "") {payload.email=email;}
    var grid = parseInt(group,10)
    if (grid !== 0) {payload.groupid=grid;}
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const requestOptions = {
      method: this.state.method,
      headers: headers,
      body: JSON.stringify(payload)
    };
    // Note: I'm using arrow functions inside the `.fetch()` method.
    // This makes it so you don't have to bind component functions like `setState`
    // to the component.
      fetch(this.state.url, requestOptions).then((response) => {
      return response.json();
    }).then((result) => {
     // do what you want with the response here
     window.location.href = "/contact"
   });
  }

  handleChangeN(event) {
    this.setState({name: event.target.value})
  }
  handleChangeF(event) {
    this.setState({firstname: event.target.value})
  }
  handleChangeP(event) {
    this.setState({phonenumber: event.target.value})
  }
  handleChangeE(event) {
    this.setState({email: event.target.value})
  }
  handleChangeG(event) {
    this.setState({grid: event.target.value})
  }
  // render the component
  render(){
    var mygrid = this.state.grid
    return(
      <div>
        <div className="title">Contact Details</div>
        <div className="text">
          <table className="detail">
            <tbody>
              <tr>
                <td className="first1" > Name: </td><td> <input type="text" name="name" ref={(input) => this.name = input} value={this.state.name} onChange={this.handleChangeN.bind(this)}/> </td>
              </tr>
              <tr>
                <td className="first1">firstname: </td><td> <input type="text" name="firstname" ref={(input) => this.firstname = input} value={this.state.firstname} onChange={this.handleChangeF.bind(this)}/> </td>
              </tr>
              <tr>
                <td className="first1">Phone number:</td><td>  <input type="text" name="phonenumber" ref={(input) => this.phonenumber = input} value={this.state.phonenumber} onChange={this.handleChangeP.bind(this)}/> </td>
              </tr>
              <tr>
                <td className="first1">Email: </td><td> <input type="text" name="email" ref={(input) => this.email = input} value={this.state.email} onChange={this.handleChangeE.bind(this)}/> </td>
              </tr>
              <tr>
                <td className="first1">Group: </td><td><GroupSelect ref={(input) => this.select = input} value={mygrid} onChange={this.handleChangeG.bind(this)}/> </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bcenter">
          <button onClick={() => {window.location.href = "/contact"}}> Cancel </button>
          <button onClick={() => {this.handleSubmit(this.name.value, this.firstname.value, this.phonenumber.value, this.email.value, this.select.getValue()) }}> submit </button>
        </div>
      </div>
    )
  }
}

export default ContactDetail
