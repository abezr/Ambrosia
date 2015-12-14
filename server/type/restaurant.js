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

import {getRestaurantOrders} from '../database';

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
    price: {
      type: GraphQLInt,
      description: 'the order value, expressed with an integer'
    },
    items: {
      type: new GraphQLList(GraphQLItem),
      description: 'the items in that order'
    },
    time: {
      type: GraphQLInt,
      description: 'how much time does it take to fullfill this order in milliseconds'
    },
    payed: {
      type: GraphQLBoolean,
      description: 'is the order payed?'
    },
    date: {
      type: GraphQLInt,
      description: 'the time by which the order has been done in milliseconds since january 1920'
    }
  }
});

export var GraphQLInputOrder = new GraphQLInputObjectType({
  name: 'inputOrder',
  fields: {
    id: {
      type: GraphQLString
    },
    price: {
      type: GraphQLFloat,
      description: 'the order value, expressed with an integer'
    },
    time: {
      type: GraphQLFloat
    },
    payed: {
      type: GraphQLBoolean,
      description: 'is the order payed?'
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
          {type: GraphQLInt, description: 'only require order of the day'},
          ...connectionArgs
      },
      description: 'all the orders of the restaurant',
      resolve: (restaurant, {midnightTime, ...args}, {rootValue}) => co(function*() {
        var restaurantID = restaurant.id;
        var orders = yield getRestaurantOrders({midnightTime, restaurantID}, rootValue);
        return connectionFromArray(orders, args);
      })
    }
  }
});

export var GraphQLInputRestaurant = new GraphQLInputObjectType({
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
    scorable: {
      type: GraphQLBoolean,
      description: 'is restaurant scorable'
    },
    score: {
      type: new GraphQLList(GraphQLInt),
    },
    schedule: {
      type: new GraphQLList(GraphQLInputDay),
      description: 'restaurant schedule on a week basis'
    },
    foods: {
      type: new GraphQLList(GraphQLInputFood),
      description: 'List of foods'
    }
  }
});

var connectRestaurant = connectionDefinitions({
  name: 'Restaurant',
  nodeType: GraphQLRestaurant
});
export var restaurantsConnection = connectRestaurant.connectionType;
export var GraphQLRestaurantEdge = connectRestaurant.edgeType;
