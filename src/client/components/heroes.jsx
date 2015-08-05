var React = require('react');
var relay = require('../../relay.jsx');
var Relay = new relay();
var debug = require('debug');
var log = debug('component:heroes');

//the default id to use for test
var id = '559645cd1a38532d14349246';

var Hero = React.createClass({
  statics: {
    query: `name
            id
            friends{
              name
              id
            }`
  },
  render: function () {
    var createFriends = function (friend) {
      return <friend name={friend.name} id={friend.id}/>;
    }
    return (
    <div>
      <h1>{this.props.name}</h1>
      <div>{this.props.friends.map(createFriends)}</div>
    </div>
    );
  }
});

var heroes = React.createClass({
  statics: {
    query: `{
      users {
        ${Hero.query}
      }
    }`
  },
  render: function () {
    var createHeros = function (hero) {
      return <Hero name={hero.name} id={hero.id} friends={hero.friends}/>;
    }
    return (
    <div>
      <h1>Here are all the Star-Wars main Figure</h1>
      <div>{this.props.heros.map(createHeros)}</div>
    </div>
    );
  }
});
//Heroes is a promise that resolve with .then(function(value){}, function(err){});
var Heroes = Relay.createContainer(heroes);

var friend = React.createClass({
  render: function () {
    <div>
      {this.props.name}<br/>
    </div>
  }
});

module.exports = Heroes;
export default Heroes;
