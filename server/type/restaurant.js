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
  toGlobalId
}
from 'graphql-relay';

import {
  ordersConnection
}
from './order';

import {getRestaurantOrders, getRestaurant, getUserByID} from '../database';

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
});

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


var GraphQLOpenHours = new GraphQLObjectType({
  name: 'OpenHours',
  fields: {
    from: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'},
    to: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'}
  }
});

var GraphQLInputOpenHours = new GraphQLInputObjectType({
  name: 'InputOpenHours',
  fields: {
    from: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'},
    to: {type: GraphQLInt, description: 'in milliseconds since midnight of that day'}
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

var GraphQLReviews = new GraphQLObjectType({
  name: 'Reviews',
  fields: {
    averageScore: {
      type: GraphQLFloat,
      description: 'the restaurant average score from all reviews'
    },
    comments: {
      type: new GraphQLList(GraphQLString),
      description: 'list of customers reviews/comments'
    },
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
    reviews: {
      type: GraphQLReviews,
      description: 'restaurant score',
      resolve: (restaurant, args, {rootValue}) => co(function*() {
        var restaurantID = restaurant.id,
            scores = 0,
            comments = [];
        console.log('schemaRestaurnat:getScore');
        var orders = yield getRestaurantOrders({restaurantID}, rootValue);
        console.log('database:getRestaurantOrders', orders);
        orders.map(order => {
          if(order.rate) {
            comments.push(order.comment || null);
            scores += order.rate;
          }
        });
        return {averageScore: scores / comments.length, comments: comments};
      })
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
      description: 'all the restaurants orders',
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
