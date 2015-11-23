import {
  GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInputObjectType, GraphQLSchema, GraphQLString
}
from 'graphql';

import {
  connectionArgs, connectionDefinitions, offsetToCursor, connectionFromArray, cursorForObjectInConnection, fromGlobalId, globalIdField, mutationWithClientMutationId, nodeDefinitions, toGlobalId
}
from 'graphql-relay';

import {
  addUser, getUser, updateUser, newUser, getUserByCredentials, addOrder, getRestaurant, getUserRestaurants, addRestaurant, updateRestaurantCard, updateRestaurantSettings
}
from './database';

import {
  GraphQLUser
}
from './type/user';

import {
  GraphQLRestaurant, GraphQLInputRestaurant, GraphQLRestaurantEdge, GraphQLInputOrder, GraphQLOrderEdge, GraphQLInputFood, GraphQLInputDay
}
from './type/restaurant';

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

export var OrderMutation = mutationWithClientMutationId({
  name: 'Order',

  inputFields: {
    order: {
      type: GraphQLInputOrder
    },
    restaurantID: {
      type: GraphQLString
    },
    userID: {
      type: GraphQLString
    }
  },
  outputFields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: ({restaurantID, rootValue}) => co(function* () {
        console.log('mutation:restaurant');
        return yield getRestaurant(restaurantID, rootValue);
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
    console.log('schema:ordermutation', args.order);
    //we need restaurant id plus order
    var restaurantID = fromGlobalId(args.restaurantID).id;
    var userID = fromGlobalId(args.userID).id;
    var order = args.order;
    //orders[0] = restaurantOrder, orders[1] = userOrder
    var orders = yield addOrder(restaurantID, userID, order, rootValue);
    return {restaurantID, userID, orders, order, rootValue};
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
  mutateAndGetPayload: ({
    restaurant, userID
  }, {
    rootValue
  }) => co(function*() {
    var newRestaurant = yield addRestaurant({restaurant, userID}, rootValue);
    return {
      newRestaurant, userID, rootValue
    };
  })
});

export var UpdateCardMutation = mutationWithClientMutationId({
  name: 'UpdateCard',
  inputFields: {
    card: {
      type: GraphQLInputRestaurant
    },
    restaurantID: {
      type: GraphQLString
    }
  },
  outputFields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: (restaurant) => restaurant
    }
  },
  mutateAndGetPayload: ({restaurantID, card}, {rootValue}) => co(function*() {
    restaurantID = fromGlobalId(restaurantID).id;
    return yield updateRestaurantCard({restaurantID, card}, rootValue);
  })
})

export var UpdateSettingsMutation = mutationWithClientMutationId({
  name: 'UpdateSettings',
  inputFields: {
    restaurantID: {
      type: GraphQLString
    },
    scorable: {
      type: GraphQLBoolean
    },
    open: {
      type: GraphQLBoolean
    },
    schedule: {
      type: new GraphQLList(GraphQLInputDay)
    }
  },
  outputFields: {
    restaurant: {
      type: GraphQLRestaurant,
      resolve: (restaurant) => restaurant
    }
  },
  mutateAndGetPayload: (args, {rootValue}) => co(function*() {
    args.restaurantID = fromGlobalId(args.restaurantID).id;
    return yield updateRestaurantSettings(args, rootValue);
  })
})
