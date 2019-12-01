import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

import GroupList from './components/group.js'
import ContactList from './components/contact.js'
import ContactDetail from './components/contactdetail.js'

import './index.css'

const routing = (
  <Router>
    <div>
      <Link className="link" to="/contact">Contact</Link> <Link className="link" to="/group">Group</Link>
    </div>
    <div>
      <Route exact path="/" component={ContactList} />
      <Route path="/contact" component={ContactList} />
      <Route path="/group" component={GroupList} />
      <Route path="/contactdetail" component={ContactDetail} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))
