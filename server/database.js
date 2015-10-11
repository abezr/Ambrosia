import r from 'rethinkdb';
import co from 'co';

export function getUser(rootValue, id) {
  if (id === '') return {name:'', mail:''};
  return co(function* () {
    var p = new Promise(function(resolve, reject) {
      r.table('user').get(id).run(rootValue.conn, function(error, result){
        if(error) reject(error);
        resolve(result);
      });
    });
    return yield p.then(function(value){
      console.log('database:getUser', value);
      value.userID = value.id;
      var data = value || {mail:'', user:''};
      return data;
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
      password: credentials.password
    }, {
      returnChanges: true
    }).run(rootValue.conn, function(err, result) {
      console.log('database:addUser', result.changes[0].new_val, result);
    });
    rootValue.session.user = user.changes[0].new_val;
    return user.changes[0].new_val;
  });
}

export function updateUser(id, name, conn) {
  return co(function*() {
    var res = yield r.table('user').get(id).update({
      name: name
    }, {
      returnChanges: true
    }).run(conn);
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
        if(err) reject(err);
        resolve(res);
      });
    });
    return yield p.then(function(value){
      console.log('database:getRestaurant', value);
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
          if(err) reject(err);
          resolve(res);
        });
      });
    });
    return yield p.then(function(value){
      console.log('getRestaurant');
      return value;
    });
  });
}

export function addOrder(restaurantID, order, rootValue) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('restaurant').get(restaurantID)('orders').append(order).run(rootValue.conn, function (err, res) {
        console.log('database:addOrder', res);
        res.toArray(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    });
    return yield p.then(function(value){
      return value;
    });
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
