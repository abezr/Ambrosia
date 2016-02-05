import React from 'react';
import {Link} from 'react-router';

import Settings from '../icons/settings';

export default class CardIndex extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render () {
    return (
      <div className='card-index'>
        <nav className='nav-list'>
          <ul className = 'center'>
            <Link to={'/card/order/'+this.props.params.id} className='button'>Order</Link>
            <Link to={'/card/edit/'+this.props.params.id} className='button'>Edit</Link>
          </ul>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
