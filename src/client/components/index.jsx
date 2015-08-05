import React from 'react';

var Restos = React.createClass({
  statics: {
    query: `{
      restos {
        ${Resto.query}
      }
    }`
  },
  render: function () {
    var createResto = function (resto) {
      return <Resto name={resto.name} key={resto.id}/>
    }
    return (
      <div>
        <h2>Here are all the Restaurants registered</h2>
        <div>{this.props.restos.map(createResto)}</div>
      </div>
    );
  }
});

var Resto = React.createClass({
  statics: {
    query: `{
      name
      id
    }`
  },
  render: function () {
    <div>{this.props.name}</div>
  }
});
