import r from 'rethinkdb';
import config from '../config';

var restaurantID = '5c9499aa-f49a-4205-9f20-3c81b30920f1';
var userIDs = ["ebe5b9c2-ea9e-4c90-b3f0-0ef86f15bba1", "969a9c63-12ed-4813-85c1-83bde28e9c57", "9934e0b7-e4df-448f-b931-082d5c50982e", "9ef198e8-8240-47fd-9d53-b763fba6ee9a"];
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

var fakeOrder = () => {
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
  var userID = userIDs[getRandomInt(0, 4)];
  var treated = (Time > time)
    ? (Math.random() > 0.8) ? false : true
    : false;
  var payed = !!Math.floor(Math.random() * 2);
  return {
    id: '_' + Math.random().toString(36).substr(2, 9),
    restaurantID: restaurantID,
    userID: userID,
    price: price,
    items: items,
    payed: payed,
    treated: treated,
    date: time,
    message: message
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
    r.table('order').insert(orders).run(conn, function(err, res) {
      if (err) throw(err);
      console.log(res);
    });
  }
});
