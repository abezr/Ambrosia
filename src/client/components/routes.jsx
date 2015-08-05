'use strict';
var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;
var Home = require('./home.jsx');
var Index = require('./index.jsx');
var Open = require('./openarestaurant.jsx');
var Board = require('./board.jsx');

var routes = (
  <Route name="app" path="/" handler={Home}>
    <DefaultRoute name='index' handler={Index}/>
    <Route path='/open/1st-step' handler={Open.firstStep}/>
    <Route path='/open/2nd-step' handler={Open.secondStep}/>
    <Route path='/open/3rd-step' handler={Open.thirdStep}/>
  </Route>
);

module.exports = routes;
