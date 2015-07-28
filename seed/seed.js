import r from 'rethinkdb';
import config from '../config';
// seed users

var users = [

  {
    id: '559645cd1a38532d14349240',
    name: 'Han Solo',
    friends: []
  },

  {
    id: '559645cd1a38532d14349241',
    name: 'Chewbacca',
    friends: ['559645cd1a38532d14349240']
  },

  {
    id: '559645cd1a38532d14349242',
    name: 'R2D2',
    friends: ['559645cd1a38532d14349246']
  },

  {
    id: '559645cd1a38532d14349246',
    name: 'Luke Skywalker',
    friends: ['559645cd1a38532d14349240', '559645cd1a38532d14349242']
  }
];

r.connect(config.rethinkdb, function(error, conn) {
  if (error) {
    err(error);
  } else {
    r.table('user').insert(users).run(conn, function(err, result) {
      if(err) console.log(err);
      conn.close();
    });
  }
});
