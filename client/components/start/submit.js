import React from 'react';
import Relay from 'react-relay';
import Close from '../icons/close';
import Loading from '../icons/loading';
import Modal from '../widget/modal';

export default class StartSubmit extends React.Component {

  constructor (props, context) {
    super(props, context);
    console.log(this.props);
    this.state = {load: false};
  }

  _close = () => {
    this.props.history.pushState(null, '/start/map');
  };

  _submit = () => {
    this.setState({load: true});
    this.props.submit();
  };

  render () {
    return (
      <Modal height={'15em'} hidden={false}>
        <span onClick={this._close}><Close stroke={'white'} strokeWidth={8} size={'1.5em'}/></span>
        <h1>You are opening <span style={{color:'yellow'}}>{JSON.parse(localStorage.restaurant).name}</span></h1>
        <p>You can change your card, your settings and your location at any time, instantly</p>
        <p>Welcome to Ambrosia, have fun.</p>
        <span className='submit-button' onClick={this._submit}>{this.state.load ? <Loading fill={'white'} /> : 'Open it'}</span>
      </Modal>
    );
  }
}
