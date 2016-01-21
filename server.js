import koa from 'koa';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-gql';
import qs from 'koa-qs';
import serve from 'koa-static';
import session from 'koa-session';
import parseBody from 'co-body';
import path from 'path';
import {getUserByCredentials} from './server/database';

import co from 'co';
// import React from 'react';
// import Relay from 'react-relay';
// import ReactRouter from 'react-router';

import webpack from 'webpack';
import WebpackDevMiddleware from 'koa-webpack-dev-middleware';

import r from 'rethinkdb';
import {graphql} from 'graphql';
import debug from 'debug';
var config = {
  host: 'localhost',
  port: 28015,
  db: 'user'
};

var err = debug('server:error');
var log = debug('server');

import {usersSeed} from './seed/users';
import {restaurantsSeed} from './seed/restaurants';
import {ordersSeed} from './seed/orders';
import {ordersSeedById} from './seed/orders';

import {Schema} from './server/schema';

let port = process.env.PORT || 3800;
let routes = new koaRouter();
var server = koa();

// support nested query tring params
qs(server);

// var compiler = webpack(require('../../webpack.config.js'));
// server.use(WebpackDevMiddleware(compiler, {
//   publicPath: '/',
//   stats: {
//     colors: true
//   }
// }));

//set secret for cookies
server.keys = ['im a newer secret', 'i like turtle'];

//serve a static assets
server.use(serve('.'));

server.use(session(server));

server.use(function * (next) {
  yield r.connect(config, function(error, conn) {
    if (error) {
      err(error);
    } else {
      conn.use('user');
      this._rdbConn = conn;
    }
  }.bind(this));
  yield next;
});

server.use(function * (next) {
  yield next;
});
// server.use(mount('/graphql', graphqlHTTP({ schema: Schema })));
//
// routes.get('/login', function* (next) {
//   yield this.cookies.set('userID', this.query.userID);
//   console.log('server:login', this.query);
//   this.body = {cookie: 'well'};
// });

routes.post('/populate', function * (next) {
  console.log('populate');
  var geolocation = JSON.parse(this.query.params);
  yield usersSeed(this._rdbConn);
  yield restaurantsSeed(this._rdbConn, geolocation);
  yield ordersSeed(this._rdbConn);
  this.body = 'database populated';
});
import {fromGlobalId} from 'graphql-relay';
routes.post('/populate/order', function * (next) {
  console.log('populate/order');
  yield ordersSeedById(fromGlobalId(this.query.params).id, this._rdbConn);
  this.body = 'database populated';
});

routes.post('/graphql', function * (next) {
  yield graphqlHTTP({
    schema: Schema,
    rootValue: {
      conn: this._rdbConn,
      cookies: this.cookies
    }
  });
});

server.use(routes.middleware());

server.use(function * (next) {
  //let's try to pass the session object into a script tag
  var userID = this.cookies.get('userID') || '';
  yield next;
  this.body = `<!doctype html>
                <html>
                  <head>
                    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
                  </head
                  <body>
                    <div id = "app" data-userid= "${userID}"></div>
                  </body>
                <script src='/src/app.js'></script>
                </html>`;
});


server.use(function * (next) {
  this._rdbConn.close();
  yield next;
});

r.connect(config, function(error, conn) {
  if (error) {
    console.log('could not connect to rethinkdb');
    process.exit(1);
  } else {
    r.table('user').run(conn, function(err, result) {
      if (err) {
        console.log('creating user and restaurant tables');
        r.dbCreate(config.db).run(conn, function(err, result) {
          if ((err) && (!err.message.match(/Database `.*` already exists/))) {
            console.log("Could not create the database `" + config.db + "`");
            console.log(err);
            process.exit(1);
          }
          console.log('Database `' + config.db + '` created.');
          r.tableCreate('user').run(conn, function(err, result) {
            if ((err) && (!err.message.match(/Table `.*` already exists/))) {
              console.log("Could not create the table `users`");
              console.log(err);
              process.exit(1);
            }
            console.log('Table `users` created.');
            co(function * () {
              var p = new Promise((resolve, reject) => {
                r.tableCreate('restaurant').run(conn, function(err, result) {
                  if ((err) && (!err.message.match(/Table `.*` already exists/))) {
                    console.log("Could not create the table `users`");
                    console.log(err);
                    process.exit(1);
                  }
                  console.log('Table restaurant created');
                  //create location index on restaurant as well!
                  r.table('restaurant').indexCreate('userID').run(conn, function(err, result) {
                    if (err) {
                      console.log(err);
                      process.exit(1);
                    }
                    r.table('restaurant').indexCreate('location', {geo: true}).run(conn, (err, result) => {
                      if (err) {
                        console.log(err);
                        process.exit(1);
                      }
                      resolve(result);
                    });
                  });
                });
              });
              var q = new Promise((resolve, reject) => {
                r.tableCreate('order').run(conn, function(err, result) {
                  if ((err) && (!err.message.match(/Table `.*` already exists/))) {
                    console.log("Could not create the table `order`");
                    console.log(err);
                    process.exit(1);
                  }
                  console.log('Table order created');
                  r.table('order').indexCreate('userID').run(conn, function(err, result) {
                    if (err) console.log(err);
                    r.table('order').indexCreate('restaurantID').run(conn, function(err, result) {
                      if (err) {
                        console.log(err);
                        process.exit(1);
                      }
                      resolve(result);
                    });
                  });
                });
              });
              return yield[p, q];
            }).then((value) => {
              conn.close();
              server.listen(port, () => {
                console.log('server is listening on ' + port);
              });
            });
          });
        });
      } else {
        conn.close();
        server.listen(port, () => {
          console.log('server is listening on ' + port);
        });
      }
    });
  }
});

//require('./rdbConnect');

module.exports = server;
