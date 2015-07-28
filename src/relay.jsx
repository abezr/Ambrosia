var request = require('superagent');
var React = require('react');
var Debug = require('debug');
var co = require('co');

var debug = new Debug('relay');

var Relay = {};

// function Relay (opt) {
//   this.components = [];
//   this.currentData = {};
//   this.queryPath = opt.queryPath;
//   this.mutationPath = opt.mutationPath;
// }

// Relay.prototype.createParentContainer = function (component) {
//   component.componentWillMount = function () {
//     this.queryString = component.query;
//     this.query(this.queryString);
//   }.bind(this);
// }

Relay.createContainer = function (component) {
  var that = this;
  return React.createClass({
    componentWillMount: function () {
      that.query(component.query).then(function(query) {
        this.query = query;
      }.bind(this));
    },
    render: function () {
      return <component {...this.query}/>
    }
  });
  //this.components[component.name] = component; //register all component to build query
}

Relay.mutation = function (string, params) {
  request
    .post(this.mutationPath)
    .send({
      query: string,
      params: params
    })
    .end(function (err, res) {
      debug(err || res.body);
      debug('data well inserted', res.body);
    });
}

Relay.query = co(function*(string, params) { //we sould turn back the returned result into a promise
  var query = yield request
    .get('http://localhost:3000/data')
    .query({
      query: string
    })
    .end(function (err, res) {
      debug(err || res.body);
      debug('successfull query', res.body);
    });
  return query;
});

module.exports = Relay;
