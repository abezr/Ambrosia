import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import Relay from 'react-relay';
import classnames from 'classnames';
import request from 'superagent';
import L from 'leaflet';
import Loading from '../icons/loading';

var osmAttr = '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';

var hereYouAre = L.icon({
    iconUrl: '/stylesheets/icons/here-you-are.svg',
    iconRetinaUrl: '/stylesheets/icons/here-you-are.svg',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

var address;

export default class Map extends React.Component {

  constructor(props, context) {
    super(props, context);
    address = {
      latlng: localStorage.restaurantLocation ? JSON.parse(localStorage.restaurantLocation) : localStorage.geolocation ? JSON.parse(localStorage.geolocation) : '',
      street: 'restaurant street',
      city: 'restaurant city',
      zipCode: 'ZIP code',
      country: 'restaurant country'
    };

    this.getAddress = (coord) => {
      console.log('getAddress');
      request.get(`http://nominatim.openstreetmap.org/reverse?format=json&lat=${coord[1]}&lon=${coord[0]}&zoom=18&addressdetails=1`)
      .end((err, res)=>{
        if(err) {
          throw(err);
        } else {
          console.log(res);
          var ad = res.body.address;
          address = {
            latlng: [coord[0], coord[1]],
            street: `${ad.house_number} ${ad.road}`,
            city: ad.village || ad.town,
            zipCode: ad.postcode,
            country: ad.country
          }
          this.map.setView([address.latlng[1], address.latlng[0]], 18);
          this.marker.setLatLng([address.latlng[1], address.latlng[0]]);
          //this.props.submit('address', address);
          this.forceUpdate();
        }
      });
    }
    this._getLatlng = () => {
      console.log('getLatLng');
      request.get(`http://nominatim.openstreetmap.org/search?q=${address.street},+${address.city},+${address.country || ''},+${address.zipCode || ''}&format=json&addressdetails=1`)
      .end((err, res)=>{
        if(err) {
          throw(err);
        } else {
          var res = res.body[0];
          address = {
            latlng: [res.lon, res.lat],
            street: `${res.address.house_number} ${res.address.road}`,
            city: res.address.village || res.address.town,
            zipCode: res.address.postcode,
            country: res.address.country
          };
          this.map.setView([address.latlng[1], address.latlng[0]], 18);
          this.marker.setLatLng([address.latlng[1], address.latlng[0]]);
          //this.props.submit('address', address);
          this.forceUpdate();
        }
      })
    }
  }

  componentWillReceiveProps () {
    if(address.latlng) {
      this.getAddress(address.latlng);
    }
  }

  componentWillUnmount () {
    localStorage.restaurantLocation = JSON.stringify([address.latlng[0], address.latlng[1]]);
    console.log('map:componentWillUnmount', localStorage.restaurantLocation);
  }

  componentDidMount () {
    this.map = L.map('map', {zoomControl: false});
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: osmAttr,
      maxZoom: 25
    }).addTo(this.map);
    this.marker = L.marker([50.5, 30.5], {icon: hereYouAre}).addTo(this.map);
    if(address.latlng) {
      this.getAddress(address.latlng);
    }
  }

  _updateAddress = () => {
      this._getLatlng()
  };

  _onChange = (e) => {
    console.log(e, 'onchange');
    address[e.target.id] = e.target.value;
    this.forceUpdate();
  };

  renderChildren = () => {
    return React.Children.map(this.props.children, (child) => {
        return cloneWithProps(child, {
          submit: this.props.submit,
        });
    });
  };

  render() {
    return (
      <div className='restaurants-map'>
        {this.renderChildren()}
        <div id='form'>
          <span>Street : </span><input id='street' type='text' value={address.street} onChange={this._onChange} /><br/>
          <span>ZIP-code : </span><input id='zipCode' type='text' value={address.zipCode} onChange={this._onChange} /><br/>
          <span>City : </span><input id='city' type='text' value={address.city} onChange={this._onChange} /><br/>
          <span>Country : </span><input id='country' type='text' value={address.country} onChange={this._onChange} /><br/>
          <button className='button' onClick={this._getLatlng}>Update Address</button>
        </div>
        <span className={classnames('center-wrapper', {hidden: localStorage.geolocation})}><Loading size={'7em'}/></span>
        <div id='map'>
        </div>
      </div>
    );
  }
}
