var request = require('superagent');
var React = require('react');
var Debug = require('debug');
var co = require('co');

var log = new Debug('relay');

function Relay(opt) {}

// Relay.prototype.createParentContainer = function (component) {
//   component.componentWillMount = function () {
//     this.queryString = component.query;
//     this.query(this.queryString);
//   }.bind(this);
// }

Relay.prototype.createContainer = function(Component) {
//if(!Loading) Loading = <div>Loading page...</div>;
  var that = this;
  var p = new Promise(function(resolve, reject) {
    that.query(Component.query).then(function(data) {
      console.log('Relay:createContainer', data);
      var node = React.createClass({
        render: function() {
          return (
            <Component heros={data.data.users}/>
          );
        }
      });
      resolve(node);
    });
  });
  return p;
//console.log('Relay:createContainer', data);
} //this.components[component.name] = component; //register all component to build query
Relay.prototype.mutation = function(string, params) {
  log('mutation');
  request.post(this.mutationPath).send({
    query: string,
    params: params
  }).end(function(err, res) {
    debug(err || res.body);
    debug('data well inserted', res.body);
  });
};

Relay.prototype.query = function(string, params) { //I should turn back the returned result into a promise
// return co(function* () {
//   yield request.get('http://localhost:3000/data').query({
//     query: string
//   }).end(function(err, res) {
//     return (err || res.body);
//   });
// });
  var p = new Promise(function(resolve, reject) {
    request.get('http://localhost:3000/data').query({
      query: string
    }).end(function(err, res) {
      resolve(res.body);
      reject(err);
    });
  });
  return p;
};

module.exports = Relay;
export default Relay;
