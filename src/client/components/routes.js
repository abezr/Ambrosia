'use strict';
import React from 'react';
import Relay from 'react-relay';
import { Router, Route } from 'react-router';
import RelayNestedRoutes from 'relay-nested-routes';
import Index from './index';

var NestedRootContainer = RelayNestedRoutes(React, Relay);
// var Open = require('./openarestaurant.jsx');
// var Board = require('./board.jsx');
import indexRoute from '../../indexroute';
var Query = indexRoute(1);
var routes = (
  <Route component= {NestedRootContainer}>
    <Route name='index' path="/" component={Index} queries={Query}/>
  </Route>
);

module.exports = routes;
