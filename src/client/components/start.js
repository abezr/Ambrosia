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
      id: 0,
      name: 'the meal\'s name',
      description: 'the meal\'s description',
    }]
  }]
};
class Start extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = card;
    this.state.box = card.foods[0];
    this.state.modal = false;
  }

  _add = () => {
    this.state.foods.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the food\'s name',
      description: 'the food\'s description',
      meals: [{
        name: 'the meal\'s name',
        description: 'the meal\'s description',
      }]
    });
    this.setState({
      foods: this.state.foods
    });
  }

  _addMeal = () => {
    this.state.box.meals.push({
      id: '_' + Math.random().toString(36).substr(2, 9),
      name: 'the meal\'s name',
      description: 'the meal\'s description',
    });
    this.setState({
      box: this.state.box
    });
  }

  _deleteFood = (index) => {
    this.state.foods.splice(index, 1);
    this.forceUpdate();
  }

  _closeModal = () => {
    this.setState({
      modal: false
    });
  }

  _switch = (e, food) => {
    console.log(e, food);
    var update = function(selector, unselector) {
      e.target.className += ' hidden';
      selector === 'textarea' ? e.currentTarget.querySelector('.description').className = 'description' : e.currentTarget.querySelector('.name').className = 'name';
      e.currentTarget.querySelector(selector).className = 'hidden'
      e.currentTarget.querySelector(unselector).className = ''
    };
    if (e.target.className === 'name' || e.target.className === 'description') {
      console.log('if', e.target.className);
      e.target.className === 'name' ?
      update('textarea', 'input') : update('input', 'textarea');
    }
    if (e.target.id === 'box') {
      console.log(e.target.id);
      this.setState({
        box: food,
        modal: true
      });
    }
  }

  _unSwitch = (e, food) => {
    var update = (selector, unselector) => {
      selector === 'input' ? e.currentTarget.querySelector('.description').className = 'description' : e.currentTarget.querySelector('.name').className = 'name';
      e.currentTarget.querySelector(unselector).className = 'hidden';
      e.currentTarget.querySelector(selector).className = 'hidden';
      food[e.target.id] = e.target.value === '' ? 'the food\'s '+e.target.id : e.target.value;
      e.target.value = '';
      this.forceUpdate();
    };
    if(e.keyCode === 13) {
      console.log(e.target.value);
      if (e.target.id === 'name' || e.target.id === 'description') {
        console.log('if', e.target.id);
        e.target.id === 'name' ?
        update('textarea', 'input') : update('input', 'textarea');
      }
    }
  }

  _restaurantMutation = () => {
    var resto = {
      name: this.state.name,
      description: this.state.description,
      foods: this.state.foods
    };
    console.log(resto);
    Relay.Store.update(new RestaurantMutation({restaurant: resto, user: this.props.user.user}));
  }

  render() {
    console.log(this.props);
    var that = this;
    //createBox refer to food box
    var createBox = function (food, index) {
      var classname = function () {
        var string = 'box flex-item-';
        return string += index+2;
      };
      return (
        <div className={classname()} id='box' onClick={function(e){that._switch(e, food)}} onKeyDown={function(e){that._unSwitch(e, food)}} key = {index}>
          <span className='close' onClick={function(){that._deleteFood(index)}}></span><br/>
          <span className='name'>{food.name}</span><input className='hidden' id='name' type='text'></input><br/>
          <span className='description'>{food.description}</span><textarea className='hidden' id='description'/>
        </div>
      );
    };
    var createMealBox = function (food, index) {
      var classname = function () {
        var string = 'box flex-item-';
        return string += index+2;
      };
      return (
        <div className={classname()} onClick={function(e){that._switch(e, food)}} onKeyDown={function(e){that._unSwitch(e, food)}} key = {index}>
          <span className='name'>{food.name}</span><input className='hidden' id='name' type='text'></input><br/>
          <span className='description'>{food.description}</span><textarea className='hidden' id='description'/>
        </div>
      ); 
    };
    return (
      <div className='openarestarant'>
        <div className='brand' onClick={function(e){that._switch(e, that.state)}} onKeyDown={function(e){that._unSwitch(e, that.state)}}>
          <span className='name'>{this.state.name}</span>
          <input id='name' ref ='pseudo-input' className='input hidden' type='text'/><br/>
          <span className= 'description'>{this.state.description}</span>
          <textarea id='description' className='description hidden'/>
        </div>
        <div className={classnames('meal-modal', {hidden: !this.state.modal})}>
            <span className='plus' onClick={this._addMeal}>plus</span>
            <span className='close' onClick={this._closeModal}></span>
            <span className='title'>{this.state.box.name}</span>
            <div className='meal-box nav-wrap'>
              {this.state.box.meals.map(createMealBox)}
            </div>
        </div>
        <div className='nav'>
          <div className='flex-item-1'><span className='plus' onClick={this._add}>Plus</span></div>
        </div>
        <div className='food nav-wrap'>
          {this.state.foods.map(createBox)}
        </div>
        <span className='submit' onClick={this._restaurantMutation}>
          Let's Go!
        </span>
      </div>
  );
  }
}

export default Relay.createContainer(Start, {
  initialVariables: {userID: document.getElementById('app').dataset.userid || ''},
  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    //and you use a mutation you have to call mutation fragment if not you get a warning
    user: () => Relay.QL`
    fragment on Root {
      user(id: $userID) {
        id,
        userID,
        ${RestaurantMutation.getFragment('user')}
      }
    }
    `
  }
});
//Note: We can't live data in any state component, we have to use client or server backend
class Box extends React.Component {
  render() {
    <div>
      <div className='nav'>
        <div className='flex-item-2'>Plus</div>
      </div>
    </div>
  }
}
