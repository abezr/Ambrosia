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
  var color = `rgba(${average > 2.5 ? Math.floor((5-average)/2.5 * 255) : 255}, ${average < 2.5 ? Math.floor((average/2.5 * 255)) : 255}, 0, 0.5)`;
  console.log(color);
  return color;
}

export default class Map extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount () {
    this.map = L.map('map', {zoomControl: false});
    if(this.props.geolocation) {
      this._setMap();
      this._setMarkers();
    }
  }

  componentDidUpdate () {
    if(this.props.geolocation) {
      this._setMap();
      this._setMarkers();
    }
  }

  _setMarkers = () => {
    var restaurants = this.props.restaurants;
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
          `<a class='popup' href='http://localhost:3800/restaurant/${restaurant.node.id}'>
            <strong>${restaurant.node.name}</strong><br/>
            ${restaurant.node.description}<br/>
            à ${Math.round(restaurant.node.distance)/1000} Km

          </a>`
        ).setLatLng([restaurant.node.location.coordinates[1], restaurant.node.location.coordinates[0]]);
        marker.on('mouseover', () => {
          popup.openOn(this.map);
          document.querySelector('.leaflet-popup-content-wrapper').style.backgroundColor = restaurant.node.scorable ? getScoreColor(restaurant.node.score) : 'white';
          console.log(document.querySelector('.leaflet-popup-content-wrapper').style.backgroundColor);
        });
      });
    }
  }

  _setMap = () => {
    var map = this.map.setView([this.props.geolocation[1], this.props.geolocation[0]], 11);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: osmAttr,
      maxZoom: 18
    }).addTo(map);
    L.marker([this.props.geolocation[1], this.props.geolocation[0]], {icon: hereYouAre}).addTo(map);
  }

  render() {
    return (
      <div className='restaurants-map'>
        {this.props.geolocation ? '' : <span className='geolocalization'>geolocalization... Please wait</span>}
        <div id='map'>
        </div>
      </div>
    );
  }
}
