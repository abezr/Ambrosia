require('../stylesheets/mobile.scss');

import {
  IndexRoute,
  browserHistory,
  Route
} from 'react-router';
import MobileIndexContainer from './components/mobile/mobileindex';
import {Index} from './components/index';
import Login from './components/login';
import RestaurantsIndex, {RestaurantsIndexComponent} from './components/restaurantsindex';

import RestaurantsMap from './components/restaurantsmap';
import RestaurantsList from './components/restaurantslist';
import Home from './components/home';
import Start from './components/start/start';
import StartCard from './components/start/card';
import StartSettings from './components/start/settings';
import StartMap from './components/start/map';
import StartSubmit from './components/start/submit';
import Board from './components/board/board';
import BoardTimeLine from './components/board/timeline';
import BoardCardIndex from './components/board/cardindex';
import BoardCard from './components/board/card';
import BoardSettings from './components/board/settings';
import Ordering from './components/ordering';
import Profile from './components/profile';
import React from 'react';
import ReactDom from 'react-dom';
import {createHistory} from 'history';
import Relay from 'react-relay';
// import rootQuery from '../indexroute.js';
import { RelayRouter } from 'react-router-relay';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin'
  })
);

const ViewerQuery = {
  user: () => Relay.QL `query { root }`
};

ReactDom.render(
  <RelayRouter history={browserHistory}>
    <Route path='/' component={MobileIndexContainer} queries={ViewerQuery}>
      <IndexRoute component={Home}/>
      <Route path="register" component={Login} queries={ViewerQuery} />
    </Route>
  </RelayRouter>, document.getElementById('app')
)
