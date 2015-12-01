import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import UpdateCardMutation from '../../mutations/updatecardmutation';

var card;
//list of var to be used on each component
var updateClass;

export class Card extends React.Component {

  constructor(props, context) {
    super(props, context);
    if(this.props.restaurant.restaurant) {
      var restaurant = this.props.restaurant.restaurant;
      card = {
        name: restaurant.name,
        description: restaurant.description,
        foods: restaurant.foods
      };
    }
    this.state = card;
    this.state.save = false;
    updateClass = () => {
      this.state.save = true;
      this.setState(card);
    };
  }

  componentWillLeave () {
    this.props.update('card', card);
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

  _cardUpdateMutation = () => {
    this.state.foods.map((food) => {
      console.log(food);
      delete food.__dataID__;
      food.meals.map((meal) => delete meal.__dataID__);
    });
    var resto = {
      name: this.state.name,
      description: this.state.description,
      foods: this.state.foods
    };
    console.log(this.state.foods);
    Relay.Store.update(new UpdateCardMutation({card: resto, restaurant: this.props.restaurant.restaurant}));
  }

  _onChange = (e) => {
    console.log('onChange');
    card[e.target.id] = e.target.value;
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
        <span className={classnames('submit', {hidden: !this.state.save})}>
          Save changes
        </span>
        <div className='brand'>
          <h1 className='name'><input type='text' id='name' value={this.state.name} style={{
      width: this. state. name. length / 2 + 'em'
      }} onChange={this._onChange}/></h1>
          <h2 className='description'><textarea type='text' id='description' value={this.state.description} style={{
      width: this. state. description. length / 2 + 'em'
      }} onChange={this._onChange}/></h2>
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
        width: this.props.name.length / 2 + 'em'
        }}/><br/>
        <input onChange={this._onChange} type='text' id='description' value={this.props.description} style={{
        width: this.props.description.length / 2 + 'em'
        }}/><br/>
        <input type='number' id='price' value={this.props.price} onChange={this._onChange}/>
        mB<br/>
        <input type='number' id='time' value={this.props.time} onChange={this._onChange}/>
        min
      </div>
    );
  }
}

class Plus extends React.Component{
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

export default Relay.createContainer(Card, {
  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    //and you use a mutation you have to call mutation fragment if not you get a warning
    restaurant: () => Relay.QL `
    fragment on Root {
      restaurant {
        ${UpdateCardMutation.getFragment('restaurant')}
        id,
        name,
        description,
        foods {
          id,
          name,
          description,
          meals {
            id,
            name,
            description,
            price,
            time
          }
        }
      }
    }
    `
  }
});
