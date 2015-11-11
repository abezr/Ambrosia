import r from 'rethinkdb';
import config from '../config';
import foods from './json/foods';
//length 6
var restaurantsName = ['Vesuvio', 'La tour de Jade', 'Vesuvio', 'Le cheval blanc', 'le Khruathaï', 'Chez Ushio', 'Chez Toto'];
//length 5
var descriptions = ['You want find Better Fast-Food in the World', 'Nothing can beat those Pieces of Arts', 'Be ready to travel all accross the world', 'In Huge Quality we Trust', 'Come as you are'];
//length 5
var userIDs = ['d6525f9b-7ff3-4b5d-81ef-7a0139984055', 'd6525f9b-7ff3-4b5d-81ef-7a0139984055', 'd6525f9b-7ff3-4b5d-81ef-7a0139984055', 'd6525f9b-7ff3-4b5d-81ef-7a0139984055', 'd6525f9b-7ff3-4b5d-81ef-7a0139984055'];
var millisecondsPerDay = 24*60*60*1000;
/**
 * [openHours description]
 * @type {Array} length:3
 */
var openHours = [[{from: millisecondsPerDay/10, to: millisecondsPerDay/3}, {from: millisecondsPerDay/1.5, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/3, to: millisecondsPerDay/2}, {from: millisecondsPerDay/1.4, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/10, to: millisecondsPerDay/4}, {from: millisecondsPerDay/3, to: millisecondsPerDay/1.5}, {from: millisecondsPerDay/1.2, to: millisecondsPerDay}]];
var getRandomLocation = () => {
  var location = [7 + Math.random(), 47.3 + Math.random()];
  return r.point(location[0],location[1]);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomScore() {
  var scorable;
  var score = [];
  if (Math.random() < 0.5) {
    scorable = true;
    for (var i = 0; i < getRandomInt(12, 99); i++) {
      score.push(getRandomInt(0, 5));
    }
  } else {
    scorable = false;
  }
  return {
    scorable: scorable,
    score: score
  };
}

function getRandomSchedule() {
 var week = ['monday', 'tuesday', 'wednesday', 'thirsday', 'friday', 'saturday', 'sunday'];
 var schedule = [];
 for (var i = 0; i<7; i++) {
   schedule.push({
     day: week[i],
     openHours: openHours[getRandomInt(0, 3)]
   });
 }
 return schedule;
}

function getRandomBoolean() {
  return Math.random() <= 0.5 ? true : false;
}

var fakeRestaurant = () => {
  var randomScore = getRandomScore();
  return {
    name: restaurantsName[getRandomInt(0, 6)],
    description: descriptions[getRandomInt(0, 5)],
    foods: foods[getRandomInt(0, 2)],
    location: getRandomLocation(),
    scorable: randomScore.scorable,
    score: randomScore.score,
    open: getRandomBoolean(),
    schedule: getRandomSchedule(),
    orders: [],
    userID: userIDs[getRandomInt(0, 5)]
  };
};
var restaurants = [];

var rethinkDB = () => {
  r.connect(config.rethinkdb, function(error, conn) {
    if (error) {
      throw(error);
    } else {
      r.table('restaurant').insert(restaurants).run(conn, function (err, res) {
        if(err) throw err;
        conn.close();
      });
    }
  });
};

for(var i = 0; i< 59; i++) {
  var restaurant = fakeRestaurant();
  restaurants.push(restaurant);
  if(i === 58) rethinkDB();
}
