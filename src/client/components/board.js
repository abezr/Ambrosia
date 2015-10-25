'use strict';

import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';

var commands = [];
var id;
/**
 * this is the board class
 * property: data for 3 days orders, date of the day,
 *
 * it has a TimeLine child
 * property: millisecondes at midnight, milliseconds at the time
 *
 */
const millisecondsPerDay = 24*60*60*1000;
const midnightTime = new Date().setHours(0, 0, 0, 0);
var time = new Date().getTime();

class Board extends React.Component {

  constructor(props, context) {
    super(props, context);
    id = this.props.id;
    var updateTime = () => {
      time = new Date().getTime();
      this.forceUpdate();
    }
    setInterval(updateTime, 1000);
  }

  render() {
    var orders = this.props.restaurant.restaurant.orders.edges;
    return (
      <div className='board'>
        <TimeLine orders= {orders} time ={time} midnightTime= {midnightTime}/>
        <Dashboard orders = {orders}/>
      </div>
    );
  }
}

var timeLineDate;
var timeLineWheel;
var updateEachSeconds;
class TimeLine extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log((this.props.time - this.props.midnightTime)/10000);
    timeLineDate = new Date();
    this.state = {
      x: (this.props.time - this.props.midnightTime)/10000,
      play: true
    }
    timeLineWheel = (event) => {
      event.preventDefault();
      console.log('Timeline:onWheel', event.currentTarget);
      timeLineDate.setTime(this.props.midnightTime + (this.state.x * 10000));
      this.setState({
        play: false,
        x: this.state.x += event.currentTarget.id === 'timeline' ? event.deltaX : event.deltaY
      });
    }
  }
  onWheel = (event) => {
    event.preventDefault();

  }

  onPlay = () => {
    timeLineDate = new Date();
    this.setState({
      x: (this.props.time - this.props.midnightTime)/10000,
      play: true
    });
  }

  onClick = (event) => {
    var margin = 8;
    var x = ((event.clientX - margin) / this.width) * 8640;
    timeLineDate.setTime(this.props.midnightTime + (x * 10000));
    this.setState({
      x: x,
      play: false
    });
    console.log('TimeLine:onClick', 'width', this.width, 'event', event.clientX, event.pageX);
  }

  componentWillMount = () => {
    this.setState({commands: commands});
  }

  render() {
    var createOrders = (order) => {
      order = order.node;
      var price = order.price * 10;
      var time = order.time * 6;
      return (
          <rect x={(order.date - this.props.midnightTime)/10000} y={order.payed ? -price : 0} height={price} width={time} fill ='red'/>
      );
    };
    var time = (this.props.time - this.props.midnightTime)/10000;
    return (
    <div className='timeline' ref = {(item) => {this.width = item ? item.clientWidth : time}}>
      <h1>{timeLineDate.getDate()} / {timeLineDate.getMonth() + 1} / {timeLineDate.getFullYear()}</h1>
      <svg id='timeline' className= 'command' viewBox="0 -400 8640 800" onWheel = {timeLineWheel} onClick = {this.onClick}>
        <rect x='0' y='-400' width={time} height='800' fill = 'rgba(0, 0, 0, 0.8)'/>
        <rect x={time} y='-400' width={8640 - time} height='800' fill = 'rgba(255, 255, 255, 0.8)'/>
        <path d='M0,0 H1440' stroke = 'black' strokeWidth = '1'/>
        <rect className = 'cursor' x={this.state.x} y='-400' width='80' height='800' fill = 'grey'/>
      {this.props.orders.map(createOrders)}
      </svg>
      <span className='time'>{timeLineDate.getHours()} : {timeLineDate.getMinutes() < 10 ? '0'+timeLineDate.getMinutes() : timeLineDate.getMinutes()}</span>
      <span className={classnames('play', {hidden: this.state.play})} onClick={this.onPlay} />
      <span className={classnames('pause', {hidden: !this.state.play})} />
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
    var createOrder = function (order, index) {
      if (order.node.date >= timeLineDate.getTime() && i < 5) {
        i++;
        return <Order key={order.node.id} order={order.node}/>;
      }
    };
    return (
      <div className = "dashboard">
        <div id = 'dashboard' className = 'container' onWheel={timeLineWheel}>
          {this.props.orders.map(createOrder)}
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

  render() {
    var order = this.props.order;
    var createItem = (item) => {
      return (
        <div className = 'flex-item-2'>
          {item.parent}<br/>
          {item.name}
        </div>
      );
    };
    var date = new Date(order.date);
    var Hours = date.getHours();
    var Minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return (
      <div className={classnames('order', {hidden: order.date < timeLineDate, green: order.payed})} onClick={()=>{this.setState({expand: !this.state.expand});}} onWheel={(e) => {if(this.state.expand === true) e.stopPropagation();}}>
        <h1>Mr Dupond<span className='price'>{order.price + 'mB'}</span><span className='time'>{Hours} : {Minutes}</span></h1>
        <div className={classnames('items', {'nav-wrap': this.state.expand, hidden: !this.state.expand})}>
          {order.items.map(createItem)}
        </div>
      </div>
    );
  }
}
//we need to figure out how to pass the id in our query
export default Relay.createContainer(Board, {
  initialVariables: {
    midnightTime: midnightTime,
    id: 'UmVzdGF1cmFudDpkNGZkYTgxYy1jNGM2LTRmN2YtOTcxNi0zN2MyYTFlNTlmYzE='
  },
  fragments: {
    restaurant: () => Relay.QL`
    fragment on Root {
      restaurant(id: $id) {
        orders(first: 90, midnightTime: $midnightTime) {
          edges {
            node {
              id,
              date,
              payed,
              price,
              time,
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
