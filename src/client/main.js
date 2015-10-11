require('../../stylesheets/home.scss');

import {
  IndexRoute,
  Router,
  Route
} from 'react-router';
import IndexContainer from './components/index';
import {Index} from './components/index';
import Login from './components/login.js';
import Users from './components/users.js';
import Start from './components/start.js';
import Restaurants from './components/restaurants.js';
import Restaurant from './components/restaurant.js';
import React from 'react';
import ReactDom from 'react/lib/ReactDOM';
import {createHistory} from 'history';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import ReactRouterRelay from 'react-router-relay';

// Relay.injectNetworkLayer(
//   new Relay.DefaultNetworkLayer('/graphql', {
//     headers: {
//       'Cookie': 'user=thibaut',
//     },
//   })
// );

const histori = createHistory();
window.userID = document.getElementById('app').dataset.userid;

var ViewerQuery = {
  user: (Component) => Relay.QL `
  query {
    root {
      ${Component.getFragment('user')},
    },
  }
  `
};
//I pass restaurant id to root and then from root to restaurant in the schema.js field
var RestaurantQuery = {
  // user: (Component) => Relay.QL`
  // query {
  //   root(id: $id) {
  //     ${Component.getFragment('user')}
  //   },
  // }
  // `,
  restaurant: (Component) => Relay.QL`
  query {
    root(id: $id) {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};

ReactDom.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={histori}
  >
    <Route path='/' component={IndexContainer}  queries={ViewerQuery} renderFailure={function(error, retry) { console.log(error); }}>
      <IndexRoute component={Users} queries={ViewerQuery} />
      <Route path='restaurant/:id' component={Restaurant} queries={RestaurantQuery}/>
      <Route path="restaurants" component={Restaurants} queries={ViewerQuery} />
      <Route path="start" component={Start} queries={ViewerQuery} />
      <Route path="register" component={Login} queries={ViewerQuery} />
    </Route>
  </Router>, document.getElementById('app'));
