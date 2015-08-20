import Login from './login';
import Signup from './signup';

import classnames from 'classnames';

class Auth extends React.Component {
  render() {
    var handler = this.state.signup ? <Signup/> : <Login/>;
    return (
      <div className='auth'>
        {handler}
      </div>
    );
  }
}

class login extends React.Component {
  switch() {
    this.setState({toggle: !this.state.toggle});
  },
  signup(e) {
    e.preventDefault();
    var details = {};
    details.form = e.target.id;
    var el = e.target.getElementsByTagName('INPUT');
    for(var i=0; i<el.length; i++) {
      details[el[i].id] = el[i].value;
    }
    Relay.Store.update(
      new SignupMutation({credentials: details})
    );
  },
  getInitialState() {
    return {toggle: false};
  },
  render() {
    return (
      <div className='form'>
        <form id={classnames({'signup', hidden: this.state.toggle})} onSubmit={this.signup}>
          <span className='close-icon' onClick={this.close}/>
          <span className='log' key='mail'>
          Mail<br/>
            {emailError}
            {emailUsed}
          <input id='mail' key='input-mail' className='signup' type='email'/>
          </span><br/>
          <span className='log' key='password'>
          Password<br/>
            {passwordError}
          <input id='password' key='input-password' className='signup' type= 'password'/>
          </span><br/>
          <span className='log' key='confirmPassword'>
            <label for="confirmPassword">Confirm your Password</label><br/>
            {matchError}
            <input id='confirmPassword' key='input-confirmPassword' className='signup' type= 'password'/>
            <div className='question' onClick={this.switch}>allready a member?</div>
          </span><br/>
          <input type='submit' key='submit' value='Signup' form='signup' className='submit'/>
        </form>
      <form id={classnames({'login', hidden: this.state.toggle})} onSubmit={this.login}>
        <span className='close-icon' onClick={this.close}/>
        <div className='social' ref='fb'><span className='facebook-icon'/>Sign in with facebook</div>
        <br/>
        <span className='log' ref='pseudo'>
          Pseudo<br/>
          <input id='pseudo' ref ='pseudo-input' className='login' type= 'text'/>
        </span><br/>
        <span className='log' ref='password'>
          Password<br/>
          <input id='password' ref='password-input' className='login' type= 'password'/>
          <div className='question' onClick={this.switch}>not a member yet?</div>
        </span><br/>
      <input type='submit' value='Log-In' form='login' className='submit'/>
      </form>
    </div>
  );
  }
}
