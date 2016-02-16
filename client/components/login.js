import React from 'react';
import Relay from 'react-relay';
import request from 'superagent';
import {Link} from 'react-router';
import classnames from 'classnames';
import validate from '../validate';
import Modal from './widget/modal';
import Close from './icons/close';
import SignupMutation from '../mutations/signupmutation';
import LoginMutation from '../mutations/loginmutation';

class Auth extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = { toggle: false, errors: {} };
  }

  render() {
    const {user} = this.props.user;
    return (
      <Modal hidden={false}>
        <form id='signup' className={classnames('signup', {hidden: !this.state.toggle})} onSubmit={this._signup}>
          <Close onClick={this._close} stroke={'white'} size={'1em'}/>
          <div className='log' key='mail'>Mail<br/>
            <span className='error'>{this.state.errors.mail}</span>
            <input id='mail' key='input-mail' className='signup' type='email'/>
          </div>
          <div className='log' key='password'>Password<br/>
            <span className='error'>{this.state.errors.password}</span>
            <input id='password' key='input-password' className='signup' type= 'password'/>
          </div>
          <div className='log' key='confirmPassword'>
            <span className="confirmPassword">Confirm your Password</span><br/>
            <span className='error'>{this.state.errors.match}</span>
            <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
            <div className='question' onClick={this._switch}>allready a member?</div>
          </div>
          <input type='submit' key='submit' value='Signup' form='signup' id='submit'/>
        </form>
      <form id='login' className={classnames('login', {hidden: this.state.toggle})} onSubmit={this._login}>
        <Close onClick={this._close} stroke={'white'} size={'1em'}/>
        <div className='social' ref='fb'><span className='facebook-icon'/>Sign in with facebook</div>
        <br/>
        <div className='log' ref='pseudo'>
          Pseudo<br/>
          <span className='error'>{this.state.errors.pseudo}</span><br/>
          <input id='pseudo' ref ='pseudo-input' className='login' type='text'/>
        </div>
        <div className='log' ref='password'>
          Password<br/>
        <span className='error'>{this.state.errors.password}</span><br/>
          <input id='password' ref='password-input' className='login' type='password'/>
          <div className='question' onClick={this._switch}>not a member yet?</div>
        </div>
      <input type='submit' value='Log-In' form='login' id='submit'/>
      </form>
    </Modal>
    );
  }

  _switch = () => {
    this.setState({toggle: !this.state.toggle});
  };

  _close = () => {
    console.log('close');
    this.props.history.pushState({}, '/');
  };

  _login = (e) => {
      e.preventDefault();
      var onSuccess = ({Login}) => {
        for (var key in localStorage) {
          localStorage.removeItem(key);
        }
        this.props.location.state ? this.props.history.pushState({}, this.props.location.state.previousPath) : this.props.history.goBack();
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
        console.log('login', this.props.user.user.id);
        Relay.Store.update( new LoginMutation({credentials: details, user: this.props.user.user}), {onFailure, onSuccess});
      } else {
        this.setState({errors: details.errors});
      }
  };


  _signup = (e) => {
    e.preventDefault();
    var onSuccess = ({Login}) => {
      console.log('Mutation successful!');
      for (var key in localStorage) {
        localStorage.removeItem(key);
      }
      this.props.location.state ? this.props.history.pushState({}, this.props.location.state.previousPath) : this.props.history.goBack();
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
      console.log(this.props.user.user.id);
      Relay.Store.update( new SignupMutation({credentials: details, user: this.props.user.user}), {onFailure, onSuccess});
    } else {
      this.setState({errors: details.errors});
    }
  };
}

export default Relay.createContainer(Auth, {

  fragments: {
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
