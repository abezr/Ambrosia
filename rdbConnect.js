r.connect(config.rethinkdb, function(err, conn) {
  if(err) {
    console.log("Could not open a connection to initialize the database");
    console.log(err.message, conn);
    process.exit(1);
  }
  r.table('users').run(conn, function(err, result) {
      if (err) {
          // The database/table/index was not available, create them

          r.dbCreate(config.rethinkdb.db).run(conn, function(err, result) {
              if ((err) && (!err.message.match(/Database `.*` already exists/))) {
                  console.log("Could not create the database `" + config.db + "`");
                  console.log(err);
                  process.exit(1);
              }
              console.log('Database `' + config.rethinkdb.db + '` created.');

              r.tableCreate('users').run(conn, function(err, result) {
                  if ((err) && (!err.message.match(/Table `.*` already exists/))) {
                      console.log("Could not create the table `users`");
                      console.log(err);
                      process.exit(1);
                  }
                  console.log('Table `users` created.');


                  console.log("Table is available, starting koa...");

                  server.listen(port, () => {
                    console.log('app is listening on ' + port);
                  });
                  conn.close();
              });
          });
      } else {
          console.log("Table and index are available, starting koa...");
          server.listen(port, () => {
            console.log('app is listening on ' + port);
          });
      }
  });
});
