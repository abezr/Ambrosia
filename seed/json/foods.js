var descriptions = ['try it that\'s good for you', 'smell like teen spirit', 'spicy as hell', 'you want finish it', 'eat as much as you can', 'to drink it is to love it', 'a perfect bunch of meats', 'hell of a dream'];
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var card1 = [{
  name: 'Pizzas',
  description: descriptions[getRandomInt(0, 8)],
  id: '_' + Math.random().toString(36).substr(2, 9),
  meals: [{
    name: 'Margarita',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Napolitaine',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Sicilienne',
    description: descriptions[getRandomInt(0, 8)],
    price: 5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Milanaise',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Calzone',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, {
  name: 'Boissons',
  description: descriptions[getRandomInt(0, 8)],
  meals: [{
    name: 'Coca-Cola',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Beer',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Sprite',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Orangina',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Pepsi',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, {
  name: 'Dessert',
  description: descriptions[getRandomInt(0, 8)],
  meals: [{
    name: 'Ile Flotante',
    description: descriptions[getRandomInt(0, 8)],
    price: 3.5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Tiramisu',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Tarte aux Pommes',
    description: descriptions[getRandomInt(0, 8)],
    price: 2.6,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Clafouti',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Pancakes',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, ];

var card2 = [{
  name: 'Nems',
  description: descriptions[getRandomInt(0, 8)],
  meals: [{
    name: 'Au Poulet',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Au Boeuf',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Au crabe',
    description: descriptions[getRandomInt(0, 8)],
    price: 5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Au Crevettes',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Au Canard',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, {
  name: 'Boissons',
  description: descriptions[getRandomInt(0, 8)],
  meals: [{
    name: 'Coca-Cola',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Beer',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Sprite',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Orangina',
    description: descriptions[getRandomInt(0, 8)],
    price: 1.5,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Pepsi',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, {
  name: 'Dessert',
  description: descriptions[getRandomInt(0, 8)],
  meals: [{
    name: 'Ile Flotante',
    description: descriptions[getRandomInt(0, 8)],
    price: 3.5,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Tiramisu',
    description: descriptions[getRandomInt(0, 8)],
    price: 3,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Tarte aux Pommes',
    description: descriptions[getRandomInt(0, 8)],
    price: 2.6,
    time: 3,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Clafouti',
    description: descriptions[getRandomInt(0, 8)],
    price: 2,
    time: 2,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, {
    name: 'Pancakes',
    description: descriptions[getRandomInt(0, 8)],
    price: 4,
    time: 1,
    id: '_' + Math.random().toString(36).substr(2, 9)
  }, ]
}, ];

export default [card1, card2];
