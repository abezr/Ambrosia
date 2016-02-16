import React from 'react';
import classnames from 'classnames';

export default class Input extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  _update = (e) => {
    console.log('input update');
    if(e.keyCode === 13 || e.keyCode === 27) e.target.blur()
    this.props.update(e);
  };

  _onValid = (e) => {
    if (e.target.value === '') e.target.value = this.props.default || '';
    this.props.onValid(e) || this.props.update(e);
  };

  render() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "11px BlinkMacSystemFont";
    var width = ctx.measureText(this.props.value).width * 2.1 + (this.props.type === 'number' ? 20 : 0);
    return (
      <span>
        <input className={'widget-input ' + this.props.className || ''} type={this.props.type ? this.props.type : 'text'} id={this.props.id} defaultValue={this.props.value} onBlur={this._onValid} onKeyDown={this._update} style={{width: width + 'px'}}/>
      </span>
    );
  }
}

export class InputNumber extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "11px BlinkMacSystemFont";
    var width = ctx.measureText(this.props.value).width * 2.1 + (this.props.type === 'number' ? 20 : 0);
    return (
      <span>
        <input className={'widget-input ' + this.props.className || ''} type={this.props.type ? this.props.type : 'text'} id={this.props.id} defaultValue={this.props.value} onChange={this.props.update} style={{width: width + 'px'}}/>
      </span>
    );
  }
}
