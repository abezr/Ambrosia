import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import OrderMutation from '../mutations/newordermutation';
import request from 'superagent';

import Close from './icons/close';
import Score from './icons/score';
import Map from './icons/map';
import Modal from './widget/modal';
import Textarea from './widget/textarea';

//var caddy = [];
var _pushCaddy;
var _splitCaddy;
var _sum;
var _modal;
var _mutation;
var _selfOrdering

class Restaurant extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {caddy: localStorage[this.props.id] ? JSON.parse(localStorage[this.props.id]) : [], modal: false, order: null};
    _selfOrdering = this.props.route.path.match('/card/order')
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
          this.state.caddy[index].times === 2 ? this.state.caddy[index].times = null : this.state.caddy[index].times--;
          localStorage[this.props.id] = JSON.stringify(this.state.caddy);
          this.forceUpdate();
          return;
      }
      this.state.caddy.splice(index, 1);
      localStorage[this.props.id] = JSON.stringify(this.state.caddy);
      this.forceUpdate();
    }
    _sum = () => {
      var value = 0;
      this.state.caddy.forEach(function(item) {
        if(item.times) {
          value += item.price * item.times;
          return;
        }
        value += item.price;
      });
      return value;
    }
    _modal = (order) => {
      this.state.order = order ? order : null;
      this.state.modal = !this.state.modal;
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
  _isOpen = (restaurant) => {
    var d = new Date();
    var day = d.getDay();
    var time = d.getTime();
    var midnightTime = d.setHours(0, 0, 0);
    var millisecondsSinceMidnight = time - midnightTime;
    var isOpen = undefined;
    var willOpen = false;
    var willOpenReadable = '';
    restaurant.schedule[day].openHours.forEach((hours, i) => {
      if(hours.from < millisecondsSinceMidnight && hours.to > millisecondsSinceMidnight) {
        console.log(hours.from/10000, millisecondsSinceMidnight/10000, hours.to/10000);
        var timeRemain = new Date(midnightTime+hours.to);
        var hours = timeRemain.getHours();
        var minutes = timeRemain.getMinutes() < 10 ? '0'+timeRemain.getMinutes() : timeRemain.getMinutes();
        isOpen = 'open until ' + hours + ':' + minutes;
      } else {
        if(hours.from > millisecondsSinceMidnight) {
          if(!willOpen) willOpen = hours.from - millisecondsSinceMidnight;
          willOpen = willOpen > (hours.from-millisecondsSinceMidnight) ? hours.from-millisecondsSinceMidnight : willOpen;
          var timeRemain = new Date(midnightTime+hours.from);
          var hours = timeRemain.getHours();
          var minutes = timeRemain.getMinutes() < 10 ? '0'+timeRemain.getMinutes() : timeRemain.getMinutes();
          willOpenReadable = 'shall open at' + hours + ':' + minutes;
        }
      }
    });
    return restaurant.open ? isOpen : willOpenReadable || 'the restaurant is closed today';
  }
  render() {
    var that = this;
    var {restaurant} = this.props.restaurant;
    var createFoods = function (food) {
      return (<Food {...food} key={food.id}/>);
    };
    return (
      <div className='shop'>
        <Modal hidden={!this.state.modal}>
          <Order {...this.state.order} busy={restaurant.busy} items={this.state.caddy}/>
        </Modal>
        <Caddy caddy={this.state.caddy}/>
        <div className='card-order shop-card'>
          <span className = {'shop-score ' + (_selfOrdering ? 'hidden' : '')}><Score score={restaurant.reviews.averageScore} size={'5em'}/>{restaurant.reviews.comments.length} marks</span>
          <span className = {'shop-map ' + (_selfOrdering ? 'hidden' : '')}><Map size='2em'/>View on Map</span>
          <h1>{restaurant.name}<span className = {'shop-open ' + (_selfOrdering ? 'hidden' : '')}>{this._isOpen(restaurant)}</span></h1>
          <h2><i>{restaurant.description}</i></h2>
          <div className='foods'>{restaurant.foods.map(createFoods)}</div>
        </div>
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
      <div className='food' onClick={this._switch}>
        <strong className='name'>{this.props.name}</strong>
        <div className='description'>{this.state.expand ? '' : this.props.description}</div>
        <div className={classnames('meals', {hidden: !this.state.expand})}>{this.props.meals.map(createMeals)}</div>
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
      <div className='meal' onClick={this._addItem}>
        <strong className='name'>{this.props.name}</strong>
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
      items: getItems()
    };
    _modal(order);
    //_mutation(order);
  }

  _removeItem = () => {

  }
  render () {
    var createItems = function(item, i) {
      return (
        <div className='item'>
          <span onClick={e=>{_splitCaddy(i)}}><Close/></span>
          <span className='times'>{item.times ? item.times + 'X' : ''}</span>
          {item.parent}<br/>
          {item.name}<br/>
          {item.price} mɃ
        </div>
      )
    }
    return (
      <div className='caddy'>
        {this.props.caddy.map(createItems)}
        <div className={classnames('command', {hidden: !this.props.caddy.length})} onClick={this._order}><strong>{_sum()} mɃ </strong><br/>Order!
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
      message: ''
    };
  }
  _order = () => {
    var order = {
      id: '_' + Math.random().toString(36).substr(2, 9),
      items: this.props.items.map((item) => { return {id:item.id, parent: item.parent, name:item.name};}),
      date: new Date().getTime() + this.state.orderReadyIn * 60 * 1000,
      payed: false,
      treated: false,
      message: this.state.message,
      price: _sum()
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
    var createItems = (item, i) => {
      return (
        <div className='item' onClick={(e) => _splitCaddy(i)}>
          {item.times ? <div className='times'>{item.times+'X'}</div> : ''}
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    return (
      <div className='order'>
        <span onClick={e => {_modal()}}><Close stroke={'black'} size={'2em'}/></span>
        <div className='items'>
          {this.props.items.map(createItems)}
        </div>
        <div className='price'>Total : {_sum()} mɃ</div>
        <div className='details'>Send additional details on your order: <br/>
          <span>{70 - this.state.message.length}</span><br/>
          <Textarea id={'message'} minWidth={23} value={this.state.message} placeholder='Less than 70 caracteres' update={this._update}/>
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
        scorable,
        reviews {
          averageScore,
          comments
        },
        open,
        schedule {
          day,
          openHours {
            from,
            to
          }
        }
        foods {
          id,
          name,
          description,
          meals {
            id,
            name,
            description,
            price,
          }
        }
      }
    }`
  }
});
