import React from 'react';
import classnames from 'classnames';

export default class Input extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  _update = (e) => {
    this.props.update(e);
  }

  _onValid = (e) => {
    if (e.target.value === '') e.target.value = this.props.default;
    this.props.update(e);
  }

  render() {
    return (
      <span>
        <input className='input-widget' type={this.props.type ? this.props.type : 'text'} id={this.props.id} value={this.props.value} onChange={this._update} onBlur={this._onValid} onKeyDown={e => {if(e.keyCode === 13) e.target.blur()}} style={{width: (this.props.value.length + 1) / 2 + 'em'}}/>
      </span>
    );
  }
}
