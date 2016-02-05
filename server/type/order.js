import {
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType
}
from 'graphql';

import {
  connectionDefinitions,
  fromGlobalId,
  globalIdField,
  toGlobalId
}
from 'graphql-relay';

import {getUserByID, getRestaurant} from '../database';

import co from 'co';

export var GraphQLItem = new GraphQLObjectType({
  name: 'Item',
  fields: {
    id: {
      type: GraphQLString,
    },
    parent: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    }
  }
});

export var GraphQLInputItem = new GraphQLInputObjectType({
  name: 'InputItem',
  fields: {
    id: {
      type: GraphQLString,
    },
    parent: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
  }
});

export var GraphQLOrder = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: globalIdField('Order'),
    userID: {
      type: GraphQLString,
      description: 'the orderer user-id',
      resolve: (order) => {
        return toGlobalId(order.userID);
      }
    },
    restaurantID: {
      type: GraphQLString,
      description: 'the restaurant who get ordered',
      resolve: (order) => {
        return toGlobalId(order.restaurantID);
      }
    },
    price: {
      type: GraphQLInt,
      description: 'the order value, expressed with an integer'
    },
    message: {
      type: GraphQLString,
      description: 'a message along the order'
    },
    items: {
      type: new GraphQLList(GraphQLItem),
      description: 'the items in that order'
    },
    prepayed: {
      type: GraphQLBoolean,
      description: 'is the order prepayed'
    },
    payed: {
      type: GraphQLBoolean,
      description: 'is the order payed ?'
    },
    treated: {
      type: GraphQLBoolean,
      description: 'is the order processed ?'
    },
    date: {
      type: GraphQLFloat,
      description: 'the time by which the order has been done in milliseconds since january 1920'
    },
    rate: {
      type: GraphQLInt,
      description: 'the customer rate for that command'
    },
    comment: {
      type: GraphQLString,
      description: 'the customer comment for that command'
    },
    userName: {
      type: GraphQLString,
      description: 'orderer name if no name return mail',
      resolve: (order, args, {rootValue}) => co(function*() {
        var user = yield getUserByID(order.userID, rootValue);
        return user.name || user.mail;
      })
    },
    restaurantName: {
      type: GraphQLString,
      description: 'restaurant name for that particular order',
      resolve: (order, args, {rootValue}) => co(function*() {
        var restaurant = yield getRestaurant(order.restaurantID, rootValue);
        return restaurant? restaurant.name : 'unknown';
      })
    }
  }
});

export var GraphQLInputOrder = new GraphQLInputObjectType({
  name: 'inputOrder',
  fields: {
    id: {
      type: GraphQLString
    },
    userID: {
      type: GraphQLString,
      description: 'the orderer user-id'
    },
    restaurantID: {
      type: GraphQLString,
      description: 'the restaurant who get ordered'
    },
    price: {
      type: GraphQLFloat,
      description: 'the order value, expressed with an integer'
    },
    message: {
      type: GraphQLString,
      description: 'a message along the order'
    },
    prepayed: {
      type: GraphQLBoolean,
      description: 'is the order payed?'
    },
    treated: {
      type: GraphQLBoolean,
      description: 'is the order treated'
    },
    payed: {
      type: GraphQLBoolean,
      description:  'is the order payed'
    },
    rate: {
      type: GraphQLInt,
      description: 'the order customer rate'
    },
    comment: {
      type: GraphQLString,
      description: 'customer commentary'
    },
    items: {
      type: new GraphQLList(GraphQLInputItem),
      description: 'the items in that order'
    },
    date: {
      type: GraphQLFloat,
      description: 'the time in milliseconds by which the order has been done since january 1920'
    }
  }
});

// look to add some more args to the order connection
var orderConnection = connectionDefinitions({
  name: 'Order',
  nodeType: GraphQLOrder
});
export var ordersConnection = orderConnection.connectionType;
export var GraphQLOrderEdge = orderConnection.edgeType;
