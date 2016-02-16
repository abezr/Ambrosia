import React from 'react';
import classnames from 'classnames';

export default class Textarea extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  _update = (e) => {
    if(e.keyCode === 13 || e.keyCode === 27) e.target.blur()
    this.props.update(e);
  };

  _onValid = (e) => {
    console.log('blur');
    if (e.target.value === '') e.target.value = this.props.default || '';
    this.props.onValid() || this.props.update(e);
  };

  render() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "11px BlinkMacSystemFont";
    var width = ctx.measureText(this.props.value || this.props.placeholder).width * 2.1;
    return (
      <span>
        <textarea className='widget-textarea' placeholder={this.props.placeholder} type='text' id={this.props.id} defaultValue={this.props.value} onBlur={this._onValid} onKeyDown={this._update} style={{width: width + 'px'}}/>
      </span>
    );
  }
}
