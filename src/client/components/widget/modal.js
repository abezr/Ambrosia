import React from 'react';
import classnames from 'classnames';

export default class Modal extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div className = {classnames('modal', {hidden: this.props.hidden})}>
        <div className = 'form' style={{'border': this.props.border || '2px solid', 'height': this.props.height || ""}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
