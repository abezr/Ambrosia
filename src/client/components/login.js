import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import validate from '../validate';
import SignupMutation from '../mutations/signupmutation';

export default class Auth extends React.Component {
  render() {
    return (
      <div className='auth'>
        <Login {...this.props}/>
      </div>
    );
  }
}

class Login extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { toggle: false, errors: {} };
  }

  render() {
    return (
      <div className='form'>
        <form id='signup' className={classnames('signup', {hidden: !this.state.toggle})} onSubmit={this._signup}>
          <span className='close-icon' onClick={this.close}/>
          <span className='log' key='mail'>Mail<br/>
            <span className='error'>{this.state.errors.mail}</span>
            <input id='mail' key='input-mail' className='signup' type='email'/>
          </span><br/>
          <span className='log' key='password'>Password<br/>
            <span className='error'>{this.state.errors.password}</span>
            <input id='password' key='input-password' className='signup' type= 'password'/>
          </span><br/>
          <span className='log' key='confirmPassword'>
            <span className="confirmPassword">Confirm your Password</span><br/>
            <span className='error'>{this.state.errors.match}</span>
            <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
            <div className='question' onClick={this._switch}>allready a member?</div>
          </span><br/>
        <input type='submit' key='submit' value='Signup' form='signup' id='submit'/>
        </form>
      <form id='login' className={classnames('login', {hidden: this.state.toggle})} onSubmit={this._login}>
        <span className='close-icon' onClick={this.close}/>
        <div className='social' ref='fb'><span className='facebook-icon'/>Sign in with facebook</div>
        <br/>
        <span className='log' ref='pseudo'>
          Pseudo<br/>
        <span className='error'>{this.state.errors.pseudo}</span>
          <input id='pseudo' ref ='pseudo-input' className='login' type='text'/>
        </span><br/>
        <span className='log' ref='password'>
          Password<br/>
        <span className='error'>{this.state.errors.password}</span>
          <input id='password' ref='password-input' className='login' type='password'/>
          <div className='question' onClick={this._switch}>not a member yet?</div>
        </span><br/>
      <input type='submit' value='Log-In' form='login' id='submit'/>
      </form>
    </div>
  );
  }

  _switch = () => {
    this.setState({toggle: !this.state.toggle});
  }

  _signup = (e) => {
    e.preventDefault();
    console.log('signup', e.target);
    var details = {};
    details.form = e.target.id;
    var el = e.target.getElementsByTagName('INPUT');
    for(var i=0; i<el.length; i++) {
      if(el[i].id !== 'submit') {
        details[el[i].id] = el[i].value;
      }
    }
    if(!validate(details)) {
      console.log('details validate', details);
      Relay.Store.update( new SignupMutation({credentials: details, user: this.props.user}) );
    } else {
      console.log('unvalidate details', details);
      this.setState({errors: details.errors});
    }
  }
}

export default Relay.createContainer(Auth, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      ${SignupMutation.getFragment('user')}
    }
    `
  }
})
