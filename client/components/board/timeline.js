import React from 'react';
import Relay from 'react-relay';
import request from 'superagent';
import {Link} from 'react-router';
import classnames from 'classnames';
import UpdateOrderMutation from '../../mutations/updateordermutation';
import UpdateRestaurantMutation from '../../mutations/updaterestaurantmutation';

import Cursor from '../widget/cursor';
import Flag from '../widget/flag';
import Input from '../widget/input';

/**
 * this is the board class
 * property: data for 3 days orders, date of the day,
 *
 * it has a TimeLine child
 * property: millisecondes at midnight, milliseconds at the time
 *
 */
const millisecondsPerDay = 24*60*60*1000;
var midnightTime;
var time;
var setVariables;
var params = {
  payed: true,
  unpayed: true,
  treated: true,
  untreated: true,
  busy: 0
};
//TODO this function is called every seconds, find something to call it only when needed
var filterOrder = (orders) => {
  return orders.filter(order => {
    var order = order.node;
    var check = true;
    var checking = (boolean) => {
      if(!boolean) check = false;
    };
    if(!params.payed) order.payed ? checking(false) : checking(true);
    if(!params.unpayed) order.payed ? checking(true) : checking(false);
    if(!params.treated) order.treated ? checking(false) : checking(true);
    if(!params.untreated) order.treated ? checking(true) : checking(false);
    return check;
  });
};
var _update;
//type[string] id returned by setInterval to pass to clearInterval
var intervalID;

class Board extends React.Component {

  constructor(props, context) {
    super(props, context);
    midnightTime = new Date().setHours(0, 0, 0, 0);
    time = new Date().getTime();
    if(localStorage.timelineParams) params = JSON.parse(localStorage.timelineParams);
    setVariables = (variables) => {
      this.props.relay.setVariables(variables);
    }
    _update = () => {
      this.forceUpdate();
    }
    var updateTime = () => {
      time = new Date().getTime();
      this.forceUpdate();
    }
    intervalID = setInterval(updateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(intervalID);
  }

  render() {
    var orders = filterOrder(this.props.restaurant.restaurant.orders.edges);
    return (
      <div className='board'>
        <TimeLine orders={orders} relay={this.props.relay} time={time} id={this.props.id}/>
        <Dashboard orders = {orders} restaurantID={this.props.id}/>
      </div>
    );
  }
}

var timeLineDate = new Date();
var timeLineWheel;
var updateEachSeconds;
class TimeLine extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      x: (this.props.time - midnightTime)/10000,
      play: true
    }
    timeLineWheel = (event) => {
      event.preventDefault();
      timeLineDate.setTime(midnightTime + (this.state.x * 10000));
      if(this.state.x <= 0 && (event.deltaX < 0 || event.deltaY < 0)){
        console.log('reset x');
        midnightTime -= millisecondsPerDay;
        setVariables({midnightTime: midnightTime});
        this.state.x = 8640;
      }
      if(this.state.x >= 8640 && (event.deltaX > 0 || event.deltaY > 0)) {
        console.log('reset x');
        midnightTime += millisecondsPerDay;
        setVariables({midnightTime: midnightTime});
        this.state.x = 0;
      }
      this.setState({
        play: false,
        x: this.state.x += event.currentTarget.id === 'timeline' ? event.deltaX : event.deltaY
      });
    }
  }

  onPlay = () => {
    timeLineDate = new Date();
    midnightTime = new Date().setHours(0, 0, 0, 0);
    this.setState({
      x: (this.props.time - midnightTime)/10000,
      play: true
    });
  };

  onClick = (event) => {
    var margin = 8;
    var x = ((event.clientX - margin) / this.width) * 8640;
    timeLineDate.setTime(midnightTime + (x * 10000));
    this.setState({
      x: x,
      play: false
    });
    console.log('TimeLine:onClick', 'width', this.width, 'event', event.clientX, event.pageX);
  };

  _switch = (e) => {
    e.stopPropagation();
    params[e.currentTarget.id] = !params[e.currentTarget.id];
    localStorage.timelineParams = JSON.stringify(params);
    this.forceUpdate();
  };

  _update = (e) => {
    params[e.currentTarget.id] = e.currentTarget.value;
    localStorage.timelineParams = JSON.stringify(params);
    _update();
  };

  _updateRestaurantMutation = (e) => {
    var resto = {
      id: this.props.id,
      [e.currentTarget.id]: e.currentTarget.value
    };
    console.log('restaurantMutation', resto);
    var onFailure = () => console.log('failure');
    var onSuccess = () => console.log('success');
    Relay.Store.update(new UpdateRestaurantMutation({restaurant: resto}), {onFailure, onSuccess});
  };

  _populate = () => {
    request.post('http://localhost:3800/populate/order')
    .query({
      params: this.props.id
    })
    .end((err, res) => {
      if(err) console.error(err);
      this.props.relay.forceFetch({
        midnightTime: midnightTime
      }, (readyState) => {
        if(readyState.done) console.log('updated!!!')
      })
    });
  };

  componentWillReceiveProps () {
    //console.log('componentWillReceiveProps');
    if(this.state.play) {
      timeLineDate = new Date();
      this.setState({x: (this.props.time - midnightTime)/10000});
    }
  }

  render() {
    var createOrders = (order) => {
      order = order.node;
      var price = order.price * 10;
      var time = order.time * 6;
      return (
          <rect x={(order.date - midnightTime)/10000} y={order.payed ? 400-price : 400} height={price} width={20} fill ={order.payed ? 'green' : 'gainsboro'}/>
      );
    };
    var time = (this.props.time - midnightTime)/10000;
    return (
    <div className='timeline' ref = {(item) => {this.width = item ? item.clientWidth : time}}>
      <svg id='timeline' className= 'command' viewBox="0 0 8640 800" onWheel = {timeLineWheel} onClick = {this.onClick}>
        <rect x='0' y='0' width={time < 0 ? 0 : time} height='800' fill = 'rgba(0, 0, 0, 0.8)'/>
        <rect x={time} y='0' width={8640 - time < 0 ? 0 : 8640 - time} height='800' fill = 'rgba(255, 255, 255, 0.8)'/>
        <path d='M0,400 H8640' stroke = 'black' strokeWidth = '1'/>
        <rect className = 'cursor' x={this.state.x} y='0' width='20' height='800' fill = 'yellow'/>
        {this.props.orders.map(createOrders)}
        <text textAnchor='middle' x='4320' y='300' fill='rgba(255, 255, 255, 0.8)' fontSize='200'>{timeLineDate.getDate() +'/'+ (timeLineDate.getMonth() + 1) +'/'+ timeLineDate.getFullYear()}</text>
        <text textAnchor='middle' x='4320' y='700' fill='rgba(255, 255, 255, 0.8)' fontSize='200'>{timeLineDate.getHours() +':'+ (timeLineDate.getMinutes() < 10 ? '0'+timeLineDate.getMinutes() : timeLineDate.getMinutes())}</text>
      </svg>
      <nav className='nav-list'>
        <span className={classnames('play flex-item-2', {hidden: this.state.play})} onClick={this.onPlay} />
        <span className={classnames('pause flex-item-2', {hidden: !this.state.play})} />
        <ul className='cursor-container'>
          <li><span id='unpayed' className={classnames('cursor-wrapper', {red: !params.unpayed, green: params.unpayed})} onClick={this._switch}>unpayed <Cursor id={"unpayed"} on={params.unpayed} size={'0.75em'} update={this._switch}/></span></li>
          <li><span id='payed' className={classnames('cursor-wrapper', {red: !params.payed, green: params.payed})} onClick={this._switch}>payed <Cursor id={"payed"} on={params.payed} size={'0.75em'} update={this._switch}/></span></li>
          <li><span id='treated' className={classnames('cursor-wrapper', {red: !params.treated, green: params.treated})} onClick={this._switch}>treated <Cursor id={"treated"} on={params.treated} size={'0.75em'} update={this._switch}/></span></li>
          <li><span id='untreated' className={classnames('cursor-wrapper end', {red: !params.untreated, green: params.untreated})} onClick={this._switch}>untreated <Cursor id={"untreated"} on={params.untreated}size={'0.75em'} update={this._switch}/></span></li>
          <li className='busy-container'>
            Busy: <Input type='number' id='busy' value={params.busy} update={this._update} onValid={this._updateRestaurantMutation}/>minutes
          </li>
        </ul>
        <span className='button fulfill' onClick={this._populate}>Fulfill with orders</span>
      </nav>
    </div>
    );
  }
}
/**
 * List all or part of the days orders depending on where the timeline is positioned
 * property: current timeline time, all days order
 */
class Dashboard extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    var i = 0;
    /**
     * A function to return only the 5 next order after timeLineDate
     * @param  {[object]} order [description]
     * @param  {[int]} index [description]
     * @return {[react element]}       []
     */
    var prevOrder = () => {
      var orders = [];
      this.props.orders.reverse();
      this.props.orders.map(order => {
        if (timeLineDate.getTime() >= order.node.date && i < 10) {
          i++;
          orders.push(<Order className={i <= 5 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>);
        }
      });
      i = 0;
      return orders.reverse();
    }
    var postOrder = () => {
      var orders = [];
      this.props.orders.reverse();
      this.props.orders.map(order => {
        if (order.node.date >= timeLineDate.getTime() && i < 10) {
          i++;
          orders.push(<Order className={i <= 5 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>);
        }
      });
      i = 0
      return orders;
    }
    var createOrder = (order, index) => {

      if (order.node.date >= timeLineDate.getTime() && i < 10) {
        i++
        return <Order className={i < 15 ? ' visible' : ''} key={order.node.id} order={order.node} restaurantID={this.props.restaurantID}/>;
      }
    };
    // var createOrder = () => {
    //   var prevTime = 1000;
    //   var prevOrder = [];
    //   var postOrder = [];
    // }
    return (
      <div className = "dashboard">
        <div id = 'dashboard' className = 'container' onWheel={timeLineWheel}>
          {prevOrder()}
          {postOrder()}
        </div>
      </div>
    );
  }
}

class Order extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {expand: false};
  }

  _update = (e) => {
    e.stopPropagation();
    var order = {
      id: this.props.order.id,
      restaurantID: this.props.restaurantID
    };
    order[e.currentTarget.id] = !this.props.order[e.currentTarget.id];
    var onFailure = () => console.log('failure');
    var onSuccess = () => console.log('success');
    Relay.Store.update(new UpdateOrderMutation({order: order}), {onFailure, onSuccess});
  };

  componentWillUnmount = () => {
    this.refs.order.className = 'leave';
    setTimeout(() => {
      console.log('leave');
     }, 250);

  };

  render() {
    var order = this.props.order;
    var createItem = (item) => {
      return (
        <div className = 'item'>
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    var date = new Date(order.date);
    var Hours = date.getHours();
    var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return (
      <div className={'order' + this.props.className + (this.state.expand ? ' expand' : '')} ref='order' onClick={()=>{this.setState({expand: !this.state.expand});}} onWheel={(e) => {if(this.state.expand === true) e.stopPropagation();}}>
        <h1>{order.userName}<span className='price'>{order.price + ' mB'}</span><span className='time'>{Hours} : {Minutes}</span></h1>
        <div className={classnames('items', {hidden: !this.state.expand})}>
          {order.items.map(createItem)}
        </div>
        <span className = 'cursor-payed'>
          Payed <Cursor id={'payed'} on={order.payed} update={this._update}/>
        </span>
        <span className = 'cursor-treated'>
          Treated <Cursor id={'treated'} on={order.treated} update={this._update}/>
        </span>
      </div>
    );
  }
}

export default Relay.createContainer(Board, {
  initialVariables: {
    midnightTime: new Date().setHours(0, 0, 0, 0),
  },
  fragments: {
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurant {
        orders(first: 9000, midnightTime: $midnightTime) {
          edges {
            node {
              id,
              userID,
              restaurantID,
              date,
              userName,
              payed,
              prepayed,
              treated,
              price,
              items {
                id,
                name,
                parent
              }
            }
          }
        }
      }
    }
    `
  }
})
