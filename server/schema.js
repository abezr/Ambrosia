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
  OrderMutation
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
      args: {
        id: {
          type: GraphQLString,
          description: 'the restaurant\'s rethinkdb\'s id'
        }
      },
      resolve: (root, {
        id
      }, {
        rootValue
      }) => co(function*() {
        console.log('schema:Root:getRestaurant', fromGlobalId(id));
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
        var user = yield getUser(rootValue, id);
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
          description: 'it can be either restaurant or user id or null'
        }
      },
      resolve: (rootValue, {
        id
      }) => {
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
    Order: OrderMutation
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
