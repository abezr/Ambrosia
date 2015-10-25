import r from 'rethinkdb';
import co from 'co';

export function getUser(rootValue, id) {
  if (!rootValue.cookies.get('userID')) return {
    name: '',
    mail: ''
  };
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('user').get(rootValue.cookies.get('userID')).run(rootValue.conn, function(error, result) {
        if (error) reject(error);
        resolve(result);
      });
    });
    return yield p.then(function(value) {
      console.log('database:getUser', value);
      if (!value) return {
        mail: '',
        name: ''
      };
      value.userID = value.id;
      return value;
    });
  });
}
//to use it with relay use rootValue.conn as run arguments
export function getUserByCredentials(credentials, rootValue) {
  return co(function*() {
    var result;
    yield r.table('user').filter(function(user) {
      return (user('mail').eq(credentials.mail)
          .or(user('pseudo').eq(credentials.mail)))
        .and(user('password').eq(credentials.password));
    }).run(rootValue.conn, function(error, cursor) {
      if (error) throw error;
      if (cursor.length === 0) {
        console.log('database:cursor.length=0');
        return {
          mail: '',
          pseudo: '',
          error: 'mail or password incorrect'
        };
      }
      cursor.each(function(err, row) {
        console.log('database:cursor.each', row);
        if (err) throw err;
        result = row;
      });
    });
    result.userID = result.id;
    rootValue.cookies.set('userID', result.id);
    console.log('database:getUserByCredentials:session', result);
    return result;
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
    var user = yield r.table('user').insert({
      mail: credentials.mail,
      password: credentials.password,
      orders: []
    }, {
      returnChanges: true
    }).run(rootValue.conn, function(err, result) {
      console.log('database:addUser', result.changes[0].new_val, result);
    });
    rootValue.session.user = user.changes[0].new_val;
    return user.changes[0].new_val;
  });
}
/**
 * [updateUser udate user fields]
 * @param {[string]} id [rethinkdb user id]
 * @param  {[object]} user [{id: string, name: string || null, mail: string || null, profilePicture:string || null}]
 * @param  {[object]} rootValue [graphQL rootValue object]
 * @return {[object]}      [a GrapQLUser object]
 */
export function updateUser(id, user, rootValue) {
  var data = {};
  for(var key in user) {
    if (user[key] !== null && key !== 'id') data[key] = user[key];
  }
  console.log('database:updateUser:data', data);
  return co(function*() {
    var res = yield r.table('user').get(id).update(data, {
      returnChanges: true
    }).run(rootValue.conn);
    return res.changes[0].new_val;
  });
}

export function addRestaurant(restaurant, rootValue) {
  return co(function*() {
    restaurant.orders = [];
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
      console.log('database:getRestaurant', id, value);
      var data = value || null;
      return data;
    });
  });
}

export function getRestaurants(conn) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').run(conn, function(err, result) {
        result.toArray(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    });
    return yield p.then(function(value) {
      console.log('getRestaurant');
      return value;
    });
  });
}

export function addOrder(restaurantID, userID, order, rootValue) {
  console.log('database:addOrder', restaurantID, userID, order);
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
        resolve(res.changes[0].new_val);
      });
    });
    var q = new Promise(function(resolve, reject) {
      r.table('user').get(userID).update({
        orders: r.row('orders').append(order)
      }, {
        returnChanges: true
      }).run(rootValue.conn, function(err, res) {
        if (err) reject(err);
        resolve(res.changes[0].new_val);
      });
    });
    var result = yield [p, q];
    console.log('database:addOrder', result);
    return yield p.then(function(value) {
      return value;
    });
  });
}

export function getRestaurantOrders(args, rootValue) {
var endofDay = args.midnightTime + 24*60*60*1000;
console.log('database:getRestaurantOrders', args.restaurantID);
return co(function*() {
  var p = new Promise(function(resolve, reject) {
    r.table('restaurant').get(args.restaurantID)('orders').filter(r.row('date').lt(endofDay).and(r.row("date").gt(args.midnightTime))).orderBy('date').run(rootValue.conn, function(err, res) {
        if(err) reject(err);
        resolve(res);
    });
  });
  var orders = yield p;
  console.log('database:getRestaurantOrders', orders);
  return yield p;
});
}

export function getUserOrders(userID, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('user').get(userID)('orders').run(rootValue.conn, function(err, res) {
        res.toArray(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
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
