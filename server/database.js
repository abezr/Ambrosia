import r from 'rethinkdb';
import co from 'co';

const logID = 'qldfjbe2434RZRFeerg';

export function getUser(rootValue) {
  if (!rootValue.cookies.get('userID')) return {
    name: '',
    mail: '',
    id: logID
  };
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('user').get(rootValue.cookies.get('userID')).run(rootValue.conn, function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
    return yield p.then(function(value) {
      if (!value) return {
        mail: '',
        name: '',
        id: logID
      };
      value.userID = value.id;
      value.id = logID;
      return value;
    });
  });
}

export function getUserByCredentials(credentials, rootValue) {
  return co(function*() {
    if (credentials.mail === '') {
      rootValue.cookies.set('userID', '');
      return ({
        name: '',
        mail: '',
        userID: '',
        profilePicture: '',
        id: logID
      });
    }
    var p = new Promise((resolve, reject) => {
        r.table('user').filter(function(user) {
          return (user('mail').eq(credentials.mail)
              .or(user('pseudo').eq(credentials.mail)))
            .and(user('password').eq(credentials.password));
        }).run(rootValue.conn, function(error, cursor) {
          if (error) reject(error);
          if (cursor.length === 0) {
            console.log('database:cursor.length=0');
            reject ({
              error: 'mail or password incorrect'
            });
          }
          cursor.each(function(err, row) {
            console.log('database:cursor.each', row);
            if (err) throw err;
            resolve(row);
          });
        });
    });
    var result = yield p;
    if(result) {
      var user = {
        name: result.name || '',
        mail: result.mail || '',
        userID: result.id,
        id: logID,
        profilePicture: result.profilePicture || null,
      };
    }
    rootValue.cookies.set('userID', user.userID);
    console.log('database:getUserByCredentials:session', user);
    return user;
  });
}

export function getUsers(conn) {
  return co(function*() {
    var friends;
    yield r.table('user').run(conn, function(err, result) {
      friends = result;
    });
    console.log('database:getUsers', friends);
    return friends.toArray();
  });
}

export function addUser(credentials, rootValue) {
  return co(function*() {
    // yield r.table('user').insert({
    //   name: credentials.name,
    //   mail: credentials.mail,
    //   password: credentials.password
    // }).run(conn, function (err, result) {
    //   console.log('database:addUser', err, result);
    // });
    var p = new Promise(function(resolve, reject) {
      r.table('user').insert({
        mail: credentials.mail,
        password: credentials.password,
        orders: [],
        restaurants: []
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, result) {
        var new_val = result.changes[0].new_val;
        var user = {
          mail: new_val.mail,
          userID: new_val.id,
          id: logID,
          profilePicture: new_val.profilePicture || '',
        };
        rootValue.cookies.set('userID', new_val.id);
        resolve(user);
      });
    });
    console.log('database:addUser');
    return yield p;
  });
}
/**
 * [updateUser udate user fields]
 * @param {[string]} id [rethinkdb user id]
 * @param  {[object]} user [{id: string, name: string || null, mail: string || null, profilePicture:string || null}]
 * @param  {[object]} rootValue [graphQL rootValue object]
 * @return {[object]}      [a GrapQLUser object]
 */
export function updateUser(args, rootValue) {
  var data = {};
  for (var key in args) {
    if (args[key] !== null && key !== 'id' && key !== 'clientMutationId' && key !== 'userID') data[key] = args[key];
  }
  console.log('database:updateUser:data', data);
  return co(function*() {
    var res = yield r.table('user').get(args.userID).update(data, {
      returnChanges: true
    }).run(rootValue.conn);
    return res.changes[0].new_val;
  });
}

export function addRestaurant({
  restaurant, userID
}, rootValue) {
  return co(function*() {
    restaurant.orders = [];
    restaurant.userID = userID;
    var data = yield r.table('restaurant').insert(restaurant, {
      returnChanges: true
    }).run(rootValue.conn, function(err, result) {});
    return data.changes[0].new_val;
  });
}

export function getRestaurant(id, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').get(id).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        resolve(res);
      });
    });
    return yield p.then(function(value) {
      var data = value || null;
      return data;
    });
  });
}

export function getRestaurants(rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        if (res) {
          res.toArray(function(err, res) {
            if (err) reject(err);
            console.log('database:getRestaurants', res);
            resolve(res);
          });
        } else {
          resolve([]);
        }
      });
    });
    return yield p;
  });
}

export function getNearestRestaurants(location, rootValue) {
  if(!location) return [];
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').getNearest(r.point(location[0], location[1]), {
        index: 'location',
        maxDist: 500000
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        if (res) {
          res.toArray(function(err, res) {
            if (err) reject(err);
            var newResult = res.map((raw) => {
              delete raw.doc.location['$reql_type$'];
              var resto = raw.doc;
              resto.distance = raw.dist;
              return resto;
            });
            resolve(newResult);
          });
        }
      });
    });
    return yield p;
  });
}

export function getRestaurantsByName(args, rootValue) {
  console.log('database:getRestaurantsByName', args);
  if(!args.name) return [];
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').getNearest(r.point(args.location[0], args.location[1]), {
        index: 'location',
        maxDist: 1000000
        //filter is'nt working with that regex
      }).filter({doc: {name: `(?i)^${args.name}$`}}).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        if (res) {
          res.toArray(function(err, res) {
            console.log('database:getResraurantsByName:res', res);
            if (err) reject(err);
            var newResult = res.map((raw) => {
              delete raw.doc.location['$reql_type$'];
              var resto = raw.doc;
              resto.distance = raw.dist;
              return resto;
            });
            resolve(newResult);
          });
        }
      });
    });
    return yield p;
  });
}

export function getUserRestaurants(userID, rootValue) {
  if (!userID) return [];
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').getAll(userID, {
        index: 'userID'
      }).run(rootValue.conn, function(err, result) {
        if (result) {
          result.toArray(function(err, res) {
            if (err) reject(err);
            resolve(res);
          });
        } else {
          resolve([]);
        }
      });
    });
    return yield p;
  });
}
/**
 * [addOrder an user order something => restaurant and user both update]
 * @param {[string]} restaurantID [description]
 * @param {[string]} userID       [description]
 * @param {[object]} order        [description]
 * @param {[object]} rootValue    [description]
 * @return {[array]} [array of both changed fields restaurant and user]
 */
export function addOrder(restaurantID, userID, order, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      //find a solution to fullfill an agenda
      //for now we just add the orders in any order
      r.table('restaurant').get(restaurantID).update({
        orders: r.row('orders').append(order)
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        resolve(res.changes[0].new_val.orders);
      });
    });
    var q = new Promise(function(resolve, reject) {
      r.table('user').get(userID).update({
        orders: r.row('orders').append(order)
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        resolve(res.changes[0].new_val.orders);
      });
    });
    return yield [p, q];
  });
}

export function getRestaurantOrders(args, rootValue) {
  //var endofDay = args.midnightTime + 24*60*60*1000;
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').get(args.restaurantID)('orders').filter(r.row("date").gt(args.midnightTime)).orderBy('date').run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        resolve(res);
      });
    });
    return yield p;
  });
}

export function getUserOrders(userID, rootValue) {
  if (!userID) return [];
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('user').get(userID)('orders').run(rootValue.conn, function(err, res) {
        if (res) {
          res.toArray(function(err, res) {
            if (err) reject(err);
            resolve(res);
          });
        } else {
          resolve([]);
        }
      });
    });
    return yield p;
  });
}
/**
 * [updateRestaurantCard function that update restaurant's card]
 * @param  {[object]} args      [object with id and card value]
 * @param  {[object]} rootValue [description]
 * @return {[object]}           [return the updated restaurant object]
 */
export function updateRestaurantCard(args, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').get(args.restaurantID).update({
        name: args.card.name,
        description: args.card.description,
        foods: args.card.foods
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        if(!res.changes[0]) return null;
        resolve(res.changes[0].new_val);
      });
    });
    return yield p;
  });
}

export function updateRestaurantSettings(args, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').get(args.restaurantID).update({
        scorable: args.scorable,
        open: args.open,
        schedule: args.schedule
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        if(!res.changes[0]) return null;
        resolve(res.changes[0].new_val);
      });
    });
    return yield p;
  });
}
// export function getRestaurants(conn) {
//   return co(function*() {
//       var restaurants;
//       yield r.table('restaurant').run(conn, function(err, result) {
//         restaurants = result;
//       });
//       console.log('database:getRestaurants', restaurants.toArray());
//       return restaurants.toArray();
//     });
// }
