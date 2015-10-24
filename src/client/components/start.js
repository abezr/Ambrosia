import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import RestaurantMutation from '../mutations/restaurantmutation';


var card = {
  name: 'Your restaurant\'s name',
  description: 'Describe your restaurant',
  orders : [],
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
    this.state.input = {name: false, description: false};
    updateClass = () => {
      this.setState(card);
    };
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

  _switchName = (e) => {
    console.log('switchName');
    e.stopPropagation();
    this.setState({input: {name: !this.state.input.name}});
    this.refs.input.focus(); // can't focus display:none element...
  }

  _switchDescription = (e) => {
    console.log('switchDesrcription');
    e.stopPropagation();
    this.setState({input: {description: !this.state.input.description}});
  }

  _nameChange = (e) => {
    card.name = e.target.value;
  }

  _descriptionChange = (e) => {
    card.description = e.target.value;
  }

  _onKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13 || e.keyCode === 27) updateClass();
  }

  _restaurantMutation = () => {
    var resto = {
      name: this.state.name,
      description: this.state.description,
      foods: this.state.foods
    };
    Relay.Store.update(new RestaurantMutation({restaurant: resto, user: this.props.user.user}));
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
        <h1 className={classnames('name', {'hidden': this.state.input.name})} onClick={this._switchName}>{this.state.name}</h1><input ref='input' onChange={this._nameChange} onKeyDown={this._onKeyDown} className={classnames('name', {'hidden': !this.state.input.name})} id='name' type='text' onClick={(e)=> e.stopPropagation()}/>
        <h2 className={classnames('description', {'hidden': this.state.input.description})} onClick={this._switchDescription}>{this.state.description}</h2><textarea ref='textarea' onChange={this._descriptionChange} onKeyDown={this._onKeyDown} className={classnames('description', {'hidden': !this.state.input.description})} id='description' onClick={(e)=> e.stopPropagation()}/>
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

  _switchName = (e) => {
    console.log('switchName');
    e.stopPropagation();
    this.setState({input: {name: !this.state.input.name}});
    this.refs.input.focus(); // can't focus display:none element...
  }

  _switchDescription = (e) => {
    console.log('switchDesrcription');
    e.stopPropagation();
    this.setState({input: {description: !this.state.input.description}});
  }

  _nameChange = (e) => {
    console.log(e.target.value, this.props.index);
    card.foods[this.props.index].name = e.target.value;
    updateClass();
  }

  _descriptionChange = (e) => {
    card.foods[this.props.index].description = e.target.value;
    updateClass();
  }

  _onKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13 || e.keyCode === 27) e.target.id === 'name' ? this._switchName(e) : this._switchDescription(e);
  }

  _close = () => {
    console.log('close');
    card.foods.splice(this.props.index, 1);
    updateClass();
  }

  render () {
    var food = this.props;
    var createMeal = (meal, index) => <Meal {...meal} parentIndex={this.props.index} index={index} key={meal.id}/>
    return (
      <div className='food flex-item-2' onClick={this._switchExpand}>
        <span className='close' onClick={this._close}/>
        <span className={classnames('name', {'hidden': this.state.input.name})} onClick={this._switchName}>{food.name}</span><input ref='input' onChange={this._nameChange} onKeyDown={this._onKeyDown} className={classnames('name', {'hidden': !this.state.input.name})} id='name' type='text' onClick={(e)=> e.stopPropagation()}/><br/>
        <span className={classnames('description', {'hidden': this.state.input.description})} onClick={this._switchDescription}>{food.description}</span><textarea ref='textarea' onChange={this._descriptionChange} onKeyDown={this._onKeyDown} className={classnames('description', {'hidden': !this.state.input.description})} id='description' onClick={(e)=> e.stopPropagation()}/>
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

  _closeInputs = () => {
    for (var key in this.state.input) {
      this.state.input[key] = false;
    }
    this.forceUpdate();
  }

  _switchName = (e) => {
    console.log('switchName');
    e.stopPropagation();
    this.setState({input: {name: !this.state.input.name}});
    this.refs.input.focus(); // can't focus display:none element...
  }

  _switchDescription = (e) => {
    e.stopPropagation();
    this.setState({input: {description: !this.state.input.description}});
  }

  _switchPrice = (e) => {
    e.stopPropagation();
    this.setState({input: {price: !this.state.input.price}});
  }

  _switchTime = (e) => {
    e.stopPropagation();
    this.setState({input: {time: !this.state.input.time}});
  }

  _nameChange = (e) => {
    console.log('nameChange');
    card.foods[this.props.parentIndex].meals[this.props.index].name = e.target.value;
    updateClass();
  }

  _descriptionChange = (e) => {
    console.log('descriptionChange');
    card.foods[this.props.parentIndex].meals[this.props.index].description = e.target.value;
    updateClass();
  }

  _priceChange = (e) => {
    console.log('priceChange');
    card.foods[this.props.parentIndex].meals[this.props.index].price = Math.abs(e.target.value);
    updateClass();
  }

  _timeChange = (e) => {
    console.log('timeChange');
    card.foods[this.props.parentIndex].meals[this.props.index].time = Math.abs(e.target.value);
    updateClass();
  }

  _onKeyDown = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 13 || e.keyCode === 27) this._closeInputs();
  }

  _close = (e) => {
    e.stopPropagation();
    card.foods[this.props.parentIndex].meals.splice(this.props.index, 1);
    updateClass();
  }

  render () {
    var food = this.props;
    return (
      <div className='meal flex-item-2'>
        <span className='close' onClick={this._close}/>
        <span className={classnames('name', {'hidden': this.state.input.name})} onClick={this._switchName}>{food.name}</span><input ref='input' onChange={this._nameChange} onKeyDown={this._onKeyDown} className={classnames({'hidden': !this.state.input.name})} id='name' type='text' onClick={(e)=> e.stopPropagation()}/><br/>
        <span className={classnames('description', {'hidden': this.state.input.description})} onClick={this._switchDescription}>{food.description}</span><textarea ref='textarea' onChange={this._descriptionChange} onKeyDown={this._onKeyDown} className={classnames({'hidden': !this.state.input.description})} id='description' onClick={(e)=> e.stopPropagation()}/><br/>
        <span className={classnames('price', {'hidden': this.state.input.price})} onClick={this._switchPrice} min="0">{food.price} mɃ</span><input className={classnames('price', {'hidden': !this.state.input.price})} onChange={this._priceChange} onKeyDown={this._onKeyDown} onClick={(e)=> e.stopPropagation()} type='number'/><br/>
        <span className={classnames('time', {'hidden': this.state.input.time})} onClick={this._switchTime} min="0">{food.time} min</span><input className={classnames('time', {'hidden': !this.state.input.time})} onChange={this._timeChange} onKeyDown={this._onKeyDown} onClick={(e)=> e.stopPropagation()} type='number'/>
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
        ${RestaurantMutation.getFragment('user')}
      }
    }
    `
  }
});
