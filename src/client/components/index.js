import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import Login from './login.js';

export class Index extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { add: true };
  }

  render() {
    //const {children, root} = this.props;
    const user = this.props.user.user;
    if (!this.props) return <div>Loading...</div>;
    return (
      <div>
      <header>
      <section className={classnames({hidden: !this.state.add})}>
        <span className='close-icon' onClick={(e) => {this.setState({add: false})}}></span>
        <article className='text-center'><h5><div className='button'>Become a Chief</div></h5></article>
      </section>
      <nav className='nav nav-brand'>
        <div className='flex-item-1 title'><Link to='/' >Ambrosia</Link></div>
        <Link to='/restaurants' className='flex-item-2'>Restaurants</Link>
        <Link to='/start' className='flex-item-2'>Start!</Link>
        <LoginButton {...user}/>
      </nav>
      </header>
      <section className='content'>

      </section>
      {this.props.children}
      </div>
    );
  }
}

class LoginButton extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {expand: false};
  }
  _logout = () => {
    console.log('must implement a logout mutation');
  }
  _expand = () => {
    this.setState({expand: true});
  }
  _retract = () => {
    this.setState({expand: false});
  }
  render() {
    if(this.props.mail === '') {
      return <Link to='/register' className='flex-item-4 login-link'><span>Login</span></Link>;
    } else {
      return (
        <div className='session flex-item-2'>
          <div className= 'button' onMouseEnter={this._expand} onMouseLeave={this._retract}>{this.props.name ? this.props.name : this.props.mail} ▼</div>
          <div className={classnames('menu', {hidden: !this.state.expand})} onMouseEnter={this._expand} onMouseLeave={this._retract}>
            <div className='profile-link'><Link to='/profile'>Profile</Link></div>
            <div className='button' onClick={this._logout}>Logout</div>
          </div>
        </div>
      );
    }
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        mail,
        name,
        id
      }
    }
    `
  }
});
