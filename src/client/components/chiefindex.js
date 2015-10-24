import React from 'react';
import Relay from 'react-relay';

/// make a board component to go through card and dashboard order
export default class ChiefIndex extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  render() {
    return (
      <div className='chief-index'>
        <div className='nav'>
          <div className='flex-item-2'>Your Card</div>
          <div className='flex-item-2'>Dashboard Order</div>
        </div>
      {this.props.children}
      </div>
    );
  }
}
