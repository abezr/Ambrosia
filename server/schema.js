import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
}
from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId
}
from 'graphql-relay';

import {
  getUser,
  getUsers,
  addUser,
  updateUser
}
from './database';
//import r from 'rethinkdb';
//import co from 'co';
//
import Debug from 'debug';
import co from 'co';

var log = Debug('Schema');

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    }
    return null;
  }, (obj) => {
      return GraphQLUser;
  }
);

// var GraphQLUser = new GraphQLObjectType({
//   name: 'User',
//   description: 'User creator',
//   fields: () => ({
//     id: {
//       type: new GraphQLNonNull(GraphQLString),
//       description: 'The id of the user.',
//     },
//     name: {
//       type: GraphQLString,
//       description: 'The name of the user.',
//     },
//     friends: {
//       type: new GraphQLList(GraphQLUser),
//       description: 'The friends of the user, or an empty list if they have none.',
//
//       resolve: (user, params, conn) => co(function*() {
//         var friends = yield user.friends.map(function(id) {
//           return r.table('user').get(id).run(conn, function(err, result) {
//             return result;
//           });
//         });
//         return friends;
//       })
//     }
//   })
// });

var GraphQLFriend = new GraphQLObjectType({
  name: 'Friend',
  fields: {
    id: globalIdField('Friend'), //question on meaning of globalid...
    name: {
      type: GraphQLString,
      description: 'the name of the friend'
    },
  }
});

var {
  connectionType: friendsConnection,
  edgeType: GraphQLFriendEdge
} = connectionDefinitions({
  name: 'Friend',
  nodeType: GraphQLFriend
});

var GraphQLRestaurant = new GraphQLObjectType({
  name: 'Restaurant',
  fields: {
    id: globalIdField('Restaurant'),
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
  }
});

var {
  connectionType: restaurantsConnection,
  edgeType: GraphQLRestaurantEdge
} = connectionDefinitions({
  name: 'Restaurant',
  nodeType: GraphQLRestaurant
});

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'the name of the user',
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the user',
    },
    friends: {
      type: friendsConnection,
      args: connectionArgs,
      description: 'The friends of the user',
      resolve: (user, args, var3) => co(function*() {
        console.log('Schema: resolve friends');
        var friends = yield user.friends.map((id) => {
          log(id);
          return getUser(id, user.conn)
        });
        console.log(friends);
        return connectionFromArray(friends, args);
      })
    },
    restaurants: {
      type: restaurantsConnection,
      args: connectionArgs,
      description: 'The restaurants of the user',
      resolve: (user, args) => co(function*() {
        var restaurants = yield user.restaurants.map((id) => {
          log('restaurant id', id);
          //TODO add a restaurant getter in the database!
          return {};
        });
        return connectionFromArray(restaurants, args);
      })
    }
  },
  interfaces: [nodeInterface]
});

// connectionFromArray(
//   user.friends.map((id) => getUser(id, user.conn)), args
// )


// var queryType = new GraphQLObjectType({
//   name: 'RootQueryType',
//   fields: {
//     user: {
//       type: GraphQLUser,
//       args: {
//         id: {
//           name: 'id',
//           type: new GraphQLNonNull(GraphQLString)
//         }
//       },
//       resolve: (user, {id}, conn) => co(function*() {
//         return yield r.table('user').get(id).run(conn, function(err, result) {
//           return result;
//         });
//       })
//     },
//     users: {
//       type: new GraphQLList(GraphQLUser),
//       resolve: (user, {}, conn) => co(function*() {
//         var p = new Promise(function(resolve, reject) {
//           r.table('user').run(conn, function(err, result) {
//             result.toArray(function(err, res) {
//               if (err) reject(err);
//               resolve(res);
//             });
//           })
//         });
//         return yield p.then(function(value) {
//           console.log("schema:query");
//           return value;
//         });
//       })
//     },
//   }
// });

var queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      args: {
        id: {
          name: 'id',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (conn, {id}, fieldAST) => getUser(id, conn)
    },
    users: {
      type: new GraphQLList(GraphQLUser),
      resolve: (root, obj, conn) => {
        return getUsers(conn);
      }
    },
    node: nodeField
  })
});
// mutation
// var mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     updateUser: {
//       type: GraphQLUser,
//       args: {
//         id: {
//           name: 'id',
//           type: new GraphQLNonNull(GraphQLString)
//         },
//         name: {
//           name: 'name',
//           type: GraphQLString
//         }
//       },
//
//       resolve: (obj, {
//         id, name
//       }, conn) => co(function*() {
//         var res = yield r.table('user').get(id).update({
//           name: name
//         }, {
//           returnChanges: true
//         }).run(conn);
//         return res.changes[0].new_val;
//       })
//     }
//   }
// });

var updateUserMutation = mutationWithClientMutationId({
  name : 'updateUser',
  inputFields: {
    userName: {
      type: new GraphQLNonNull(GraphQLString)
    },
    userId: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (payload) => payload.user
    }
  },
  mutateAndGetPayload: ({userName, userId}, conn) => {
    var newUser = updateUser(userId, userName, conn);
    return {user: newUser};
  }
});

var SignupMutation = mutationWithClientMutationId({
  name: 'Signup',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString)},
    mail: { type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString)},
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (conn, credentials) => {
    log('var1', conn);
    log('var2', credentials);
    var newUser = addUser(credentials, conn);
    return newUser;
  }
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    Signup: SignupMutation,
    updateUser: updateUserMutation
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
