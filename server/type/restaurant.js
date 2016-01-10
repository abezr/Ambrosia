import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
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

import {getRestaurantOrders, getUserByID} from '../database';

import co from 'co';

export var GraphQLGeoJSON = new GraphQLObjectType({
  name: 'GeoJson',
  fields: {
    type: {
      type: GraphQLString,
      description: 'What kind of geoJSON object'
    },
    coordinates: {
      type: new GraphQLList(GraphQLFloat),
      description: 'geoJSON object location'
    }
  }
})

export var GraphQLMeal = new GraphQLObjectType({
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
    },
    price: {
      type: GraphQLFloat
    },
    time: {
      type: GraphQLFloat
    }
  }
});

export var GraphQLInputMeal = new GraphQLInputObjectType({
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
    },
    price: {
      type: GraphQLFloat
    },
    time: {
      type: GraphQLFloat
    }
  }
});

export var GraphQLFood = new GraphQLObjectType({
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

export var GraphQLInputFood = new GraphQLInputObjectType({
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
      description: 'the orderer user-id'
    },
    restaurantID: {
      type: GraphQLString,
      description: 'the restaurant who get ordered'
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
    userName: {
      type: GraphQLString,
      description: 'orderer name if no name return mail',
      resolve: (order, args, {rootValue}) => co(function*() {
        //console.log('GraphQLInputOrder:order', order.userID);
        var user = yield getUserByID(order.userID, rootValue);
        return user.name || user.mail;
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

var GraphQLOpenHours = new GraphQLObjectType({
  name: 'OpenHours',
  fields: {
    from: {type: GraphQLInt},
    to: {type: GraphQLInt}
  }
});

var GraphQLInputOpenHours = new GraphQLInputObjectType({
  name: 'InputOpenHours',
  fields: {
    from: {type: GraphQLInt},
    to: {type: GraphQLInt}
  }
});

export var GraphQLDay = new GraphQLObjectType({
  name: 'Day',
  fields: {
    day: {
      type: GraphQLString,
      description: 'day of the week'
    },
    openHours: {
      type: new GraphQLList(GraphQLOpenHours)
    }
  }
});

export var GraphQLInputDay = new GraphQLInputObjectType({
  name: 'InputDay',
  fields: {
    day: {
      type: GraphQLString,
      description: 'day of the week'
    },
    openHours: {
      type: new GraphQLList(GraphQLInputOpenHours)
    }
  }
});

var GraphQLLocation = new GraphQLObjectType({
  name: 'Location',
  fields: {
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    },
    type: {
      type: GraphQLString
    }
  }
});

export var GraphQLInputLocation = new GraphQLInputObjectType({
  name: 'InputLocation',
  fields: {
    coordinates: {
      type: new GraphQLList(GraphQLFloat)
    },
    type: {
      type: GraphQLString
    }
  }
});

export var GraphQLRestaurant = new GraphQLObjectType({
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
    userID: {
      type: GraphQLString,
      description: 'userID of the owner'
    },
    foods: {
      type: new GraphQLList(GraphQLFood),
      description: 'List of foods'
    },
    location: {
      type: GraphQLLocation,
      description: 'the restaurant location object'
    },
    distance: {
      type: GraphQLFloat,
      description: 'distance between the user and the restaurant'
    },
    scorable: {
      type: GraphQLBoolean,
      description: 'is the restaurant scorable'
    },
    score: {
      type: new GraphQLList(GraphQLInt),
      description: 'restaurant score'
    },
    busy: {
      type: GraphQLInt,
      description: 'time needed to treat coming orders in milliseconds'
    },
    open: {
      type: GraphQLBoolean,
      description: 'is your restaurant open'
    },
    schedule: {
      type: new GraphQLList(GraphQLDay),
      description: 'restaurant schedule on a week basis'
    },
    orders: {
      type: ordersConnection,
      args: { // is graphQLDateType an input type as well?
        midnightTime:
          {type: GraphQLFloat, description: 'only require order of the day'},
          ...connectionArgs
      },
      description: 'all the orders of the restaurant',
      resolve: (restaurant, {midnightTime, ...args}, {rootValue}) => co(function*() {
        var restaurantID = restaurant.id;
        var orders = yield getRestaurantOrders({midnightTime, restaurantID}, rootValue);
        console.log('schema:restaurant:getOrders', orders);
        return connectionFromArray(orders, args);
      })
    }
  }
});

export var GraphQLInputRestaurant = new GraphQLInputObjectType({
  name: 'InputRestaurant',
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
    },
    foods: {
      type: new GraphQLList(GraphQLInputFood),
      description: 'List of foods'
    },
    scorable: {
      type: GraphQLBoolean,
      description: 'is restaurant scorable'
    },
    score: {
      type: new GraphQLList(GraphQLInt),
    },
    busy: {
      type: GraphQLInt,
      description: 'time needed to treat coming orders in milliseconds'
    },
    open: {
      type: GraphQLBoolean,
      description: 'is your restaurant open'
    },
    schedule: {
      type: new GraphQLList(GraphQLInputDay),
      description: 'restaurant schedule on a week basis'
    },
    location: {
      type: new GraphQLList(GraphQLFloat),
      description: 'restaurant latitude and longitude'
    },
  }
});

var connectRestaurant = connectionDefinitions({
  name: 'Restaurant',
  nodeType: GraphQLRestaurant
});
export var restaurantsConnection = connectRestaurant.connectionType;
export var GraphQLRestaurantEdge = connectRestaurant.edgeType;
