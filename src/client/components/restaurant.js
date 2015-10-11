import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

var caddy = [];
var update;

class Restaurant extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {caddy: caddy};
    update = function () {
      this.setState({caddy: caddy});
    }.bind(this);
  }
  render() {
    var that = this;
    var {restaurant} = this.props.restaurant;
    var createFoods = function (food) {
      return (<Food {...food} key={food.id}/>);
    };
    return (
      <div className='shop'>
        <Caddy caddy={caddy}/>
        <h1>{restaurant.name}</h1>
        <h2>{restaurant.description}</h2>
        <div className='foods nav-wrap'>{restaurant.foods.map(createFoods)}</div>
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
    this.setState({expand:!this.state.expand});
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
    caddy.push({parent: this.props.parent, name: this.props.name, price: 1});
    console.log('onclick', caddy);
    update(caddy);
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
    var date = new Date();
    var totime = date.getTime();
    var fromtime = new Date(totime);
    var tojson = date.toJSON();
    var fromjson = JSON.parse('{}');
    console.log(date, totime, fromtime);
    // console.log(typeof date, typeof tojson, typeof fromjson);
    // Relay.store.update(new OrderMutation())
  }
  render () {
    console.log(this.props);
    var createItems = function(item) {
      return (
        <div className='flex-item-2 item'>
          {item.parent}<br/>
          {item.name}<br/>
          {item.price} BTC
        </div>
      )
    }
    var sum = function () {
      var value = 0;
      this.props.caddy.forEach(function(item) {
        value += item.price;
      });
      return value;
    }.bind(this);
    return (
      <div className='caddy'>

        <div className='nav'>
          {this.props.caddy.map(createItems)}<br/>
        <div className={classnames('command flex-item-2', {hidden: !sum()})} onClick={this._order}><strong>{sum()} BTC</strong><br/>
            Order!
        </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Restaurant, {
  initialVariables: {userID: document.getElementById('app').dataset.userid || '2'},
  fragments: {
    // user: () => Relay.QL`
    // fragment on Root {
    //   user(id: $userID) {
    //     mail,
    //     id
    //   },
    // }
    // `,
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurant {
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
            description
          }
        }
      }
    }`
  }
});
