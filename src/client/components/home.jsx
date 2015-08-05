import React from 'react'
import ReactRouter from 'react-router');
var RouteHandler = ReactRouter.RouteHandler;

var Home = React.createClass({
  render: function() {
    return (
      <h1>Ambrosia</h1>
      <RouteHandler/>
    );
  }
});

module.exports = Home;
export default Home;
