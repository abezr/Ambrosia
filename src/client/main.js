require('../../stylesheets/home.scss');

import {
  Router,
  Route
} from 'react-router';
import Index from './components/index';
import login from './components/login.js';
import React from 'react';
import ReactDom from 'react/lib/ReactDOM';
import BrowserHistory from 'react-router/lib/BrowserHistory';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import ReactRouterRelay from 'react-router-relay';


var ViewerQuery = {
  user: (Component) => Relay.QL `
  query {
    user(id: $id) {
      ${Component.getFragment('user') },
    },
  }
  `
};

ReactDom.render(
  <Router createElement={ReactRouterRelay.createElement} history={new BrowserHistory()}>
    <Route name="home" // added a name to the route
      path="/home/:id" component={Index} queries={ViewerQuery} // and the query
      renderFailure={function(error, retry) { Router.transitionTo('/login');}}/>
    <Route/>
    <Route name="login"
      path="/login" component={login}/>
  </Router>, document.getElementById('app'));
