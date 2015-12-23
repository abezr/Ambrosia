import r from 'rethinkdb';
import config from '../config';

r.connect(config.rethinkdb, function(error, conn) {
  if (error) {
    console.log('could not connect to rethinkdb');
    process.exit(1);
  } else {
    r.table('user').run(conn, function(err, result) {
      if (err) {
        console.log('create user db and table');
        r.dbCreate(config.rethinkdb.db).run(conn, function(err, result) {
          if ((err) && (!err.message.match(/Database `.*` already exists/))) {
            console.log("Could not create the database `" + config.rethinkdb.db + "`");
            console.log(err);
            process.exit(1);
          }
          console.log('Database `' + config.rethinkdb.db + '` created.');

          r.tableCreate('user').run(conn, function(err, result) {
            if ((err) && (!err.message.match(/Table `.*` already exists/))) {
              console.log("Could not create the table `users`");
              console.log(err);
              process.exit(1);
            }
            console.log('Table `users` created.');
          });
          r.tableCreate('restaurant').run(conn, function(err, result) {
            if ((err) && (!err.message.match(/Table `.*` already exists/))) {
              console.log("Could not create the table `users`");
              console.log(err);
              process.exit(1);
            }
            console.log('Table restaurant created');
            r.table('restaurant').indexCreate('userID').run(conn);
          });
          r.tableCreate('order').run(conn, function(err, result) {
            if ((err) && (!err.message.match(/Table `.*` already exists/))) {
              console.log("Could not create the table `order`");
              console.log(err);
              process.exit(1);
            }
            r.table('order').indexCreate('userID').run(conn);
            r.table('order').indexCreate('restaurantID').run(conn);
            console.log('Table `order` created.');
          });
        });
      }
      conn.close();
    });
  }
});
