import React from 'react';
import Relay from 'react-relay';
import L from 'leaflet';

var osmAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
var hereYouAre = L.icon({
    iconUrl: '/stylesheets/icons/here-you-are.svg',
    iconRetinaUrl: '/stylesheets/icons/here-you-are.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});
var restaurantMarker = L.icon({
  iconUrl: '/stylesheets/icons/restaurant-marker.svg',
  iconRetinaUrl: '/stylesheets/icons/restaurant-marker.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
var burgerMarker = L.icon({
  iconUrl: '/stylesheets/icons/burger-marker.svg',
  iconRetinaUrl: '/stylesheets/icons/burger-marker.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
var lollipopMarker = L.icon({
  iconUrl: '/stylesheets/icons/lollipop-marker.svg',
  iconRetinaUrl: '/stylesheets/icons/lollipop-marker.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});
var marker = L.icon({
  iconUrl: '/stylesheets/icons/marker.svg',
  iconRetinaUrl: '/stylesheets/icons/marker.svg',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

var markers = [marker, lollipopMarker, burgerMarker, restaurantMarker];

var getScoreColor = (score) => {
  var average = 0;
  score.map((mark) => {
    average += mark
  });
  average /= score.length;
  console.log('getScoreColor', average);
  var color = `rgba(${average > 2.5 ? ((5-average)/2.5 * 255) : 255}, ${average < 2.5 ? (average/2.5 * 255) : 255}, 0, 0.5)`;
  console.log(color);
  return color;
}

export default class Home extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {geolocation: window.geolocation};
    if(!window.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      window.geolocation = [position.coords.longitude, position.coords.latitude];
      this.setState({geolocation: window.geolocation});
      this.props.relay.setVariables({location: window.geolocation});
      this.map = L.map('map');
      this._setMap();
      });
    }
  }

  _setMarkers = () => {
    var restaurants = this.props.restaurant.restaurants;
    console.log('_setMarkers', restaurants);
    if (restaurants.edges.length) {
      restaurants.edges.map((restaurant) => {
        var marker = L.marker([restaurant.node.location.coordinates[1], restaurant.node.location.coordinates[0]], {icon: lollipopMarker}).addTo(this.map);
        // marker.bindPopup(
        //   `<div>
        //     ${restaurant.node.name} <br/>
        //     ${restaurant.node.description}
        //   </div>`
        // );
        var popup = L.popup({closeButton: false, closeOnClick: true, offset: L.point(0,-15), className:'restaurant-popup'}).setContent(
          `<div>
            <strong>${restaurant.node.name}</strong><br/>
            ${restaurant.node.description}
          </div>`
        ).setLatLng([restaurant.node.location.coordinates[1], restaurant.node.location.coordinates[0]]);
        marker.on('mouseover', () => {
          popup.openOn(this.map);
          document.querySelector('.leaflet-popup-content-wrapper').style.backgroundColor = restaurant.node.scorable ? getScoreColor(restaurant.node.score): 'white';
        });
      });
    }
  }

  _setMap = () => {
    var map = this.map.setView([this.state.geolocation[1], this.state.geolocation[0]], 11);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: osmAttr,
      maxZoom: 18
    }).addTo(map);
    L.marker([this.state.geolocation[1], this.state.geolocation[0]], {icon: hereYouAre}).addTo(map);
  }

  render() {
    this._setMarkers();
    return (
      <div>
        {this.state.geolocation ? '' : 'geolocalization... Please wait'}
        <div id='map'>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
    location: window.geolocation || null,
    count: 20
  },
  prepareVariables: (prev) => {
    return {location: window.geolocation || null, count: prev.count};
  },
  fragments: {
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurants(first: $count, location: $location) {
          edges {
            node {
              id,
              name,
              description,
              distance,
              score,
              scorable,
              location {
                coordinates,
                type
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});
