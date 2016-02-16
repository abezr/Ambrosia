/**
 * @flow
 */

 /**
 * This component has two props
 * 1st one is the card object
 * 2nd one is the store, a function that updates the card object
 */


 import React from 'react';
 import Relay from 'react-relay';
 import classnames from 'classnames';
 import RestaurantMutation from '../mutations/restaurantmutation';

//this object update one value at a time
var args = {
  length: 2,
  value: 'foods',
  index: {
    number: 0,
    value: 'meals',
    index: {
      number: 0,
      value: 'id'
    }
  }
}

function cardStore () {
  this.card = {
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
}
cardStore.prototype.update = function (value, args) {
  this.card[args.value][args.index || null][args.index.value] = value
}


//list of var to be used on each component
var updateClass;

class Plus extends React.Component {
  render() {
    return (
      <svg className='plus-icon-svg' viewBox='0 0 80 80'>
        <path d='M0,40 L80,40 M40,0 L40,80'/>
      </svg>
    );
  }
}

class Close extends React.Component {
  render() {
    return (
      <svg className='close-icon-svg' viewBox='0 0 80 80'>
        <path d='M10,10 L70,70 M70,10 L10,70'/>
      </svg>
    );
  }
}
Card.propTypes = {
  card: React.propTypes.object,
  updateCard: React.propTypes.func
};
class Card extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: this.props.card.name,
      description: this.props.card.description,
      foods: this.props.card.foods
    };
  }

  componentWillReceiveProps(newProps) {
    this.state = {
      name: newProps.card.name,
      description: newProps.card.description,
      foods: newProps.card.foods
    };
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
    this.props.update(this.state);
  };

  _onChange = (e) => {
    console.log('onChange');
    this.state[e.target.id] = e.target.value;
    this.props.update(this.state);
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
          <h1 className='name'><input type='text' id='name' value={this.state.name} style={{
      width: this.state.name.length / 2 + 'em'
      }} onChange={this._onChange}/></h1>
          <h2 className='description'><textarea type='text' id='description' value={this.state.description} style={{
      width: this.state.description.length / 2 + 'em'
      }} onChange={this._onChange}/></h2>
        </div>
        <div className='nav'>
          <div className='flex-item-2' onClick={this._add}>
            <Plus/>
          </div>
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

  _addMeal = (e) =>
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
    this.setState({
      expand: !this.state.expand
    });
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
    var createMeal = (meal, index) => <Meal {...meal} parentIndex={this.props.index} index={index} key={meal.id}/>;
    return (
      <div className='food flex-item-2'>
        <span className='close' onClick={this._close}>
          <Close/>
        </span>
        <input id='name' type='text' style={{
        width: this. props. name. length / 2 + 'em'
        }} value={this.props.name} onChange={this._onChange}/><br/>
        <input id='description' type='text' style={{
        width: this. props. description. length / 2 + 'em'
        }} value={this.props.description} onChange={this._onChange}/>
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
    card.foods[this.props.parentIndex].meals.splice(this.props.index, 1);
    updateClass();
  }

  _onChange = (e) => {
    card.foods[this.props.parentIndex].meals[this.props.index][e.target.id] = e.target.type === 'number'
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
        <input onChange={this._onChange} type='text' id='name' value={this.props.name} style={{
        width: this. props. name. length / 2 + 'em'
        }}/><br/>
        <input onChange={this._onChange} type='text' id='description' value={this.props.description} style={{
        width: this. props. description. length / 2 + 'em'
        }}/><br/>
        <input type='number' id='price' value={this.props.price} onChange={this._onChange}/>
        mB<br/>
        <input type='number' id='time' value={this.props.time} onChange={this._onChange}/>
        min
      </div>
    );
  }
}
