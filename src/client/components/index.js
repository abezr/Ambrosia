import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import Login from './login.js';
import LoginMutation from '../mutations/loginmutation';

import Flag from './widget/flag';

<section ref = 'header'>
  <article className='text-center'><h5><div className='button'>Become a Chief</div></h5></article>
</section>

export class Index extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.refs.content.style.height = (window.innerHeight - this.refs.header.offsetHeight) + 'px';
    console.log(this.refs.offsetHeight, this.refs.content.style.height);
  }

  contentScroll = (e) => {
    if (e.target.scrollHeight <= e.target.scrollTop + e.target.clientHeight) {
      window.onContentScrollEnd ? window.onContentScrollEnd() : console.log('scrollEnd');
    }
  }

  render() {
    //const {children, root} = this.props;
    const user = this.props.user.user;
    if (!this.props) return <div>Loading...</div>;
    return (
      <div>
      <header ref = 'header'>
      <nav className='nav-list'>
        <div className='title'><Link to='/' >Ambrosia</Link></div>
        <ul className='float-right'>
          <li><Link to='/restaurants/list' className=''>Restaurants</Link></li>
          <li><Link to='/start/card' className=''>Start!</Link></li>
          <LoginButton {...user}/>
        </ul>
      </nav>
      </header>
      <section ref = 'content' onScroll = {this.contentScroll} className='content'>
        {this.props.children}
      </section>
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
    console.log('LoginButton:Logout', this.props);
    //the easiest way to logout is to login with unknown user
    Relay.Store.update(new LoginMutation({credentials: {pseudo:'', password:''}, user: this.props}));
  }
  _expand = () => {
    this.setState({expand: !this.state.expand});
  }

  render() {
    if(this.props.mail === '') {
      return <li><Link to='/register' className='flex-item-4 login-link'><span>Login</span></Link></li>;
    } else {
      return (
        <li className="auth" onClick={this._expand}>
          <a className="auth-btn">{this.props.name ? this.props.name : this.props.mail} ▼</a>
          <div className="dropdown-content">
            <Link to='/profile'>Profile</Link>
            <a onClick={this._logout}>Logout</a>
          </div>
        </li>
      );
    }
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        ${LoginMutation.getFragment('user')}
        mail,
        name,
        id,
        userID
      }
    }
    `
  }
});
