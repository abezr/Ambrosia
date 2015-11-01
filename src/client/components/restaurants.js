import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';

class Restaurants extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var restaurants = this.props.restaurant.restaurants;
    var createRestaurant = function (restaurant) {
      return (
            <Restaurant {...restaurant} key={restaurant.node.id}/>
          );
    };
    return (
      <div>
        <h1>List of all restaurants</h1>
        <div className='restaurant-list'>{restaurants.edges.map(createRestaurant)}</div>
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

  fragments: {
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurants(first: 10) {
          edges {
            node {
              id,
              name,
              description,
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
        }
      }
    `
  }
});
