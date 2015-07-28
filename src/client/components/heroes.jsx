var React = require('react');
var Relay = require('../../relay.jsx');

var Heroes = Relay.createContainer(heroes);
var heroes = React.createClass({
  statics: {
    query: `query{
      user {
        ${hero.query}
      }
    }`
  },
  render: function () {
    createHeros = function (hero) {
      return <hero name={hero.name} id={hero.id}/>
    }
    <div>
      <h1>Here are all the Star-Wars main Figure</h1>
      <div>{this.props.heros.map(createHeros(hero))}</div>
    </div>
  }
});

var hero = React.createClass({
  statics: {
    query: `name
            id
            `
  },
  render: function () {
    createFriends = function (friend) {
      return<friend name={friend.name} id={hero.id}/>
    }
    <div>
      <h1>{this.props.name}</h1>
      <div>{this.props.friends.map(createFriends(friend))}</div>
    </div>
  }
});

var friend = React.createClass({
  render: function () {
    <div>
      {this.props.name}<br/>
    </div>
  }
});

module.exports = Heroes;
export default Heroes;
