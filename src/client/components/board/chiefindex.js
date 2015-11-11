/**
 * @flow
 */

import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

/// make a board component to go through card and dashboard order
export default class ChiefIndex extends React.Component {
  constructor(props, context) {
    super(props, context);
  }
  componentWillReceiveProps (newProps) {
    if(!newProps.user.user.userID) {
      console.log('ChiefIndex:ComponentDidMount', newProps.user.user.userID);
      this.props.history.pushState({previousPath: this.props.location.pathname}, '/register');
    }
  }
  _select = (e) => {
    for (var i in this.refs) {
      console.log(this.refs[i].getDOMNode());
      this.refs[i].getDOMNode().className = 'flex-item-2';
    }
    e.target.className = 'flex-item-2 selected';
  }
  render() {
    console.log(this.props);
    return (
      <div className='chief-index'>
        <div className='nav flex-center'>
          <Link to= {'/card/'+this.props.id} className ='flex-item-2' ref='card' onClick={this._select}>Your Card</Link>
          <Link to= {'/timeline/'+this.props.id} className='flex-item-2' ref='board' onClick={this._select}>Dashboard Order</Link>
          <Link to= {'/settings/'+this.props.id} className='flex-item-2' ref='settings' onClick={this._select}>Restaurant Settings</Link>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Relay.createContainer(ChiefIndex, {
  fragments: {
    restaurant: () => Relay.QL`
      fragment on Root {
        restaurant {
          id
        }
      }
    `,
    user: () => Relay.QL`
    fragment on Root {
      user {
        userID
      }
    }`
  }
});
