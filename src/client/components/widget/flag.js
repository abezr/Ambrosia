import React from 'react';
import classnames from 'classnames';

export default class Flag extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className = {classnames('flag', {hidden: this.props.hidden})} style={{width: this.props.width || null, top: this.props.top || null, bottom: this.props.bottom || null, left: this.props.left || null, right: this.props.right || null, border: this.props.border || '1px solid', 'border-radius': this.props.borderRadius || '0.5em'}}>
        {this.props.children}
      </div>
    );
  }
}
