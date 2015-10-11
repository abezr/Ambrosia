import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import Login from './login.js';

export class Index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { login: false };
  }

  componentWillMount() {
  }

  render() {
    console.log('index:render', this.props, window.userID);
    const {children, user} = this.props;
    if (!this.props) return <div>Loading...</div>;
    return (
      <div>
      <div className='nav nav-brand'>
        <div className='flex-item-1 title'><Link to='/' >Ambrosia</Link></div>
        <div className='flex-item-2'>{user.user.mail}<br/>{user.user.name}</div>
        <Link to='/restaurants' className='flex-item-2'>Restaurants</Link>
        <Link to='/start' className='flex-item-3'>Start!</Link>
        <Link to='/register' className='flex-item-4 login-link' onCLick={this._switch}><span>Login</span></Link>
      </div>
      <div className='content'>

      </div>
      {children}
      </div>
    );
  }
}

export default Relay.createContainer(Index, {
  initialVariables: {userID: document.getElementById('app').dataset.userid || '2'},
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user(id: $userID) {
        mail,
        id
      }
    }
    `
  }
});
