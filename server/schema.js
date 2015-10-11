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
  getRestaurant,
  addRestaurant,
  getRestaurants,
  getUser,
  getUserByCredentials,
  getUsers,
  addUser,
  updateUser,
  addOrder
}
from './database';
//import r from 'rethinkdb';
//import co from 'co';
//
import Debug from 'debug';
import co from 'co';

var log = Debug('Schema');

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

var GraphQLMeal = new GraphQLObjectType({
  name: 'Meal',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    }
  }
});

var GraphQLInputMeal = new GraphQLInputObjectType({
  name: 'InputMeal',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    }
  }
});

var GraphQLFood = new GraphQLObjectType({
  name: 'Food',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    meals: {
      type: new GraphQLList(GraphQLMeal),
      description: 'List of meals'
    }
  }
});

var GraphQLInputFood = new GraphQLInputObjectType({
  name: 'InputFood',
  fields: {
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    meals: {
      type: new GraphQLList(GraphQLInputMeal),
      description: 'List of meals'
    }
  }
});

var GraphQLItem = new GraphQLObjectType({
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

var GraphQLInputItem = new GraphQLInputObjectType({
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
    }
  }
});

var GraphQLOrder = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id: globalIdField('Order'),
    price: {
      type: GraphQLInt,
      description: 'the order value, expressed with an integer'
    },
    items: {
      type: new GraphQLList(GraphQLItem),
      description: 'the items in that order'
    },
    date: {
      type: GraphQLInt,
      description: 'the time by which the order has been done in milliseconds since january 1920'
    }
  }
});

var GraphQLInputOrder = new GraphQLInputObjectType({
  name: 'inputOrder',
  fields: {
    price: {
      type: GraphQLInt,
      description: 'the order value, expressed with an integer'
    },
    items: {
      type: new GraphQLList(GraphQLInputItem),
      description: 'the items in that order'
    },
    date: {
      type: GraphQLInt,
      description: 'the time by which the order has been done in milliseconds since january 1920'
    }
  }
});
// look to add some more args to the order connection
var {
  connectionType: ordersConnection,
  edgeType: GraphQLOrderEdge
} = connectionDefinitions({
  name: 'Order',
  nodeType: GraphQLOrder
});

var GraphQLRestaurant = new GraphQLObjectType({
  name: 'Restaurant',
  fields: {
    id: globalIdField('Restaurant'),
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    foods: {
      type: new GraphQLList(GraphQLFood),
      description: 'List of foods'
    },
    orders: {
      type: ordersConnection,
      args: { // is graphQLDateType an input type as well?
        date:
          {type: GraphQLString},
        ...connectionArgs
      },
      description: 'all the orders of the restaurant',
      resolve: (restaurant, {complete, ...args}, {rootValue}) => co(function*() {
        console.log('schema:ordersconnection')
      })
    }
  }
});

var GraphQLInputRestaurant = new GraphQLInputObjectType({
  name: 'InputRestaurant',
  fields: {
    name: {
      type: GraphQLString,
      description: 'the name of the restaurant'
    },
    description: {
      type: GraphQLString,
      description: 'restaurant\'s description'
    },
    foods: {
      type: new GraphQLList(GraphQLInputFood),
      description: 'List of foods'
    }
  }
});

var {
  connectionType: restaurantsConnection,
  edgeType: GraphQLRestaurantEdge,
} = connectionDefinitions({
  name: 'Restaurant',
  nodeType: GraphQLRestaurant
});

var GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
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
    friends: {
      type: friendsConnection,
      args: connectionArgs,
      description: 'The friends of the user, for now everybody is friends with user',
      resolve: (user, args, {
        rootValue
      }) => co(function*() {
        var friends = yield getUsers(rootValue.conn);
        console.log('Schema:resolve friends', friends);
        return connectionFromArray(friends, args);
      })
    },
    restaurants: {
      type: restaurantsConnection,
      args: connectionArgs,
      description: 'The restaurants of the user',
      resolve: (user, args, {
        rootValue
      }) => co(function*() {
        var restaurants = yield getRestaurants(rootValue.conn);
        console.log('resolve user restaurant', restaurants);
        return connectionFromArray(restaurants, args);
      })
    }
  },
  interfaces: [nodeInterface]
});

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
        console.log('schema:Root:getRestaurant', fromGlobalId(root));
        var restaurant = yield getRestaurant(fromGlobalId(root).id, rootValue);
        return restaurant;
      })
    },
    user: {
      type: new GraphQLNonNull(GraphQLUser),
      args: {
        id: {
          type: GraphQLString
        }
      },
      description: 'the user',
      resolve: (root, {
        id
      }, {
        rootValue
      }) => co(function*() {
        console.log('schema:graphqlRoot');
        console.log('var1', root);
        console.log('var2', id);
        console.log('var3', rootValue);
        var user = yield getUser(rootValue, id);
        return user;
      })
    }
  },
})

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
        console.log('schema:rootquerytype', id);
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
        console.log('schema:rootQueryType', id);
        return id || {};
      }
    },

    node: nodeField
  })
});

var SignupMutation = mutationWithClientMutationId({
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
    return newUser;
  })
});

var LoginMutation = mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    mail: {
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
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
    var newUser = yield getUserByCredentials(credentials, rootValue);
    console.log('schema:loginmutation');
    delete newUser.id;
    return newUser;
  })
});

var OrderMutation = mutationWithClientMutationId({
  name: 'OrderMutation',

  inputFields: {
    order: {
      type: GraphQLInputOrder
    },
    restaurantID: {
      type: GraphQLString
    }
  },
  outputFields: {
    orderEdge: {
      type: GraphQLOrderEdge,
      resolve: () => {
        return null;
      }
    }
  },
  mutateAndGetPayload: ({order, restaurantID}, {rootValue}) => co(function*() {
    //we need restaurant id plus order
    var {id} = fromGlobalId(restaurantID);
    return yield addOrder(id, order, rootValue);
  })
});

var RestaurantMutation = mutationWithClientMutationId({
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
        newRestaurant, rootValue
      }) => {
        console.log('restaurantMutation:getRestaurant', newRestaurant);
        return null;
      }
    },
    user: {
      type: GraphQLUser,
      resolve: ({
        newRestaurant, userID, rootValue
      }) => {
        return getUser(rootValue, userID);
      }
    }
  },
  mutateAndGetPayload: ({
    restaurant, userID
  }, {
    rootValue
  }) => co(function*() {
    var newRestaurant = yield addRestaurant(restaurant, rootValue);
    return {
      newRestaurant, userID, rootValue
    };
  })
});

var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    Signup: SignupMutation,
    Login: LoginMutation,
    Restaurant: RestaurantMutation,
    Order: OrderMutation
  })
});

export var Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
