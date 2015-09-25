import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';

class Index extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  render() {
    const {children} = this.props;
    return (

      
      <div>
      <div className='nav'>
        <div className='flex-item title'>Ambrosia</div>
        <div className='flex-item login'>Login</div>
      </div>
      <Link to={`/login`}>Login</Link>
      {children}
      </div>
    );
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      id,
      mail,
      name
    }
    `
  }
});
