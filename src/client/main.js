require('../../stylesheets/home.scss');

import {
  IndexRoute,
  Router,
  Route
} from 'react-router';
import IndexContainer from './components/index';
import {Index} from './components/index';
import Login from './components/login';
import Users from './components/users';
import Start from './components/start';
import Card from './components/board/card';
import Board from './components/board/timeline';
import Settings from './components/board/settings';
import ChiefIndex from './components/board/chiefindex';
import Restaurants from './components/restaurants';
import Ordering from './components/ordering';
import Profile from './components/profile';
import React from 'react';
import ReactDom from 'react-dom';
import {createHistory} from 'history';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import ReactRouterRelay from 'react-router-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin',
  })
);

const histori = createHistory();

var ViewerQuery = {
  user: (Component) => Relay.QL `
  query {
    root {
      ${Component.getFragment('user')},
    },
  }
  `
};

var RestaurantQuery = {
  restaurant: (Component) => Relay.QL `
  query {
    root (id: $id) {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};

var RestaurantsQuery = {
  restaurant: (Component) => Relay.QL `
  query {
    root {
      ${Component.getFragment('restaurant')}
    }
  }
  `
};
//I pass restaurant id to root and then from root to restaurant in the schema.js field
var FullQuery = {
  user: (Component) => Relay.QL`
  query {
    root (id: $id) {
      ${Component.getFragment('user')}
    },
  }
  `,
  restaurant: (Component) => Relay.QL`
  query {
    root (id: $id) {
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
    <Route path='/' component={IndexContainer}  queries={ViewerQuery}>
      <IndexRoute component={Users} queries={ViewerQuery} />
      <Route path='restaurant/:id' component={Ordering} queries={FullQuery}/>
      <Route path='profile' component={Profile} queries={ViewerQuery}/>
      <Route path="restaurants" component={Restaurants} queries={RestaurantsQuery} />
      <Route path="start" component={Start} queries={ViewerQuery} />
      <Route path="register" component={Login} queries={ViewerQuery} />
      <Route path="board/:id" component={ChiefIndex} queries={FullQuery}>
        <Route path="/settings/:id" component = {Settings} queries={RestaurantQuery} />
        <Route path="/timeline/:id" component = {Board} queries={RestaurantQuery}/>
        <Route path="/card/:id" component = {Card} queries={RestaurantQuery}/>
      </Route>
    </Route>
  </Router>, document.getElementById('app'));
