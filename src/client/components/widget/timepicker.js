import React from 'react';

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
