import r from 'rethinkdb';
import config from '../config';

var users = [{name: 'Pablo', mail: 'pablo@gmail.com', password: 'Ambrosia68'}, {name: 'Martine', mail: 'martine@gmail.com', password: 'Ambrosia68'}, {name: 'JeanChat', mail: 'jeanchat@gmail.com', password: 'Ambrosia68'}, {name: 'Locat', mail: 'locat@gmail.com', password: 'Ambrosia68'}, {name: 'Duduche', mail: 'duduche@gmail.com', password: 'Ambrosia68'}, {name: 'Totto', mail: 'totto@gmail.com', password: 'Ambrosia68'}, {name: 'Amber', mail: 'amber@gmail.com', password: 'Ambrosia68'}, {name: 'Adrien', mail: 'adrien@gmail.com', password: 'Ambrosia68'}];

export var usersSeed = (conn) => {
  return r.table('user').insert(users).run(conn, (err, res) => {
    if(err) {
      console.log('error inserting new user');
      process.exit(1);
    }
    return res;
  });
};
