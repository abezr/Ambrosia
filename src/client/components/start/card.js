import React from 'react';
import Relay from 'react-relay';
import Close from '../icons/close';
import Input from '../widget/input';
import Textarea from '../widget/textarea';
import classnames from 'classnames';

var restaurant = {
  name: 'Your restaurant\'s name',
  description: 'Describe your restaurant',
  foods: [
    {
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the food\'s name',
      description: 'the food\'s description',
      meals: [
        {
          id: '_' + Math.random().toString(36).substr(2, 9),
          name: 'the meal\'s name',
          description: 'the meal\'s description',
          price: 0,
          time: 0
        }
      ]
    }
  ]
};
//list of var to be used on each component
var updateClass;

class Plus extends React.Component{
  render() {
    return (
      <svg className='plus-icon-svg' viewBox='0 0 80 80'>
        <path d='M0,40 L80,40 M40,0 L40,80'/>
      </svg>
    );
  }
}
//
// class Close extends React.Component {
//   render() {
//     return (
//       <svg className='close-icon-svg' viewBox='0 0 80 80'>
//         <path d='M10,10 L70,70 M70,10 L10,70'/>
//       </svg>
//     );
//   }
// }

export default class Restaurant extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log('restaurant constructor');
    if(localStorage.restaurant) {
      restaurant = JSON.parse(localStorage.restaurant);
    }
    this.state = restaurant;
    updateClass = () => {
      this.setState(restaurant);
    };
  }

  componentWillUnmount () {
    console.log('RestaurantWillLeave');
    localStorage.restaurant = JSON.stringify(restaurant);
  }

  _add = () => {
    this.state.foods.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the food\'s name',
      description: 'the food\'s description',
      meals: [
        {
          id: '_' + Math.random().toString(36).substr(2, 9),
          name: 'the meal\'s name',
          description: 'the meal\'s description',
          price: 0,
          time: 0
        }
      ]
    });
    this.setState({foods: this.state.foods});
  }
  //
  // _restaurantMutation = () => {
  //   console.log('Start:restaurantMutation');
  //   var onSuccess = (restaurant) => {
  //     //this.props.history.pushState({}, '/board/'+);
  //     console.log('Mutation successful!', restaurant);
  //     //loginRequest(Login.user);
  //   };
  //   var onFailure = (transaction) => {
  //     var error = transaction.getError() || new Error('Mutation failed.');
  //     console.error(error);
  //   };
  //   Relay.Store.update(new RestaurantMutation({restaurant: restaurant, user: this.props.user.user}), {onFailure, onSuccess});
  // }

  _update = (e) => {
    console.log('onChange');
    restaurant[e.target.id] = e.target.value;
    updateClass();
  }

  render () {
    var createFood = (food, index) => {
      return(
        <Food {...food} index={index} key={food.id}/>
      );
    }
    return (
      <div className='openarestaurant'>
        <div className='brand'>
          <h1 className='name'>
            <Input id={'name'} value={this.state.name} default={'restaurant-name'} update={this._update}/>
          </h1>
          <h2 className='description'>
            <Textarea id={'description'} value={this.state.description} default={'restaurant-description'} update={this._update}/>
          </h2>
        </div>
        <div className='nav'>
          <div className='flex-item-2' onClick={this._add}>
            <Plus />
          </div>
        </div>
        <div className='foods nav-wrap'>
          {this.state.foods.map(createFood)}
        </div>
      </div>
    );
  }
}

class Food extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      expand: false,
      food: this.props,
      input: {
        name: false,
        description: false
      }
    };
  }

  _addMeal = (e) => {
    e.stopPropagation();
    restaurant.foods[this.props.index].meals.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the meal\'s name',
      description: 'the meal\'s description',
      price: 0,
      time: 0
    });
    updateClass();
  }

  _switchExpand = (e) => {
    this.setState({
      expand: !this.state.expand
    });
  }

  _close = () => {
    console.log('close');
    restaurant.foods.splice(this.props.index, 1);
    updateClass();
  }

  _update = (e) => {
    restaurant.foods[this.props.index][e.target.id] = e.target.value;
    updateClass();
  }

  render () {
    var food = this.props;
    var createMeal = (meal, index) => <Meal {...meal} parentIndex={this.props.index} index={index} key={meal.id}/>;
    return (
      <div className='food flex-item-2'>
        <span className='close' onClick={this._close}>
          <Close/>
        </span>
        <Input id={'name'} value={this.props.name} default={'food-name'} update={this._update}/><br/>
        <Input id={'description'} value={this.props.description} default={'food-name'} update={this._update}/>
        <div className={classnames('meals', {
          'nav-wrap': this.state.expand,
          'hidden': !this.state.expand
        })}>
          <span className='plus' onClick={this._addMeal}>
            <Plus/>
          </span>
          {this.props.meals.map(createMeal)}
        </div>
        <div onClick={this._switchExpand}>
          <svg className='expand-icon-svg' viewBox='0 0 80 60'>
            <path className='expand-icon-path' d={this.state.expand
              ? 'M0,60 L40,0 L80,60'
              : 'M0,0 L40,60 L80,0'} fill='white' stroke='black' strokeWidth={10}></path>
          </svg>
        </div>
      </div>
    );
  }
}

class Meal extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      meal: this.props,
      input: {
        name: false,
        description: false,
        price: false,
        time: false
      }
    }
  }

  _close = (e) => {
    e.stopPropagation();
    restaurant.foods[this.props.parentIndex].meals.splice(this.props.index, 1);
    updateClass();
  }

  _update = (e) => {
    restaurant.foods[this.props.parentIndex].meals[this.props.index][e.target.id] = e.target.type === 'number'
      ? Math.abs(e.target.value)
      : e.target.value;
    updateClass();
  }

  render () {
    var food = this.props;
    return (
      <div className='meal flex-item-2'>
        <span className='close' onClick={this._close}>
          <Close/>
        </span>
        <Input id={'name'} value={this.props.name} default={'meal-name'} update={this._update}/><br/>
        <Input id={'description'} value={this.props.description} default={'meal-description'} update={this._update}/><br/>
        <Input type={'number'} id='price' default={0} value={this.props.price} update={this._update}/>mB<br/>
      </div>
    );
  }
}
