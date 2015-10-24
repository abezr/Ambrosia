import React from 'react';
import Relay from 'react-relay';
import request from 'superagent';
import {Link} from 'react-router';
import classnames from 'classnames';
import validate from '../validate';
import SignupMutation from '../mutations/signupmutation';
import LoginMutation from '../mutations/loginmutation';

class Auth extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div className='modal'>
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
    console.log('login', this.props);
    const {user} = this.props.user;
    return (
      <div className='form'>
        <form id='signup' className={classnames('signup', {hidden: !this.state.toggle})} onSubmit={this._signup}>
          <span className='close-icon' onClick={this._close}/>
          <div className='log' key='mail'>Mail<br/>
            <span className='error'>{this.state.errors.mail}</span>
            <input id='mail' key='input-mail' className='signup' type='email'/>
          </div><br/>
        <div className='log' key='password'>Password<br/>
            <span className='error'>{this.state.errors.password}</span>
            <input id='password' key='input-password' className='signup' type= 'password'/>
          </div><br/>
        <div className='log' key='confirmPassword'>
            <span className="confirmPassword">Confirm your Password</span><br/>
            <span className='error'>{this.state.errors.match}</span>
            <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
            <div className='question' onClick={this._switch}>allready a member?</div>
          </div><br/>
        <input type='submit' key='submit' value='Signup' form='signup' id='submit'/>
        </form>
      <form id='login' className={classnames('login', {hidden: this.state.toggle})} onSubmit={this._login}>
        <span className='close-icon' onClick={this._close}/>
        <div className='social' ref='fb'><span className='facebook-icon'/>Sign in with facebook</div>
        <br/>
        <div className='log' ref='pseudo'>
          Pseudo<br/>
          <span className='error'>{this.state.errors.pseudo}</span>
          <input id='pseudo' ref ='pseudo-input' className='login' type='text'/>
        </div><br/>
        <div className='log' ref='password'>
          Password<br/>
          <span className='error'>{this.state.errors.password}</span>
          <input id='password' ref='password-input' className='login' type='password'/>
          <div className='question' onClick={this._switch}>not a member yet?</div>
        </div><br/>
      <input type='submit' value='Log-In' form='login' id='submit'/>
      </form>
    </div>
    );
  }

  _switch = () => {
    this.setState({toggle: !this.state.toggle});
  }

  _close = () => {
    console.log('close');
    this.props.history.goBack();
  }

  _login = (e) => {
      e.preventDefault();
      var onSuccess = ({Login}) => {
        console.log('Mutation successful!');
        //loginRequest(Login.user);
      };
      var onFailure = (transaction) => {
        var error = transaction.getError() || new Error('Mutation failed.');
        console.error(error);
      };
      var details = {};
      details.form = e.target.id;
      var el = e.target.getElementsByTagName('INPUT');
      for(var i=0; i<el.length; i++) {
        if(el[i].id !== 'submit') {
          details[el[i].id] = el[i].value;
        }
      }
      if(!validate(details)) {
        Relay.Store.update( new LoginMutation({credentials: details, user: this.props.user.user}), {onFailure, onSuccess});
      } else {
        this.setState({errors: details.errors});
      }
  };


  _signup = (e) => {
    e.preventDefault();
    var details = {};
    details.form = e.target.id;
    var el = e.target.getElementsByTagName('INPUT');
    for(var i=0; i<el.length; i++) {
      if(el[i].id !== 'submit') {
        details[el[i].id] = el[i].value;
      }
    }
    if(!validate(details)) {
      Relay.Store.update( new SignupMutation({credentials: details, user: this.props.user.user}) );
    } else {
      this.setState({errors: details.errors});
    }
  }
}

export default Relay.createContainer(Auth, {

  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    //and you use a mutation you have to call mutation fragment if not you get a warning
    user: () => Relay.QL`
    fragment on Root {
      user {
        id,
        userID,
        mail,
        name,
        ${SignupMutation.getFragment('user')}
        ${LoginMutation.getFragment('user')}
      }
    }
    `
  }
});
