import {
  GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType, GraphQLSchema, GraphQLString
}
from 'graphql';

import {
  connectionArgs, connectionDefinitions, offsetToCursor, connectionFromArray, cursorForObjectInConnection, fromGlobalId, globalIdField, mutationWithClientMutationId, nodeDefinitions, toGlobalId
}
from 'graphql-relay';

import {
  addUser, getUser, updateUser, newUser, getUserByCredentials, addOrder, updateOrder, getRestaurant, getUserRestaurants, addRestaurant, updateRestaurant, updateRestaurantCard, updateRestaurantSettings
}
from './database';

import {
  GraphQLUser
}
from './type/user';

import {
  GraphQLRestaurant, GraphQLInputRestaurant, GraphQLRestaurantEdge, GraphQLInputFood, GraphQLInputDay
}
from './type/restaurant';

import {
   GraphQLOrder, GraphQLInputOrder, GraphQLOrderEdge
}
from './type/order';

import co from 'co';

export var UserMutation = mutationWithClientMutationId({
  name: 'UserMutation',
  inputFields: {
    id: {
      type: GraphQLString
    },
    userID: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    mail: {
      type: GraphQLString
    },
    profilePicture: {
      type: GraphQLString
    }
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (user) => user
    }
  },
  mutateAndGetPayload: (args, {
    rootValue
  }) => co(function*() {
    var user = yield updateUser(args, rootValue);
    console.log('mutation:UserMutation', user, args);
    user.id = fromGlobalId(args.id).id;
    user.userID = args.userID;
    console.log('mutztion:UserMutation:afterChanges', user, args);
    return user;
  })
});

export var SignupMutation = mutationWithClientMutationId({
  name: 'Signup',
  inputFields: {
    mail: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {
    rootValue
  }) => co(function*() {
    var conn = rootValue;
    var newUser = yield addUser(credentials, rootValue);
    console.log('mutation:signup', newUser);
    return newUser;
  })
});
//
// export var LogoutMutation = mutationWithClientMutationId({
//   name: 'Logout',
//   outputFields: {
//     user: {
//       type: GraphQLUser,
//       resolve: (newUser) => newUser
//     }
//   }
//   mutateAndGetPayload:
// })
export var LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    mail: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      type: new GraphQLNonNull(GraphQLString)
    },
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  outputFields: {
    user: {
      type: GraphQLUser,
      resolve: (newUser) => newUser
    }
  },
  mutateAndGetPayload: (credentials, {
    rootValue
  }) => co(function*() {
    console.log('schema:loginmutation', credentials);
    var newUser = yield getUserByCredentials(credentials, rootValue);
    return newUser;
  })
});
//TODO remove restaurantID and userID fields and add them in order object
export var OrderMutation = mutationWithClientMutationId({
  name: 'Order',

  inputFields: {
    order: {
      type: GraphQLInputOrder
    }
  },
  outputFields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: ({order, rootValue}) => co(function* () {
        console.log('mutation:restaurant');
        return yield getRestaurant(order.restaurantID, rootValue);
      })
    },
    user: {
      type: GraphQLUser,
      resolve: ({rootValue}) => co(function* () {
        console.log('mutation:user');
        return yield getUser(rootValue);
      })
    },
    orderRestaurantEdge: {
      type: GraphQLOrderEdge,
      resolve: ({orders, order}) => {
        var offset = orders[0].forEach((cursor, index) => {
          console.log('mutation:orderRestaurantEdge:cursorIds', cursor.id);
          if(cursor.id === order.id) return index;
        });
        console.log('mutation:orderRestaurantEdge', order);
        return {
          cursor: cursorForObjectInConnection(orders[0], order),
          node: order
        };
      }
    },
    orderUserEdge: {
      type: GraphQLOrderEdge,
      resolve: ({orders, order}) => {
        var offset;
        orders[0].forEach((cursor, index) => {
          console.log('mutation:orderUserEdge:cursorIds', cursor.id === order.id);
          if(cursor.id === order.id) offset = index;
        });
        console.log('mutation:orderUserEdge', order.id, offset);
        return {
          //use offsetToCursor on next graphQL-relay release
          cursor: cursorForObjectInConnection(orders[1], orders[1][offset]),
          node: order
        };
      }
    }
  },
  mutateAndGetPayload: (args, {
    rootValue
  }) => co(function*() {
    //we need restaurant id plus order
    var order = args.order;
    order.restaurantID = fromGlobalId(order.restaurantID).id;
    console.log('schema:ordermutation', order);
    var orders = yield addOrder(order, rootValue);
    console.log('schema:ordermutation', orders);
    return {orders, order, rootValue};
  })
})

export var RestaurantMutation = mutationWithClientMutationId({
  name: 'Restaurant',
  //think about adding a userId input field
  inputFields: {
    restaurant: {
      type: GraphQLInputRestaurant
    },
    userID: {
      type: GraphQLString
    }
  },
  outputFields: {
    //this doesn't work...
    restaurantEdge: {
      type: GraphQLRestaurantEdge,
      resolve: ({
        newRestaurant, userID, rootValue
      }) => co(function* () {
        console.log('restaurantMutation:getRestaurant', newRestaurant);
        //TODO replace getRestaurants with GetUserRestaurants ASAP
        var restaurants = yield getUserRestaurants(userID, rootValue);
        var offset;
        restaurants.forEach((cursor, index) => {
          if(cursor.id === newRestaurant.id) offset = index;
        })
        return {
          cursor: offsetToCursor(offset),
          node: newRestaurant
        }
      })
    },
    user: {
      type: GraphQLUser,
      resolve: ({rootValue}) => {
        return getUser(rootValue);
      }
    }
  },
  mutateAndGetPayload: ({restaurant, userID}, {rootValue}) => co(function*() {
    var newRestaurant = yield addRestaurant({restaurant, userID}, rootValue);
    return {
      newRestaurant, userID, rootValue
    };
  })
});

export var UpdateRestaurantMutation = mutationWithClientMutationId({
  name: 'UpdateRestaurant',
  inputFields: {
    restaurant: {
      type: GraphQLInputRestaurant
    }
  },
  outputFields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: (restaurant) => restaurant
    }
  },
  mutateAndGetPayload: ({restaurant}, {rootValue}) => co(function*() {
    restaurant.id = fromGlobalId(restaurant.id).id;
    return yield updateRestaurant(restaurant, rootValue);
  })
});

export var UpdateOrderMutation = mutationWithClientMutationId({
  name: 'UpdateOrder',
  inputFields: {
    order: {
      type: GraphQLInputOrder
    },
  },
  outputFields: {
    order: {
      type: GraphQLOrder,
      resolve: (order) => order
    }
  },
  mutateAndGetPayload: (args, {rootValue}) => co(function*() {
    args.order.id = fromGlobalId(args.order.id).id;
    if(args.order.restaurantID) args.order.restaurantID = fromGlobalId(args.order.restaurantID).id;
    return yield updateOrder(args.order, rootValue);
  })
})
