import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import classnames from 'classnames';

var Settings = {
  scorable : false,
  schedule: [{day: 'monday', openHours:[{from: 0, to:0}]}, {day: 'tuesday', openHours:[{from: 0, to:0}]}, {day: 'wednesday', openHours:[{from: 0, to:0}]}, {day: 'thursday', openHours:[{from: 0, to:0}]}, {day: 'friday', openHours:[{from: 0, to:0}]}, {day: 'saturday', openHours:[{from: 0, to:0}]}, {day: 'sunday', openHours:[{from: 0, to:0}]}]
};
var _update;
var midnightDate;

export default class StartSettings extends React.Component {

  constructor(props, context) {
    super(props, context);
    console.log('settings constructor');
    if(localStorage.settings) {
      Settings = JSON.parse(localStorage.settings);
    }
    _update = () => {
      this.forceUpdate();
    }
    this.state = {save: false};
  }

  componentWillUnmount () {
    localStorage.settings = JSON.stringify(Settings);
  }

  render() {
    midnightDate = new Date().setHours(0,0,0,0);
    var createWeek = (day, index) => {
      return (
        <Day index={index}/>
      );
    }
    return (
      <div className='settings'>
        <h1 className='intro'>
          Check your restaurant settings.
        </h1>
        <div>
          <div className='setting'>let clients note your restaurant<Cursor state={Settings.scorable} cursor='scorable'/></div>
        </div>
        <h2>Check out your opening hours</h2>
        <div className='opening-hours nav-wrap'>
          {Settings.schedule.map(createWeek)}
        </div>
      </div>
    );
  }
}

class Cursor extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  _switch = (e) => {
    Settings[this.props.cursor] = !Settings[this.props.cursor];
    _update()
  }
  render() {
    return (
      <svg id='timeline' className='cursor' viewBox="0 0 40 20" onClick={this._switch}>
        <rect x='0' y='0' rx='10' ry='10' width='40' height='20' fill={this.props.state ? 'rgb(42, 195, 4)' : 'rgb(238, 17, 17)'}/>
        <circle cx={this.props.state ? '10' : '30'} cy='10' r='10' fill='black'/>
      </svg>
    );
  }
}

class Day extends React.Component {
  constructor(props, context) {
    super(props,context);
    this.state = {time: {from:0, to:0}, expand: false};
  }
  _selected = (e) => {
    console.log(e);
  }
  _switch = () => {
    this.setState({expand: !this.state.expand});
  }
  _addHours = () => {
    Settings.schedule[this.props.index].openHours.push({
      from: 0,
      to: 0
    });
    _update();
  }
  _removeHours = (index) => {
    Settings.schedule[this.props.index].openHours.splice(index, 1);
    _update();
  }
  render() {
    var schedule = Settings.schedule[this.props.index];
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
        <div className='flex-item-2 picker-wrapper'>
          <span className='close-icon' onClick={(e)=>this._removeHours(index)}/>
          <Timepicker from={index} index={this.props.index}/><strong className='to'> to </strong><Timepicker to={index} index={this.props.index}/>
        </div>
      );
    }

    return (
      <div className='day-container'>
        <br/>
          <div className={classnames('flex-center', {'nav-wrap': this.state.expand, hidden: !this.state.expand})}>
            {schedule.openHours.map(createPickers)}
            <span className='button flex-item-3' onClick={this._addHours}>And...</span>
          </div>
        <svg className='day' viewBox='0 0 864 25' onClick={this._switch}>
          {schedule.openHours.map(createSVG)}
          <text x={432} y={15} style={{textAnchor: 'middle'}}>{schedule.day}</text>
        </svg>
      </div>
    );
  }
}
class Timepicker extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  _changeHours = (e, date) => {
    if (Math.abs(e.target.value > 24)) return;
    date.setHours(Math.abs(e.target.value));
    console.log(24*60*60*1000, date.getTime()-midnightDate, e.target.value);
    Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] = date.getTime() - midnightDate;
    _update();
  }

  _changeMinutes = (e, date) => {
    if (Math.abs(e.target.value > 60)) return;
    date.setMinutes(Math.abs(e.target.value));
    Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] = date.getTime() - midnightDate;
    _update();
  }

  _incPlusHours = (time) => {
    console.log('incPlusHours');
    if (time > 23*60*60*1000) return;
    else {
      Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] += 60*60*1000;
    }
    _update();
  }
  _incLessHours = (time) => {
    if (time < 60*60*1000) return;
    else {
      Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] -= 60*60*1000;
    }
    _update();
  }
  _incPlusMinutes = (time) => {
    console.log('incPlusMinutes');
    if (time > (24*60*60*1000 - 60*1000)) return;
    else {
      Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] += 60*1000;
    }
    _update();
  }
  _incLessMinutes = (time) => {
    console.log('incLessMinutes');
    if (time < 60*1000) return;
    else {
      Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'] -= 60*1000;
    }
    _update();
  }
  render () {
    var time = Settings.schedule[this.props.index].openHours[this.props.from !== undefined ? this.props.from : this.props.to][this.props.from !== undefined ? 'from' : 'to'];
    var date = new Date(midnightDate+time);
    return (
      <div className = 'timepicker'>
        <div className='flex-item-2 picker'>
          <span className='inc-plus' onClick={(e) => this._incPlusHours(time)}>▲</span>
          <input type='text' className='hours' value={date.getHours()} onChange={(e) => this._changeHours(e, date)}/> H
          <span className='inc-less' onClick={(e) => this._incLessHours(time)}>▼</span>
        </div>
        <div className='flex-item-2 picker'>
          <span className='inc-plus' onClick={(e) => this._incPlusMinutes(time)}>▲</span>
          <input type='text' className='minutes' value={date.getMinutes()} onChange={(e) => this._changeMinutes(e, date)}/> Min
          <span className='inc-less' onClick={(e) => this._incLessMinutes(time)}>▼</span>
        </div>
      </div>
    );
  }
}
