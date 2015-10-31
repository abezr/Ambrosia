import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import RestaurantMutation from '../mutations/restaurantmutation';


var card = {
  name: 'Your restaurant\'s name',
  description: 'Describe your restaurant',
  foods: [{
    id: '_' + Math.random().toString(36).substr(2, 9),
    name: 'the food\'s name',
    description: 'the food\'s description',
    meals: [{
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the meal\'s name',
      description: 'the meal\'s description',
      price: 0,
      time: 0
    }]
  }]
};
//list of var to be used on each component
var updateClass;

class Start extends React.Component {

  constructor (props, context) {
    super(props, context);
    console.log('constructor');
    this.state = card;
    updateClass = () => {
      this.setState(card);
    };
  }

  componentDidMount () {
    if(!this.props.user.user.userID) {
      console.log('Start:ComponentDidMount');
      this.props.history.pushState({previousPath: '/start'}, '/register');
    }
  }

  _add = () => {
    this.state.foods.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the food\'s name',
      description: 'the food\'s description',
      meals: [{
        id: '_' + Math.random().toString(36).substr(2, 9),
        name: 'the meal\'s name',
        description: 'the meal\'s description',
        price: 0,
        time: 0
      }]
    });
    this.setState({
      foods: this.state.foods
    });
  }

  _restaurantMutation = () => {
    console.log('Start:restaurantMutation');
    var onSuccess = (restaurant) => {
      //this.props.history.pushState({}, '/board/'+);
      console.log('Mutation successful!', restaurant);
      //loginRequest(Login.user);
    };
    var onFailure = (transaction) => {
      var error = transaction.getError() || new Error('Mutation failed.');
      console.error(error);
    };
    Relay.Store.update(new RestaurantMutation({restaurant: card, user: this.props.user.user}), {onFailure, onSuccess});
  }

  _onChange = (e) => {
    console.log('onChange');
    card[e.target.id] = e.target.value;
    updateClass();
  }

  render () {
    console.log(card);
    var createFood = (food, index) => {
      return (
        <Food {...food} index={index} key={food.id}/>
      );
    }
    return (
    <div className='openarestaurant'>
      <div className='brand'>
        <h1 className='name'><input type ='text' id='name' value={this.state.name} onChange={this._onChange}/></h1>
        <h2 className='description'><textarea type ='text' id='description' value={this.state.description} onChange={this._onChange}/></h2>
      </div>
      <div className='nav'>
        <div className='flex-item-2'><span className='plus' onClick={this._add}>Plus</span></div>
      </div>
      <div className='foods nav-wrap'>
        {this.state.foods.map(createFood)}
      </div>
      <span className='submit' onClick={this._restaurantMutation}>
        Let's Start!
      </span>
    </div>
  );
  }
}

class Food extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.state = {
      expand: false,
      food: this.props,
      input: {name: false, description: false}
    };
  }

  _addMeal = (e) => {
    e.stopPropagation();
    card.foods[this.props.index].meals.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the meal\'s name',
      description: 'the meal\'s description',
      price: 0,
      time: 0
    });
    updateClass();
  }

  _switchExpand = (e) => {
    this.setState({expand: !this.state.expand});
  }

  _close = () => {
    console.log('close');
    card.foods.splice(this.props.index, 1);
    updateClass();
  }

  _onChange = (e) => {
    card.foods[this.props.index][e.target.id] = e.target.value;
    updateClass();
  }

  render () {
    var food = this.props;
    var createMeal = (meal, index) => <Meal {...meal} parentIndex={this.props.index} index={index} key={meal.id}/>
    return (
      <div className='food flex-item-2' onClick={this._switchExpand}>
        <span className='close' onClick={this._close}/>
        <input id = 'name' type = 'text' value={this.props.name} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/><br/>
        <input id = 'description' type = 'text' value={this.props.description} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/>
        <div className={classnames('meals',  {'nav-wrap': this.state.expand, 'hidden': !this.state.expand})}>
          <span className='plus' onClick={this._addMeal}>Plus</span>
          {this.props.meals.map(createMeal)}
        </div>
      </div>
    );
  }
}

class Meal extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.state = {
      meal: this.props,
      input: {name: false, description: false, price: false, time: false}
    }
  }

  _close = (e) => {
    e.stopPropagation();
    card.foods[this.props.parentIndex].meals.splice(this.props.index, 1);
    updateClass();
  }

  _onChange = (e) => {
    card.foods[this.props.parentIndex].meals[this.props.index][e.target.id] = e.target.type === 'number' ? Math.abs(e.target.value) : e.target.value;
    updateClass();
  }

  render () {
    var food = this.props;
    return (
      <div className='meal flex-item-2'>
        <span className='close' onClick={this._close}/>
          <input type='text' id='name' value={this.props.name} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/><br/>
          <input type='text' id='description' value={this.props.description} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/><br/>
          <input type='number' id='price' value={this.props.price} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/><br/>
          <input type='number' id='time' value={this.props.time} onChange={this._onChange} onClick={(e)=> e.stopPropagation()}/>
      </div>
    );
  }
}

export default Relay.createContainer(Start, {
  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    //and you use a mutation you have to call mutation fragment if not you get a warning
    user: () => Relay.QL`
    fragment on Root {
      user {
        id,
        userID,
        restaurants {
          edges {
            node {
              id
            }
          }
        }
        ${RestaurantMutation.getFragment('user')}
      }
    }
    `
  }
});
