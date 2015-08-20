import request from 'superagent';
import Debug from 'debug';

var debug = new Debug('client:query');
var userId = '559645cd1a38532d14349246';

request
  .get('http://localhost:3000/graphql')
  .query({
    query: `{
      user(id: "${userId}") {
        name
        id
        friends (first: 3){
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }`
  })
  .end(function (err, res) {
    if(err) {
      debug('ERROR');
    } else {
      debug('body', res.body, res.body.data.user.friends);
    }
  });
