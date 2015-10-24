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
  addUser,
  getUser,
  updateUser,
  newUser,
  getUserByCredentials,
  addOrder,
  addRestaurant
} from './database';

import {GraphQLUser} from './type/user';
import {GraphQLInputRestaurant, GraphQLRestaurantEdge, GraphQLInputOrder, GraphQLOrderEdge} from './type/restaurant';
import co from 'co';

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
    return newUser;
  })
});

export var UserMutation = mutationWithClientMutationId({
  name:'UserMutation',
  inputFields: {
    id: {
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
  mutateAndGetPayload: (args, {rootValue}) => co(function*() {
    console.log('mutation:UserMutation', args);
    var id = fromGlobalId(args.id).id;
    var user = yield updateUser(id, args, rootValue);
    return user;
  })
});

export var LoginMutation = mutationWithClientMutationId({
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
    orderEdge: {
      type: GraphQLOrderEdge,
      resolve: () => {
        return null;
      }
    }
  },
  mutateAndGetPayload: (args, {rootValue}) => co(function*() {
    console.log('schema:ordermutation', args.order);
    //we need restaurant id plus order
    var restaurant = fromGlobalId(args.restaurantID);
    var user = fromGlobalId(args.userID);
    return yield addOrder(restaurant.id, user.id, args.order, rootValue);
  })
});

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
