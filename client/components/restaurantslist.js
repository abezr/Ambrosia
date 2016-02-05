import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import Loading from './icons/loading';
import Score from './icons/score';

export default class RestaurantsList extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var restaurants = this.props.restaurants;
    var createRestaurant = function (restaurant) {
      return (
            <Restaurant {...restaurant} key={restaurant.node.id}/>
          );
    };
    return (
      <div className='center-text'>
        <div className={'restaurant-grid-'+this.props.display.length}>{restaurants.length ? restaurants.map(createRestaurant) : <Loading size={'6em'}/>}</div>
        {this.props.loading ? <Loading size = {'2em'}/> : ''}
      </div>
    );
  }
}

class Restaurant extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {expand: false};
  }

  _switchExpand = () => {
    this.setState({
      expand: !this.state.expand
    });
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
          <div className={classnames('restaurant', {selected: this.state.expand, open: restaurant.open})} key={restaurant.id} onClick={this._switchExpand}>
            <div>
              <span className='restaurant-name'>{restaurant.name}</span><br/>
              <span className='restaurant-description'>{restaurant.description}</span>
              <span className='restaurant-distance'>à {Math.round(restaurant.distance)/1000} Km</span>
              {restaurant.scorable ? <span className='restaurant-score'><Score score={restaurant.reviews.averageScore} size={'5em'}/></span> : ''}
              <Link className='order-button' to={path} onClick={(e)=>{e.stopPropagation()}}>Order!</Link>
            </div>
            <div className={classnames('foods', {'flex': this.state.expand}, {hidden: !this.state.expand})}>
              {restaurant.foods.map(createFoods)}
            </div>
          </div>
        );
  }
}
