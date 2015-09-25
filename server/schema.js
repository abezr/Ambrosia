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
  getUserByCredentials,
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
  },
  (obj) => {
      return GraphQLUser;
  }
);

var GraphQLFriend = new GraphQLObjectType({
  name: 'Friend',
  fields: {
    id: globalIdField('Friend'), //question on meaning of globalid...
    name: {
      type: GraphQLString,
      description: 'the name of the friend'
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the friend'
    }
  }
});

var {
  connectionType: friendsConnection,
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
} = connectionDefinitions({
  name: 'Restaurant',
  nodeType: GraphQLRestaurant
});

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    name: {
      type: GraphQLString,
      description: 'the name of the user',
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the user',
    },
    friends: {
      type: friendsConnection,
      args: connectionArgs,
      description: 'The friends of the user, for now everybody is friends with user',
      resolve: (user, args, {rootValue}) => co(function*() {
        var friends = yield getUsers(rootValue.conn);
        console.log('Schema:resolve friends', friends);
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

var queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      resolve: (rootValue) => co(function *() {
        var user = yield getUser(rootValue.cookie);
        console.log('schema:rootquerytype', user);
        return user;
      })
    },
    node: nodeField
  })
});

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
    mail: { type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString)},
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {rootValue}) => co(function *() {
    console.log('mutation');
    var conn = rootValue;
    var newUser = yield addUser(credentials, rootValue);
    console.log('newUser', newUser);
    return newUser;
  })
});

var LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    mail: { type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString)}
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {rootValue}) => co(function *() {
    var newUser = yield getUserByCredentials(credentials, rootValue);
    delete newUser.id;
    console.log('schema:loginmutation', newUser);

    return newUser;
  })
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    Signup: SignupMutation,
    Login: LoginMutation,
    updateUser: updateUserMutation
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
