 import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList
}
from 'graphql/lib/type';

import debug from 'debug';
import r from 'rethinkdb';
import co from 'co';

var sc = debug('schema');

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'User creator',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the user.',
    },
    name: {
      type: GraphQLString,
      description: 'The name of the user.',
    },
    friends: {
      type: new GraphQLList(userType),
      description: 'The friends of the user, or an empty list if they have none.',

      resolve: (user, params, conn) => co(function*() {
        var friends = yield user.friends.map(function(id) {
          return r.table('user').get(id).run(conn, function(err, result) {
            return result;
          });
        });
        return friends;
      })
    }
  })
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      user: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: (user, {id}, conn) => co(function* () {
          return yield r.table('user').get(id).run(conn, function(err, result) {
            return result;
          });
        })
      },
      users: {
        type: new GraphQLList(userType),
        resolve: (user, {}, conn) => co(function* () {
          var p = new Promise(function(resolve, reject) {
            r.table('user').run(conn, function(err, result) {
              result.toArray(function(err, res) {
                if(err) reject(err);
                resolve(res);
              });
            })
          });
          return yield p.then(function(value){
            console.log("schema:query");
            return value;
          });
        })
      },
    }
  }),
  // mutation
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      updateUser: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          name: {
            name: 'name',
            type: GraphQLString
          }
        },

        resolve: (obj, {
          id, name
        }, conn) => co(function*() {
          var res = yield r.table('user').get(id).update({
            name: name
          }, {
            returnChanges: true
          }).run(conn);
          return res.changes[0].new_val;
        })
      }
    }
  })
});

export var getProjection;
export default schema;
