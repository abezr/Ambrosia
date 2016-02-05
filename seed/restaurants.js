import r from 'rethinkdb';
import config from '../config';
import foods from './json/foods';
//length 6
var restaurantsName = ['Vesuvio', 'La tour de Jade', 'Vesuvio', 'Le cheval blanc', 'le Khruathaï', 'Chez Ushio', 'Chez Toto'];
//length 5
var descriptions = ['You want find Better Fast-Food in the World', 'Nothing can beat those Pieces of Arts', 'Be ready to travel all accross the world', 'In Huge Quality we Trust', 'Come as you are'];
//length 5
var millisecondsPerDay = 24*60*60*1000;
/**
 * [openHours description]
 * @type {Array} length:3
 */
var openHours = [[{from: millisecondsPerDay/10, to: millisecondsPerDay/3}, {from: millisecondsPerDay/1.5, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/3, to: millisecondsPerDay/2}, {from: millisecondsPerDay/1.4, to: millisecondsPerDay/1.2}], [{from: millisecondsPerDay/10, to: millisecondsPerDay/4}, {from: millisecondsPerDay/3, to: millisecondsPerDay/1.5}, {from: millisecondsPerDay/1.2, to: millisecondsPerDay}]];
var getRandomLocation = (geolocation) => {
  var location = [(geolocation[0] - 0.5) + Math.random(), (geolocation[1] - 0.5) + Math.random()];
  return r.point(location[0],location[1]);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomSchedule() {
 var schedule = [];
 for (var i = 0; i<7; i++) {
   schedule.push({openHours: openHours[getRandomInt(0, 3)]});
 }
 return schedule;
}

function getRandomBoolean() {
  return Math.random() <= 0.5;
}

var fakeRestaurant = (userIDs, geolocation) => {
  return {
    name: restaurantsName[getRandomInt(0, 6)],
    description: descriptions[getRandomInt(0, 5)],
    foods: foods[getRandomInt(0, 2)],
    location: getRandomLocation(geolocation),
    scorable: getRandomBoolean(),
    open: getRandomBoolean(),
    schedule: getRandomSchedule(),
    userID: userIDs[getRandomInt(0, userIDs.length)]
  };
};
var restaurants = [];

var rethinkDB = () => {
  r.connect(config.rethinkdb, function(error, conn) {
    if (error) {
      throw(error);
    } else {
      r.table('user')('id').run(conn, (err, res) => {
        if(err) throw err;
        res.toArray((err, users) => {
          for(var i = 0; i<59; i++) {
            var restaurant = fakeRestaurant(users);
            restaurants.push(restaurant);
          }
          r.table('restaurant').insert(restaurants).run(conn, function (err, res) {
            if(err) throw err;
          });
        });
      });
      // r.table('restaurant').insert(restaurants).run(conn, function (err, res) {
      //   if(err) throw err;
      //   conn.close();
      // });
    }
  });
};

export var restaurantsSeed = (conn, geolocation) => {
  var p = new Promise((resolve, reject) => {
    r.table('user')('id').run(conn, (err, res) => {
      if(err) throw err;
      res.toArray((err, users) => {
        for(var i = 0; i<59; i++) {
          var restaurant = fakeRestaurant(users, geolocation);
          restaurants.push(restaurant);
        }
        r.table('restaurant').insert(restaurants).run(conn, function (err, res) {
          if(err) throw err;
          resolve(res);
        });
      });
    });
  });
  return p;
};
