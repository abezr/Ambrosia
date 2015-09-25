require('../../stylesheets/home.scss');

import {
  IndexRoute,
  Router,
  Route
} from 'react-router';
import Index from './components/index';
import Login from './components/login.js';
import Users from './components/users.js';
import React from 'react';
import ReactDom from 'react/lib/ReactDOM';
import createHashHistory from 'history/lib/createHashHistory';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import ReactRouterRelay from 'react-router-relay';

const histori = createHashHistory({queryKey: false});

var ViewerQuery = {
  user: (Component) => Relay.QL `
  query {
    user {
      ${Component.getFragment('user')},
    },
  }
  `
};


ReactDom.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={histori}
  >
    <Route path="/" component={Index} queries={ViewerQuery} renderFailure={function(error, retry) { console.log(error); }} >
      <IndexRoute component={Login} queries={ViewerQuery} />
      <Route path="users" component={Users} queries={ViewerQuery} />
    </Route>
  </Router>, document.getElementById('app'));
