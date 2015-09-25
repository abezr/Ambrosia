import koa from 'koa';
import koaRouter from 'koa-router';
import mount from 'koa-mount';
import graphqlHTTP from 'koa-gql';
import qs from 'koa-qs';
import serve from 'koa-static';
import session from 'koa-session';
import parseBody from 'co-body';
import path from 'path';

// import React from 'react';
// import Relay from 'react-relay';
// import ReactRouter from 'react-router';

import webpack from 'webpack';
import WebpackDevMiddleware from 'koa-webpack-dev-middleware';

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

import {
  Schema
} from './server/schema';

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
console.log(__dirname);
server.use(serve('.'));
server.use(session(server));

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
// server.use(mount('/graphql', graphqlHTTP({ schema: Schema })));

routes.get('/graphql', function* (next) {
  var result = yield graphqlHTTP({
    schema: Schema,
    rootValue: this._rdbConn
  });
  console.log('get request result', result);
});

routes.post('/graphql', function* (next) {
  console.log('post request');
//TODO pass the session object for being identicating
  yield graphqlHTTP({
    schema: Schema,
    rootValue: {
      conn: this._rdbConn,
      cookie: this.cookies
    }
  });
});

server.use(routes.middleware());
//
// //NOTE I decided to handle redirection into index component himself
// server.use(function* (next) {
//   ReactRouter.run(require('../client/components/routes'), this.path, (error, initialState, transition) => {
//     var html = React.renderToStaticMarkup(<ReactRouter {...initialState}/>);
//     this.body = renderFullPage(html);
//   });
//   yield next;
// });

server.use(function* (next) {
  this.body = `<!doctype html>
                <html>
                  <body>
                    <div id="app"></div>
                  </body>
                <script src='/src/app.js'></script>
                </html>`;
  yield next;
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
