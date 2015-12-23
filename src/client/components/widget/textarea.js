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
    return (
      <span>
        <textarea className='textarea-widget' type='text' id={this.props.id} value={this.props.value} onChange={this._update} onBlur={this._onValid} onKeyDown={e => {if(e.keyCode === 13) e.target.blur()}} style={{width: (this.props.value.length + 1) / 2 + 'em'}}/>
      </span>
    );
  }
}
