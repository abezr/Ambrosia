import koa from 'koa';
import Router from 'koa-router';
import qs from 'koa-qs';
import parseBody from 'co-body';
import mongoose from 'mongoose';
import {graphql} from 'graphql';
import debug from 'debug';

var err = debug('server:error');

import schema from './schema';

let port = process.env.PORT || 3000;
let routes = new Router();
var server = koa();

// support nested query tring params
qs(server);

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/graphql');
}

server.use(function *(next) {
  yield r.connect(config.rethinkdb, function(error, conn) {
    if (error) {
      err(error);
    } else {
      this._rdbConn = conn;
    }
  }.bind(this));
  yield next;
});

routes.get('/data', function* () {
  var query = this.query.query;
  var params = this.query.params;
  sc(schema);
  qu(query);
  var resp = yield graphql(schema, query, 'conn');

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
  var payload = yield parseBody(this);
  var resp = yield graphql(schema, payload.query, '', payload.params);

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

server.use(function *(next) {
  this._rdbConn.close();
  yield next;
});

server.listen(port, () => {
  console.log('server is listening on ' + port);
});

//require('../rdbConnect');

module.exports = server;
