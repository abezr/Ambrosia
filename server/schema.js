import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
}
from 'graphql';

import {
  fromGlobalId,
  nodeDefinitions,
  connectionArgs,
  connectionFromArray
}
from 'graphql-relay';

import {
  getRestaurants,
  getRestaurant,
  getUser
}
from './database';

import {
  GraphQLUser
}
from './type/user';

import {
  GraphQLRestaurant,
  restaurantsConnection
}
from './type/restaurant';

import {
  SignupMutation,
  LoginMutation,
  UserMutation,
  RestaurantMutation,
  OrderMutation,
  UpdateCardMutation
}
from './mutation';

import co from 'co';

var {
  nodeInterface, nodeField
} = nodeDefinitions(
  (globalId) => {
    var {
      type, id
    } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    }
    return null;
  }, (obj) => {
    return GraphQLUser;
  }
);



var GraphQLRoot = new GraphQLObjectType({
  name: 'Root',
  fields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: (id, args, {rootValue}) => co(function*() {
        console.log('schema:Root:getRestaurant', id);
        var restaurant = yield getRestaurant(fromGlobalId(id).id, rootValue);
        return restaurant;
      })
    },
    restaurants: {
      type: restaurantsConnection,
      args: connectionArgs,
      description: 'The restaurants of the user',
      resolve: (root, args, {rootValue}) => co(function*() {
        var restaurants = yield getRestaurants(rootValue.conn);
        console.log('root:resolve restaurants', restaurants);
        return connectionFromArray(restaurants, args);
      })
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      description: 'the user',
      resolve: (root, {
        id
      }, {
        rootValue
      }) => co(function*() {
        var user = yield getUser(rootValue);
        return user;
      })
    }
  },
});

var queryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      args: {
        id: {
          type: GraphQLString,
          description: 'the session\'s userId'
        }
      },
      resolve: (rootValue, {
        id
      }) => co(function*() {
        var user = yield getUser(rootValue, id);
        return user;
      })
    },
    root: {
      type: GraphQLRoot,
      args: {
        id: {
          type: GraphQLString,
          description: 'most of the time, the restaurant id'
        }
      },
      resolve: (rootValue, {id}) => {
        return id || {};
      }
    },

    node: nodeField
  })
});



var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    Signup: SignupMutation,
    Login: LoginMutation,
    User: UserMutation,
    Restaurant: RestaurantMutation,
    Order: OrderMutation,
    UpdateCard: UpdateCardMutation
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
