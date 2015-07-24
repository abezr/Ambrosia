import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList
}
from 'graphql/lib/type';

import User from './user';

import debug from 'debug';
import r from 'rethinkdb';

var sc = debug('schema');
/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Project}
 */
function getProjection(fieldASTs) {
  return fieldASTs.selectionSet.selections.reduce((projections, selection) => {
    projections[selection.name.value] = 1;
    return projections;
  }, {});
}

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

      resolve: (user, params, conn, fieldASTs) => co(function*(){
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
      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },
      user: {
        type: userType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          }
        },

        resolve: (user, {
          id
        }, conn, fieldASTs) => co(function*() {
          var data = yield r.table('user').get(id).run(conn, function(err, result) {
            sc(result);
            return result;
          });
          return data;
        })
      }
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

        resolve: (obj, {id, name}, conn, fieldASTs) => co(function*() {
          var res = yield r.table('user').get(id).update({name: name}, {returnChanges: true}).run(conn);
          return res.changes[0].new_val;
        })
      }
    }
  })
});

export var getProjection;
export default schema;
