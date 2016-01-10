import r from 'rethinkdb';
import config from '../config';
import co from 'co';

var messages = ['sans oignons sauce blanche le kebab stp!', 'sans anchois la margarita thanks!', 'fais moi rever toto!', 'charge bien sur la mayonnaise stp', 'sans tomate la Napolitaine svp', 'passe le bonjour à ton père!']

var card = [{
  parent: 'Pizzas',
  items: [{
    name: 'Margarita',
    price: 3
  }, {
    name: 'Napolitaine',
    price: 4
  }, {
    name: 'Sicilienne',
    price: 5
  }, {
    name: 'Milanaise',
    price: 2
  }, {
    name: 'Calzone',
    price: 4
  }, ]
}, {
  parent: 'Boissons',
  items: [{
    name: 'Coca-Cola',
    price: 1.5
  }, {
    name: 'Beer',
    price: 2
  }, {
    name: 'Sprite',
    price: 1.5
  }, {
    name: 'Orangina',
    price: 1.5
  }, {
    name: 'Pepsi',
    price: 3
  }, ]
}, {
  parent: 'Dessert',
  items: [{
    name: 'Ile Flotante',
    price: 3.5
  }, {
    name: 'Tiramisu',
    price: 3
  }, {
    name: 'Tarte aux Pommes',
    price: 2.6
  }, {
    name: 'Clafouti',
    price: 2
  }, {
    name: 'Pancakes',
    price: 4
  }, ]
}, ];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const Time = new Date().getTime();
const midnightTime = new Date().setHours(0, 0, 0, 0);

var fakeOrder = (restaurantID, usersID) => {
  var intItems = getRandomInt(1, 9);
  var items = [];
  var price = 0;
  for (var i = 0; i < intItems; i++) {
    var parent = card[getRandomInt(0, 3)];
    var child = parent.items[getRandomInt(0, 5)];
    var item = {
      parent: parent.parent,
      name: child.name,
      id: '_' + Math.random().toString(36).substr(2, 9),
    };
    price += child.price;
    items.push(item);
  }
  var time = midnightTime + Math.random() * millisecondsPerDay;
  var message = messages[getRandomInt(0, 6)];
  var treated = (Time > time) ? (Math.random() > 0.8) ? false : true : false;
  var payed = !!Math.floor(Math.random() * 2);
  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    restaurantID: restaurantID,
    userID: usersID[getRandomInt(0, usersID.length)],
    price: price,
    items: items,
    payed: payed,
    treated: treated,
    date: time,
    message: message
  };
};
var index = 0;
var fakeOrders = (restaurantID, usersID) => {
  var done = () => {
    console.log(index++, orders[58].items[0].parent, orders[58].items[0].name, orders[58].items[0].id);
  };
  var orders = [];
  var i;
  for (i = 0; i < 59; i++) {
    var order = fakeOrder(restaurantID, usersID);
    orders.push(order);
    if (i === 58) done();
  }
  return orders;
};

// r.connect(config.rethinkdb, function(error, conn) {
//   if (error) {
//     throw (error);
//   } else {
//     r.table('restaurant')('id').run(conn, (err, res) => {
//       if (err) process.exit(1);
//       res.each((err, restaurantID) => {
//         var orders = fakeOrders(restaurantID);
//         r.table('order').insert(orders).run(conn, function(err, res) {
//           if (err) process.exit(1);
//         });
//       }, () => {
//         conn.close();
//       });
//     });
//     // restaurantsID = yield p;
//     // restaurantsID.forEach((restaurantID, i) => {
//     //   var orders = fakeOrder(restaurantID);
//     //   r.table('order').insert(orders).run(conn, function(err, res) {
//     //     if (err) throw(err);
//     //     console.log(res);
//     //   });
//     // });
//   }
// });
//
export var ordersSeed = (conn) => {
  return co(function* () {
    var p = new Promise((resolve, reject) => {
      r.table('restaurant')('id').run(conn, (err, res) => {
        if (err) {
          console.log('ordersSeed:getRestaurantIDs', 'rethinkdb cant get restaurantID');
          process.exit(1);
        }
        res.toArray((err, result) => {
          resolve(result);
        });
      });
    });
    var q =  new Promise((resolve, reject) => {
      r.table('user')('id').run(conn, (err, res) => {
        if (err) {
          console.log('ordersSeed:getUserIDs', 'rethinkdb cant get userID');
          process.exit(1);
        }
        res.toArray((err, result) => {
          resolve(result);
        });
      });
    });
    return yield [p, q];
  }).then((value)=> {
    console.log('restaurantsID', value[0]);
    console.log('usersID', value[1]);
    value[0].forEach((restaurantID, i) => {
      var orders = fakeOrders(restaurantID, value[1]);
      r.table('order').insert(orders).run(conn, function(err, res) {
        if (err) {
          console.log('ordersSeed:insertOrders', 'rethinkdb cant insert orders');
          process.exit(1);
        }
      });
    });
  });
};
//
// export var ordersSeed = (conn) => {
//   var p = new Promise((resolve, reject) => {
//     r.table('restaurant')('id').run(conn, (err, res) => {
//       if (err) {
//         console.log('ordersSeed:getRestaurantIDs', 'rethinkdb cant get restaurantID');
//         process.exit(1);
//       }
//       res.each((err, restaurantID) => {
//         var orders = fakeOrders(restaurantID);
//         r.table('order').insert(orders).run(conn, function(err, res) {
//           if (err) {
//             console.log('ordersSeed:insertOrders', 'rethinkdb cant insert orders');
//             process.exit(1);
//           }
//         });
//       }, () => {
//         resolve('orders ready');
//         console.log('orders ready');
//       });
//     });
//   });
//   return p;
// };
