import React from 'react';
import classnames from 'classnames';

export default class Textarea extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  _update = (e) => {
    this.props.update(e);
  }

  _onValid = (e) => {
    if(e.target.value === '') this.props.update(this.props.id, this.props.id);
  }

  render() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "11px BlinkMacSystemFont";
    var width = ctx.measureText(this.props.value).width * 2.1;
    return (
      <span>
        <textarea className='widget-textarea' placeholder={this.props.placeholder} type='text' id={this.props.id} value={this.props.value} onChange={this._update} onBlur={this._onValid} onKeyDown={e => {if(e.keyCode === 13) e.target.blur()}} style={{width: width + 'px'}}/>
      </span>
    );
  }
}
