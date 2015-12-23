import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import OrderMutation from '../mutations/newordermutation';

import Close from './icons/close';
import Modal from './widget/modal';
import Textarea from './widget/textarea';

//var caddy = [];
var _pushCaddy;
var _splitCaddy;
var _modal;
var _mutation;

class Restaurant extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {caddy: localStorage[this.props.id] ? JSON.parse(localStorage[this.props.id]) : [], modalHidden: true, order: null};
    _pushCaddy = (item) => {
      var match = false;
      this.state.caddy.forEach(order => {
        if(item.id === order.id) {
          order.times ? order.times += 1 : order.times = 2;
          match = true;
        }
      });
      if(!match) this.state.caddy.push(item);
      localStorage[this.props.id] = JSON.stringify(this.state.caddy);
      this.forceUpdate();
    }
    _splitCaddy = (index) => {
      if(this.state.caddy[index].times) {
        this.state.caddy[index].times--;
        this.forceUpdate();
        return;
      }
      this.state.caddy.splice(index, 1);
      localStorage[this.props.id] = JSON.stringify(this.state.caddy);
      this.forceUpdate();
    }
    _modal = (order) => {
      this.state.order = order ? order : null;
      this.state.modalHidden = !this.state.modalHidden;
      this.forceUpdate();
    }
    _mutation = (order) => {
      var onFailure = () => {
        console.log('failuuuure!!!');
        order.id = '_' + Math.random().toString(36).substr(2, 9);
      };
      var onSuccess = () => {
        localStorage[this.props.id] = '';
        this.setState({caddy: [], modal: false});
      };
      order.userID = this.props.user.user.userID;
      order.restaurantID = this.props.restaurant.restaurant.id;
      Relay.Store.update(new OrderMutation({order: order}), {onFailure, onSuccess});
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
        <Modal hidden={this.state.modalHidden} border={'4px solid yellow'}>
          <Order {...this.state.order} busy={restaurant.busy} items={this.state.caddy}/>
        </Modal>
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
    _pushCaddy({...this.props});
    //caddy.push({parent: this.props.parent, name: this.props.name, price: 1});
    //pushCaddy(caddy);
  }
  render () {
    return (
      <div className='meal flex-item-2' onClick={this._addItem}>
        <strong className='name'>{this.props.name}</strong><br/>
        <div className='description'>{this.props.description}</div>
        <div className='price'>{this.props.price + 'mB'}</div>
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
      this.props.caddy.map((item) => {d += item.time});
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
      if(item.times) {
        value += item.price * item.times;
        return;
      }
      value += item.price;
    });
    return value;
  }
  _removeItem = () => {

  }
  render () {
    var createItems = function(item, i) {
      return (
        <div className='flex-item-2 item'>
          <span onClick={e=>{_splitCaddy(i)}}><Close/></span>
          <span className='times'>{item.times ? item.times + 'X' : ''}</span>
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
        <div className={classnames('command flex-item-2', {hidden: !this.props.caddy.length})} onClick={this._order}><strong>{sum} mɃ </strong>order!
        </div>
        </div>
      </div>
    );
  }
}

class Order extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      orderReadyIn : this.props.busy ? this.props.busy : 0,
      message: 'less than 70 caracteres'
    };
  }
  _order = () => {

    var order = {
      id: '_' + Math.random().toString(36).substr(2, 9),
      items: this.props.items.map((item) => { return {id:item.id, parent: item.parent, name:item.name};}),
      date: new Date().getTime(),
      payed: false,
      message: this.state.message,
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
  _setMinutes = (e) => {
    if(this.props.busy) {
      if(e.target.value < this.props.busy) return;
    }
    if(e.target.value < 0) return;
    this.setState({
      orderReadyIn: e.target.value
    });
  }
  //function to update the additional details message
  _update = (e) => {
    if (e.currentTarget.value.length > 70) return;
    this.state[e.currentTarget.id] = e.currentTarget.value;
    this.forceUpdate();
  }
  render () {
    var createItems = (item) => {
      return (
        <div className='flex-item-2 item'>
          {item.times ? <div className='times'>{item.times+'X'}</div> : ''}
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    return (
      <div className='order'>
        <span onClick={e => {_modal()}}><Close stroke={'white'} size={'2em'}/></span>
        <div className='nav-wrap items'>
          {this.props.items.map(createItems)}
        </div>
        <div className='price'>Total : {this.props.price} mɃ</div>
        <div className='details'>Send additional details on your order<br/>
          <span>{70 - this.state.message.length}</span><br/>
          <Textarea id={'message'} value={this.state.message} update={this._update}/>
        </div>
        <div className='date'>When do you want your command Ready? <br/>
        in <input type='number' value = {this.state.orderReadyIn} onChange={this._setMinutes}/> minutes</div>
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
        id,
        userID
      }
    }
    `,
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurant {
        id,
        name,
        description,
        busy,
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
