import koa from 'koa';
import Router from 'koa-router';
//import ReactRouter from 'react-router';
import qs from 'koa-qs';
import parseBody from 'co-body';
import r from 'rethinkdb';
import {graphql} from 'graphql';
import debug from 'debug';
var config = {
  host: 'localhost',
  port: 28015,
  db: 'user'
};

var err = debug('server:error');

import schema from './schema';

let port = process.env.PORT || 3000;
let routes = new Router();
var server = koa();

// support nested query tring params
qs(server);

server.use(function*(next) {
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

import HtmlRoot from '../client/components/html.jsx';
import Heroes from '../client/components/heroes.jsx'

server.use(function*(next) {
  var html = React.renderToStaticMarkup(HtmlRoot({
    markup: React.renderToString(Heroes)
  }));
  yield next;
  this.body = html;
})

routes.get('/data', function*() {
  var query = this.query.query;
  var params = this.query.params;
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

routes.post('/data', function*() {
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

server.use(function*(next) {
  this._rdbConn.close();
  yield next;
});

server.listen(port, () => {
  console.log('server is listening on ' + port);
});

//require('./rdbConnect');

module.exports = server;
