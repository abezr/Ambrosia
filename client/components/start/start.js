import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import classnames from 'classnames';
import Relay from 'react-relay';
import {Link} from 'react-router';

import RestaurantMutation from '../../mutations/restaurantmutation';

var route = {card: {name:{left:'', right:'settings'}, path:{left:'', right:'/start/settings'}}, settings: {name:{left:'card', right:'map'}, path:{left:'/start/card', right:'/start/map'}}, map: {name:{left:'settings', right:'submit'}, path:{left:'/start/settings', right:'/start/submit'}}, submit: {name:{left:'settings', right:'submit'}, path:{left:'/start/settings', right:'/start/submit'}}};

export default class Start extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log('start constructor');
    if(!localStorage.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      localStorage.geolocation = JSON.stringify([position.coords.longitude, position.coords.latitude]);
      this.forceUpdate();
      });
    }
    this._submit = () => {
      var restaurant = JSON.parse(localStorage.restaurant);
      var location = JSON.parse(localStorage.restaurantLocation);
      var settings = JSON.parse(localStorage.settings);
      var input = {
        name: restaurant.name,
        description: restaurant.description,
        foods: restaurant.foods,
        scorable: settings.scorable,
        schedule: settings.schedule,
        location: location
      };
      var onSuccess = (res) => {
        var restaurantID = res.Restaurant.restaurantEdge.node.id;
        localStorage.restaurant = '';
        localStorage.settings = '';
        this.props.history.pushState({}, `/card/${restaurantID}`);
        console.log('Mutation successful!');
        //loginRequest(Login.user);
      };
      var onFailure = (transaction) => {
        var error = transaction.getError() || new Error('Mutation failed.');
        return error;
      };
      return Relay.Store.update(new RestaurantMutation({restaurant: input, user: this.props.user.user}), {onFailure, onSuccess});
    }
  }
  componentDidMount () {
    if(!this.props.user.user.userID) {console.log('Start:ComponentDidMount', this.props.user.user.userID);
      this.props.history.pushState({
        previousPath: '/start/card'
      }, '/register');}
  }

  componentWillReceiveProps (newProps) {
    if (!newProps.user.user.userID) {this.props.history.pushState({
        previousPath: '/start/card'
      }, '/register');}
  }

  _findLocation = () => {
    var match = this.props.location.pathname.match(/card|settings|map|submit/);
    if(match === null) return route['card'];
    return route[match[0]];
  }

  renderChildren = () => {
    return React.Children.map(this.props.children, (child) => {
        return cloneWithProps(child, {
          submit: this._submit
        });
    });
  }

  render() {
    var location = this._findLocation();
    var pathName = this.props.location.pathname.match(/card|settings|map|submit/);
    pathName = pathName ? pathName[0] : 'card';
    return (
      <div className='start-index'>
        {this.renderChildren()}
        <svg className='circles' viewBox='0 0 100 40'>
          <circle cx="12" cy="20" r="10" stroke={pathName === 'card' ? 'black' : 'black'} strokeWidth="2" fill={pathName === 'card' ? 'black' : 'white'} />
          <circle cx="50" cy="20" r="10" stroke={pathName === 'settings' ? 'black' : 'black'} strokeWidth="2" fill={pathName === 'settings' ? 'black' : 'white'} />
          <circle cx="88" cy="20" r="10" stroke={pathName === 'map' || 'submit' ? 'black' : 'black'} strokeWidth="2" fill={pathName === 'map' || pathName === 'submit' ? 'black' : 'white'} />
        </svg>
        <Link className={classnames('link-right', {hidden: !location.name.right})} to={location.path.right}>
          <Button text={location.name.right} direction={'right'} />
        </Link>
        <Link className={classnames('link-left', {hidden: !location.name.left})} to={location.path.left}>
          <Button text={location.name.left} direction={'left'} />
        </Link>
      </div>
    )
  }
}

class Button extends React.Component {
  constructor (props, context) {
    super(props, context);
  }
  render () {
    return (
      <svg className='link-button' viewBox='0 0 100 40'>
        <path className={classnames({hidden: this.props.direction !== 'right'})} d='M0,0 L80,0 L100,20 L80,40 L0,40 Z'/>
        <path className={classnames({hidden: this.props.direction !== 'left'})} d='M20,0 L100,0 L100,40 L20,40 L0,20 Z'/>
        <text textAnchor='middle' x='50' y="25" fill="white">{this.props.text}</text>
      </svg>
    );
  }
}

export default Relay.createContainer(Start, {
  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    user: () => Relay.QL `
    fragment on Root {
      user {
        id,
        userID,
        restaurants(first: 10) {
          edges {
            node {
              id,
              name
            }
          }
        }
        ${RestaurantMutation.getFragment('user')}
      }
    }
    `
  }
});
