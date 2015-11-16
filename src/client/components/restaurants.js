import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';

class Restaurants extends React.Component {

  constructor(props, context) {
    super(props, context);
    if(!window.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      window.geolocation = [position.coords.longitude, position.coords.latitude];
      this.props.relay.setVariables({location: geolocation});
      });
    }
    window.onContentScrollEnd = () => {
      if(this.props.restaurant.restaurants.pageInfo.hasNextPage){
        this.props.relay.setVariables({count: this.props.relay.variables.count + 10});
      }
    }
  }

  render() {
    var restaurants = this.props.restaurant.restaurants;
    var createRestaurant = function (restaurant) {
      return (
            <Restaurant {...restaurant} key={restaurant.node.id}/>
          );
    };
    return (
      <div className='center-text' onScroll = {this.checkBottom}>
        <h1>Restaurants-list</h1>
        <div className='restaurant-list'>{restaurants.edges.length ? restaurants.edges.map(createRestaurant) : 'Geolocalization... Please Wait'}</div>
      </div>
    );
  }
}

class Restaurant extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {expand: false};
  }

  render() {
    var restaurant = this.props.node;
    //this.props.node.id is a global id!!!
    var path = '/restaurant/' + this.props.node.id;
    var createFoods = function (food) {
      var createMeals = function (meal) {
        return (
          <div className='meal' key={meal.id}>
            <span className='meal-name'>{meal.name}</span><br/>
            <span className='meal-description'>{meal.description}</span>
          </div>
        );
      };
      return (
        <div className='food' key={food.id}>
          <span className='food-name'>{food.name}</span>
          <div className='meals'>
            {food.meals.map(createMeals)}
          </div>
        </div>
      );
    };
    return (
          <div className='restaurant' key={restaurant.id} onClick={this._switchExpand}>
            <div>
              <span className='restaurant-name'>{restaurant.name}</span><br/>
              <span className='restaurant-description'>{restaurant.description}</span>
              <span className='restaurant-distance'>à {Math.round(restaurant.distance)/1000} Km</span>
              <Link className='order-button' to={path}>Order this one!</Link>
            </div>
            <div className={classnames('foods', {'nav-wrap': this.state.expand}, {hidden: !this.state.expand})}>
              {restaurant.foods.map(createFoods)}
            </div>
          </div>
        );
  }

  _switchExpand = () => {
    this.setState({
      expand: !this.state.expand
    });
  }
}

export default Relay.createContainer(Restaurants, {
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
              foods {
                name,
                description
                meals {
                  name,
                  description
                }
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
