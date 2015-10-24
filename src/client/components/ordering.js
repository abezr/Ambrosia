import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import OrderMutation from '../mutations/ordermutation';

//var caddy = [];
var update;
var _modal;
var _mutation;


class Restaurant extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {caddy: [], modal: false, order: null};
    update = (item) => {
      this.state.caddy.push(item);
      this.forceUpdate();
      //this.setState({caddy: caddy.push(item)});
    }
    _modal = (order) => {
      this.state.order = order ? order : null;
      this.state.modal = !this.state.modal;
      this.forceUpdate();
    }
    _mutation = (order) => {
      var onFailure = () => console.log('failuuuure!!!');
      var onSuccess = () => this.setState({caddy: [], modal: false});
      new Relay.Store.update(new OrderMutation({order: order, user: this.props.user.user, restaurant: this.props.restaurant.restaurant}), {onFailure, onSuccess});
    }
  }
  render() {
    var that = this;
    var {restaurant} = this.props.restaurant;
    var createFoods = function (food) {
      return (<Food {...food} key={food.id}/>);
    };
    return (
      <div className='shop'>
        <Caddy caddy={this.state.caddy}/>
        <h1>{restaurant.name}</h1>
        <h2>{restaurant.description}</h2>
        <div className='foods nav-wrap'>{restaurant.foods.map(createFoods)}</div>
        <div className={classnames('modal-order',  {nav: this.state.modal, hidden: !this.state.modal})}><ModalOrder {...this.state.order} items={this.state.caddy}/></div>
      </div>
    );
  }
}

class Food extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {expand: false};
  }
  _switch = () => {
    this.setState({expand: !this.state.expand});
  }
  render () {
    var that = this;
    var createMeals = function (meal) {
      return (<Meal {...meal} parent={that.props.name} key={meal.id}/>);
    };
    return (
      <div className='food flex-item-2' onClick={this._switch}>
        <strong className='name'>{this.props.name}</strong><br/>
        <div className='description'>{this.props.description}</div>
        <div className={classnames('meals', {nav: this.state.expand, hidden: !this.state.expand})}>{this.props.meals.map(createMeals)}</div>
      </div>
    );
  }
}

class Meal extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  _addItem = (e) => {
    e.stopPropagation();
    update({...this.props});
    //caddy.push({parent: this.props.parent, name: this.props.name, price: 1});
    //update(caddy);
  }
  render () {
    return (
      <div className='meal flex-item-2' onClick={this._addItem}>
        <strong className='name'>{this.props.name}</strong><br/>
        <div className='description'>{this.props.description}</div>
      </div>
    );
  }
}

class Caddy extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  _order = () => {
    var getTime = () => {
      var d = 0;
      this.props.caddy.map((item) => {d += item.time*60*1000});
      return d;
    };
    var getItems = () => {
      return this.props.caddy.map((item) => {
        return {
          id: item.id,
          parent: item.parent,
          name: item.name
        };
      });
    };
    var order = {
      date: new Date().getTime(),
      time: getTime(),
      price: this._sum(),
      items: getItems()
    };
    console.log(order);
    _modal(order);
    //_mutation(order);
  }
  _sum = () => {
    var value = 0;
    this.props.caddy.forEach(function(item) {
      value += item.price;
    });
    return value;
  }
  render () {
    console.log(this.props);
    var createItems = function(item) {
      return (
        <div className='flex-item-2 item'>
          {item.parent}<br/>
          {item.name}<br/>
          {item.price} mɃ
        </div>
      )
    }
    var sum = this._sum();
    return (
      <div className='caddy'>
        <div className='nav'>
          {this.props.caddy.map(createItems)}<br/>
        <div className={classnames('command flex-item-2', {hidden: !sum})} onClick={this._order}><strong>{sum} mɃ</strong><br/>
            Order!
        </div>
        </div>
      </div>
    );
  }
}

var _getTime;

class Timepicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    var d = new Date();
    _getTime = () => {
      return this.state;
    };
    this.state = {time: {hours: d.getHours(), minutes: d.getMinutes()}};
  }
  _changeHours = (e) => {
    console.log('changeHours');
    var d = new Date();
    if (e.target.value < d.getHours()) this.state.time.hours = d.getHours();
    else {
      this.state.time.hours = e.target.value;
    }
    this.forceUpdate();
  }
  _incPlusHours = () => {
    console.log('incPlusHours');
    var d = new Date();
    if (this.state.time.hours === 24) {this.state.time.hours = 0;}
    else {
      this.state.time.hours += 1;
    }
    this.forceUpdate();
  }
  _incLessHours = () => {
    console.log('incLessHours');
    var d = new Date();
    if ((this.state.time.hours === (d.getHours() + 1) && this.state.time.minutes <= d.getMinutes()) || this.state.time.hours === d.getHours()) {
      this.state.time.hours = d.getHours();
      this.state.time.minutes = d.getMinutes();
    }
    else if (this.state.time.hours === 0) {this.state.time.hours = 0}
    else {
      this.state.time.hours -= 1;
    }
    this.forceUpdate();
  }
  _changeMinutes = (e) => {
    console.log('changeMinutes');
    var d = new Date();
    if ((e.target.value <= d.getMinutes()) && (this.state.time.hours === d.getHours())) this.state.time.hours = d.getMinutes();
    else {
      this.state.time.minutes = e.target.value;
    }
    this.forceUpdate();
  }
  _incPlusMinutes = () => {
    console.log('incPlusMinutes');
    var d = new Date();
    if (this.state.time.minutes === 60) {
      this.state.time.minutes = 0;
      this.state.time.hours += 1;
    }
    else {
      this.state.time.minutes += 1;
    }
    this.forceUpdate();
  }
  _incLessMinutes = () => {
    console.log('incLessMinutes');
    var d = new Date();
    if (this.state.time.minutes === d.getMinutes() && this.state.time.hours === d.getHours()) this.state.time.minutes = d.getMinutes();
    else if (this.state.time.minutes === 0) {this.state.time.minutes = 0}
    else {
      this.state.time.minutes -= 1;
    }
    this.forceUpdate();
  }
  render () {
    return (
      <div className = 'timepicker'>
        <div className='flex-item-2'>
          <span className='inc-plus' onClick={this._incPlusHours}>▲</span><br/>
          <input type='number' className='hours' value={this.state.time.hours} onChange={this._changeHours}/> Hours<br/>
          <span className='inc-less' onClick={this._incLessHours}>▼</span>
        </div>
        <div className='flex-item-2'>
          <span className='inc-plus' onClick={this._incPlusMinutes}>▲</span><br/>
          <input type='number' className='minutes' value={this.state.time.minutes} onChange={this._changeMinutes}/> Minutes<br/>
          <span className='inc-less' onClick={this._incLessMinutes}>▼</span>
        </div>
      </div>
    );
  }
}

class ModalOrder extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  _order = () => {
    console.log(_getTime());
    var getDate = () => {
      var d = new Date(),
      d2 = _getTime(),
      h = d.getHours(),
      m = d.getMinutes(),
      h2 = d2.time.hours,
      m2 = d2.time.minutes;
      return d.getTime() + ((h2 - h * 60) + (m2 - m)) * 60000;
    };
    console.log(getDate());
    var order = {
      id: '_' + Math.random().toString(36).substr(2, 9),
      date: getDate(),
      items: this.props.items.map((item) => { return {id:item.id, parent: item.parent, name:item.name};}),
      time: this.props.time,
      payed: false,
      price: this.props.price
    };
    _mutation(order);
  }
  _close = () => {
    _modal();
  }
  _orderWithPay = () => {
    console.log('pay the command');
  }
  render () {
    var createItems = (item) => {
      return (
        <div className='flex-item-2 item'>
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    return (
      <div className='order flex-item-2'>
        <span className='close' onClick={this._close}/>
        <div className='nav-wrap items'>
          {this.props.items.map(createItems)}
        </div>
        <div className='price'>Total : {this.props.price} mɃ</div>
        <div className='date'>When do you want your command Ready? <Timepicker/></div>
        <span className='pay' onClick={this._orderWithPay}>Pay Now</span><span className='nopay' onClick={this._order}>Pay Later</span>
      </div>
    );
  }
}

export default Relay.createContainer(Restaurant, {
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        ${OrderMutation.getFragment('user')}
      }
    }
    `,
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurant {
        ${OrderMutation.getFragment('restaurant')}
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
    }`
  }
});
