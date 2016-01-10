import {ordersSeed} from './orders';
import r from 'rethinkdb';
var config = {
  host: 'localhost',
  port: 28015,
  db: 'user'
};
r.connect(config, function(error, conn) {
  if (error) {
    err(error);
  } else {
    conn.use('user');
    ordersSeed(conn);
  }
});
