import koa from 'koa';
import koaRouter from 'koa-router';

import React from 'react';
//import ReactRouter from 'react-router';
import qs from 'koa-qs';
import parseBody from 'co-body';

import r from 'rethinkdb';
import {
  graphql
} from 'graphql';
import debug from 'debug';
var config = {
  host: 'localhost',
  port: 28015,
  db: 'user'
};

var err = debug('server:error');
var log = debug('server');

import schema from './schema';

let port = process.env.PORT || 3000;
let routes = new koaRouter();
var server = koa();

// support nested query tring params
qs(server);

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

routes.get('/data', function* () {
  var query = this.query.query;
  console.log('server:get', query);
  var resp = yield graphql(schema, query, this._rdbConn);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }
  this.body = resp;
});

routes.post('/data', function* () {
  console.log('post data');
  var payload = yield parseBody(this);
  var resp = yield graphql(schema, payload.query, this._rdbConn, payload.params);

  if (resp.errors) {
    this.status = 400;
    this.body = {
      errors: resp.errors
    };
    return;
  }

  this.body = resp;
});

server.use(routes.middleware());


server.use(function* (next) {
  console.log('root rendering');
  var heroes = yield require('../client/components/heroes.jsx').then(function(node){
    return node;
  });
  var root = React.createFactory(require('../client/components/html.jsx'));
  var Heroes = React.createFactory(heroes);
  var html = React.renderToStaticMarkup(root({
    markup: React.renderToString(Heroes({
      className: 'heroes'
    }))
  }));
  yield next;
  this.body = html;
});

server.use(function* (next) {
  this._rdbConn.close();
  yield next;
});

server.listen(port, () => {
  console.log('server is listening on ' + port);
});

//require('./rdbConnect');

module.exports = server;
