import koa from 'koa';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-gql';
import qs from 'koa-qs';
import serve from 'koa-serve';
import parseBody from 'co-body';
import path from 'path';

import React from 'react';
//import ReactRouter from 'react-router';

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

import {Schema} from './schema';

let port = process.env.PORT || 3000;
let routes = new koaRouter();
var server = koa();

// support nested query tring params
qs(server);

var compiler = webpack(require('../../webpack.config.js'));
server.use(WebpackDevMiddleware(compiler, {
  publicPath: '../../src/client',
  stats: {colors: true}
}));

var rdbConn = null;

//serve a static assets
server.use(serve('node_modules', '../../node_modules'));

server.use(function* (next) {
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

routes.get('/graphql', function* (next) {
  console.log('get graphql');
  var result = yield graphqlHTTP({schema: Schema, rootValue: this._rdbConn});
  console.log(result);
});
routes.post('/graphql', function* (next) {
  console.log('post graphql');
  yield graphqlHTTP({schema: Schema, rootValue: this_rdbConn});
});

server.use(routes.middleware());

server.use(function* (next) {
  console.log('root rendering');
  // var heroes = yield require('../client/components/heroes.jsx').then(function(node){
  //   return node;
  // });
  var root = React.createFactory(require('../client/components/html.jsx'));
  var hello = React.createFactory(require('../client/components/index.js'));
  var html = React.renderToStaticMarkup(root({
    markup: React.renderToString(hello({
      className: 'heroes'
    }))
  }));
  yield next;
  this.body = html;
});

// server.use(function* (next) {
//   //var root = React.createFactory(require('../client/components/html.jsx'));
//   var hello = React.createFactory(require('../client/components/index.js'));
//   var html = React.renderToString(hello({
//     className: 'hello'
//   }));
//   yield next;
//   this.body = html;
// });

server.use(function* (next) {
  this._rdbConn.close();
  yield next;
});

server.listen(port, () => {
  console.log('server is listening on ' + port);
});

//require('./rdbConnect');

module.exports = server;
