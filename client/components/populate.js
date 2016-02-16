import React from 'react';
import Relay from 'react-relay';
import request from 'superagent';
import LoginMutation from '../mutations/loginmutation';
import Loading from './icons/loading';
import Modal from './widget/modal';

export class Populate extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {loading: false, hidden: true};
    if(!localStorage.geolocation) {
      console.log('geolocation');
      navigator.geolocation.getCurrentPosition((position) => {
      localStorage.geolocation = JSON.stringify([position.coords.longitude, position.coords.latitude]);
      this.forceUpdate();
      });
    }
  }

  _populate = () => {
    if(!localStorage.geolocation) {
      this.setState({error: 'geolocalization please wait...'});
      return;
    }
    this.setState({loading: true});
    var geolocation = JSON.parse(localStorage.geolocation);
    request.post('http://localhost:3800/populate')
    .query({
      params: localStorage.geolocation
    })
    .end((err, res) => {
      if(err) console.log('home:request:error', err);
      console.log(res);
      var onFailure = () => console.log('failure');
      var onSuccess = () => {
        this.setState({hidden: false});
        this.setState({loading: false});
      }
      Relay.Store.update(new LoginMutation({credentials: {pseudo: 'duduche@gmail.com', password:'Ambrosia68'}, user: this.props.user.user}), {onFailure, onSuccess});
    });
  };

  _login = () => {
    var onFailure = () => console.log('failure');
    var onSuccess = () => {
      this.setState({hidden: false});
    }
    Relay.Store.update(new LoginMutation({credentials: {pseudo: 'duduche@gmail.com', password:'Ambrosia68'}, user: this.props.user.user}), {onFailure, onSuccess});
  };

  render () {
    return (
      <div className='center-text'>
        <h1>Lets put some random data</h1>
        {this.state.error || ''}
        <span className='button' onClick={this._populate}>Populate!{this.state.loading ? <Loading/> : ''}</span><br/>
        <Modal hidden={this.state.hidden}>
          <p>You have been logged in as 'Duduche'</p>
          <span className='button' style={{color: 'white'}} onClick={(e)=>this.setState({hidden: true})}>OK!</span>
        </Modal>
      </div>
    );
  }
}

export default Relay.createContainer(Populate, {

  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        id,
        userID,
        mail,
        name,
        ${LoginMutation.getFragment('user')}
      }
    }
    `
  }
});
