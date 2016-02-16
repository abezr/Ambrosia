import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import classnames from 'classnames';

import Close from '../icons/close';
import Cursor from '../widget/cursor';
import Schedule from '../widget/schedule';

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

  _switch = (e) => {
    Settings[e.currentTarget.id] = !Settings[e.currentTarget.id];
    _update();
  };

  _updateSchedule = (schedule) => {
    Settings.schedule = schedule;
    _update();
  };

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
          <div className='setting'>let clients note your restaurant<Cursor id={'scorable'} size={'2em'} on={Settings.scorable} update={this._switch}/></div>
        </div>
        <h2>Check out your opening hours</h2>
        <Schedule week={Settings.schedule} update={this._updateSchedule}/>
      </div>
    );
  }
}
