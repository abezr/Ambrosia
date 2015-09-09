import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:mutation');
var mail = 'thib.duchene@gmail.com';
var password = 'zlerghzdfvq';
var names = ['Doe', 'Smith', 'Winston', 'Lee', 'Foo', 'Bar'];
var name = names[Math.floor(Math.random() * names.length)];

request
  .post('http://localhost:3000/graphql')
  .query({
    query: `
    mutation M($mail: String! $name: String! $password: String!) {
      Signup(name: "${name}" mail: "${mail}" password: "${password}") {
        name
      }
    }
    `,
    params: {
      mail: mail,
      name: name,
      password: password
    }
  })
  .end(function (err, res) {
    debug(err || res.body);
    debug(res.body.errors.map(function(error) {
      return error.locations;
    }));
  });
