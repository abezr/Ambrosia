import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLInputObjectType,
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
  getUserRestaurants,
  getUserOrders,
  getUsers
}
from '../database';

import {restaurantsConnection} from './restaurant';

import {ordersConnection} from './order';

import co from 'co';

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

export var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    //this field is useless you can do fromGlobalID(id)
    userID: {
      type: GraphQLString,
      description: 'the database user\'s id',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the user',
    },
    mail: {
      type: GraphQLString,
      description: 'the mail of the user',
    },
    profilePicture: {
      type: GraphQLString,
      description: 'the url of profile image'
    },
    orders: {
      type: ordersConnection,
      args: {
        pending: {type: GraphQLBoolean, description:'only return pending orders (non treated)'},
        ...connectionArgs
      },
      description: 'The orders of the user',
      resolve: (user, args, {rootValue}) => co(function*() {
        console.log('schema:UserType:getUserOrders', user);
        args.userID = user.userID;
        var orders = yield getUserOrders(args, rootValue);
        return connectionFromArray(orders, args);
      })
    },
    restaurants: {
      type: restaurantsConnection,
      args: connectionArgs,
      description: 'The restaurants of the user',
      resolve: (user, args, {
        rootValue
      }) => co(function*() {
        console.log('type:user:restaurants', user);
        if(!user.id) return null;
        var restaurants = yield getUserRestaurants(user.userID, rootValue);
        return connectionFromArray(restaurants, args);
      })
    }
  },
});
