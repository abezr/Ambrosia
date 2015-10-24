import r from 'rethinkdb';
import config from '../config';

var restaurantID = 'fda97adb-ef7f-44c8-b06a-f82572bd24e3';

var card = [{
  parent: 'Pizzas',
  items: [{
    name: 'Margarita',
    price: 3,
    time: 3
  }, {
    name: 'Napolitaine',
    price: 4,
    time: 2
  }, {
    name: 'Sicilienne',
    price: 5,
    time: 3
  }, {
    name: 'Milanaise',
    price: 2,
    time: 2
  }, {
    name: 'Calzone',
    price: 4,
    time: 3
  }, ]
}, {
  parent: 'Boissons',
  items: [{
    name: 'Coca-Cola',
    price: 1.5,
    time: 3
  }, {
    name: 'Beer',
    price: 2,
    time: 1
  }, {
    name: 'Sprite',
    price: 1.5,
    time: 1
  }, {
    name: 'Orangina',
    price: 1.5,
    time: 2
  }, {
    name: 'Pepsi',
    price: 3,
    time: 1
  }, ]
}, {
  parent: 'Dessert',
  items: [{
    name: 'Ile Flotante',
    price: 3.5,
    time: 3
  }, {
    name: 'Tiramisu',
    price: 3,
    time: 2
  }, {
    name: 'Tarte aux Pommes',
    price: 2.6,
    time: 3
  }, {
    name: 'Clafouti',
    price: 2,
    time: 2
  }, {
    name: 'Pancakes',
    price: 4,
    time: 1
  }, ]
}, ];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const midnightTime = new Date().setHours(0, 0, 0, 0);

var fakeOrder = () => {
  var intItems = getRandomInt(1, 9);
  var items = [];
  var price = 0;
  var time = 0;
  for (var i = 0; i < intItems; i++) {
    var parent = card[getRandomInt(0, 2)];
    var child = parent.items[getRandomInt(0, 4)];
    var item = {
      parent: parent.parent,
      name: child.name,
      id: '_' + Math.random().toString(36).substr(2, 9),
    };
    price += child.price;
    time += child.time;
    items.push(item);
  }
  var date = midnightTime + Math.random() * millisecondsPerDay;
  var payed = !!Math.floor(Math.random() * 2);
  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    price: price,
    items: items,
    time: time,
    payed: payed,
    date: date
  };
};
var done = () => {
  console.log(orders[58].items[0].parent, orders[58].items[0].name, orders[58].items[0].id);
};
var orders = [];
var i;
for (i = 0; i < 59; i++) {
  var order = fakeOrder();
  orders.push(order);
  if(i === 58) done();
}

r.connect(config.rethinkdb, function(error, conn) {
  if (error) {
    throw(error);
  } else {
    r.table('restaurant').get(restaurantID).update({
      orders: orders
    }, {
      returnChanges: true
    }).run(conn, function(err, res) {
      if (err) throw(err);
      console.log(res.changes[0].new_val);
    });
  }
});
