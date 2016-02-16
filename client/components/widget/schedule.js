import React from 'react';
import classnames from 'classnames';

import Close from '../icons/close';
import {InputNumber} from './input';

var midnightDate;
var week;
var _update;
/**
 * [Week description]
 * @param {[object]} props {week: Array<{day: String, openHours: {from: Number to: Number}}>, update: function(Week) }
 */
class Week extends React.Component {
  constructor(props, context) {
    super(props, context);
    midnightDate = new Date().setHours(0,0,0,0);
    week = this.props.week;
    _update = this.props.update;
  }

  render () {
    return (
      <div className = 'widget-opening-hours'>
        {this.props.week.map((day, index)=><Day index= {index}/>)}
      </div>
    );
  }
}
/**
 * A day schedule interface
 * @param  {[object]} props {day: {openHours : Array<object>[{from: Number, to: Number}], day: <string>}, midnightDate: Number, index: Number}
 * @return {[type]}       [description]
 */
class Day extends React.Component {
  constructor(props, context) {
    super(props,context);
    this.state = {time: {from:0, to:0}, expand: false};
  }
  _switch = () => {
    this.setState({expand: !this.state.expand});
  };
  
  _addHours = () => {
    week[this.props.index].openHours.push({
      from: 0,
      to: 0
    });
    _update(week);
  };
  
  _removeHours = (index) => {
    week[this.props.index].openHours.splice(index, 1);
    _update(week);
  };
  
  render() {
    var day = week[this.props.index];
    var createSVG = (time, index) => {
      var date = {
        from: new Date(midnightDate + time.from),
        to: new Date(midnightDate + time.to)
      };
      var from = time.from/100000;
      var to = time.to/100000;
      return (
        <g>
          <path d={'M'+(from < to ? from : to)+',12.5 H'+to} stroke='green' strokeWidth='25'/>
          <path className='from' d={'M'+(from < to ? from : to)+',25 V0'} stroke='black' strokeWidth='2'/>
          <text x={from < to ? from : to} y='-2.5' fill='black' style={{textAnchor: 'middle'}}>{(date.from.getHours()+ 'h' + (date.from.getMinutes() < 10 ? ('0' + date.from.getMinutes()) : date.from.getMinutes()))}</text>
          <text x={to} y='-2.5' fill='black' style={{textAnchor: 'middle'}}>{(date.to.getHours()+ 'h' + (date.to.getMinutes() < 10 ? ('0' + date.to.getMinutes()) : date.to.getMinutes()))}</text>
        </g>
      );
    }
    var createPickers = (time, index) => {
      return (
        <div className='picker-wrapper'>
          <span onClick={(e)=>this._removeHours(index)}><Close/></span>
          <TimePicker from={index} index={this.props.index}/><strong className='to'> to </strong><TimePicker to={index} index={this.props.index}/>
        </div>
      );
    }

    return (
      <div className='day-container'>
        <br/>
          <div className={classnames('picker-container', {hidden: !this.state.expand})}>
            {day.openHours.map(createPickers)}
            <span className='button' onClick={this._addHours}>And...</span>
          </div>
        <svg className='day' viewBox='0 0 864 25' onClick={this._switch}>
          {day.openHours.map(createSVG)}
          <text x={432} y={15} style={{textAnchor: 'middle'}}>{day.day}</text>
        </svg>
      </div>
    );
  }
}
/**
 * THe timepicker
 * @param  {object} props [object {index: Number, [from] || [to]: String}]
 * @return {[type]}       [description]
 */
var TimePicker = function (props) {
  var time = week[props.index].openHours[props.from !== undefined ? props.from : props.to][props.from !== undefined ? 'from' : 'to'];
  var date = new Date(midnightDate + time);

  var _changeHours = (e) => {
    console.log('changeHours', e.target.value);
    if(e.target.value >= 24 || e.target.value <= 0) return;
    date.setHours(e.target.value);
    week[props.index].openHours[props.from !== undefined ? props.from : props.to][props.from !== undefined ? 'from' : 'to'] = date.getTime() - midnightDate;
    _update(week);
  };

  var _changeMinutes = (e) => {
    console.log('changeMinutes', e.target.value);
    if (e.target.value >= 60 || e.target.value <= 0) return;
    date.setMinutes(e.target.value);
    week[props.index].openHours[props.from !== undefined ? props.from : props.to][props.from !== undefined ? 'from' : 'to'] = date.getTime() - midnightDate;
    _update(week);
  };
  return (
    <div className = 'timepicker'>
      <div className='picker'>
        <InputNumber type='number' id='hours' className='hours' value={date.getHours()} update={_changeHours}/> H
      </div>
      <div className='picker'>
        <InputNumber type='number' id='minutes' className='minutes' value={date.getMinutes()} update={_changeMinutes}/> Min
      </div>
    </div>
  );
};
export default Week;
