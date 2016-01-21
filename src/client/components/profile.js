
import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import UserMutation from '../mutations/usermutation';

import Close from './icons/close';

import Input from './widget/input';
import Modal from './widget/modal';

//Picture Profile
//name
//Restaurant owned
//an history of orders made as a user
var _displayModal;
var _hideModal;
var modalContent;
var getModalContent = (order) => {
  //TODO think about real order number instead of client orderID
  console.log(order);
  var date = new Date(order.date);
  var day = date.toLocaleDateString();
  var hours = date.getHours() + ' hours ';
  var minutes = date.getMinutes() <10 ? '0'+date.getMinutes()+' minutes' : date.getMinutes()+' minutes';
  return (
    <div className='modal-content'>
      <Close size='2em' onClick={e => _hideModal()}/>
      <div>Order number: {order.id}</div>
      <div>Ordered the {day} at {hours}{minutes} at <Link to ={'/restaurant/'+order.restaurantID}><strong>{order.restaurantName}</strong></Link></div>
      <div className='items'>{order.items.map(item => {return <div className='item'>{item.parent}<br/>{item.name}</div>})}</div>
      <div>price: {order.price} mB</div>
      <div>payed: {order.payed ? 'yes' : 'no'}</div>
      <div>treated: {order.treated ? 'yes' : 'no'}</div>
    </div>
  );
}
class Profile extends React.Component {

  constructor(props, context) {
    super(props, context);
    var user = this.props.user.user;
    _displayModal = (order) => {
      modalContent = getModalContent(order);
      this.setState({modal: true});
    }
    _hideModal = () => {
      this.setState({modal: false});
    }
    this.state = {
      modal: false,
      update: {
        name: user.name ? user.name : 'Your name here',
        mail: user.mail ? user.mail : 'Your mail here',
        profilePicture: user.profilePicture || '/stylesheets/icons/profile.png',
      },
      save: false
    };
  }

  componentDidMount () {
    if(!this.props.user.user.userID) {
      this.props.history.pushState({previousPath: '/start'}, '/register');
    }
  }

  componentWillReceiveProps(newProps) {
    var user = newProps.user.user;
    if(!newProps.user.user.userID) {
      this.props.history.pushState({previousPath: '/start'}, '/register');
    }
    this.setState({
      update: {
        name: user.name ? user.name : 'Your name here',
        mail: user.mail ? user.mail : 'Your mail here',
        profilePicture: user.profilePicture || '/stylesheets/icons/profile.png',
      },
      save: false
    });
  }

  _update = (e) => {
    console.log(e.keyCode, e);
    var onSuccess = () => console.log('success');
    var onFailure = () => console.log('failure');
    if(e.keyCode === 13) {
      Relay.Store.commitUpdate(new UserMutation({user: this.props.user.user, update: this.state.update}), {onFailure, onSuccess});
    } else {
      this.state.update[e.target.id] = e.target.value;
      this.setState({
        update: this.state.update,
        save: true
      });
    }
  }

  render() {
    var user = this.props.user.user;
    var createRestaurant = (resto, index) => {
      return <Link to ={'/timeline/'+resto.node.id} className='restaurant' key={resto.node.id}>{resto.node.name}</Link>;
    };
    var createOrder = (order, index) => {
      const orderNode = order.node;
      var date = new Date(orderNode.date);
      return (
        <div className='order' key={orderNode.id} onClick={(e)=>_displayModal(orderNode)}>
          <div>Ordered to<Link to ={'/restaurant/'+orderNode.restaurantID}><strong>{orderNode.restaurantName}</strong></Link>the {date.toLocaleDateString()}</div>
          <span className='price'>{orderNode.price} mɃ</span>
        </div>
      );
    };
    return (
      <div className='profile'>
        <Modal hidden={!this.state.modal}>
          {modalContent}
        </Modal>
        <div className='profile-credentials'>
          <img src={user.profilePicture ? user.profilePicture : '/stylesheets/icons/profile.png'} alt="Profile-Picture"/>
          <div className='credentials marged'>
            <Input id='name' type='text' update={this._update} value = {this.state.update.name} /><br/>
            <Input id='mail' type='text' update={this._update} value = {this.state.update.mail} /><br/>
            <Link className='openarestaurant-link button' to = {'/start/card'}>Open a restaurant</Link>
          </div>
        </div>
        <div className='profile-data'>
          <div className={classnames('width-2', {hidden: !user.restaurants.edges.length})}>
            <h3>Your Restaurants</h3>
            <div className='restaurants-list'>{user.restaurants.edges.map(createRestaurant)}</div>
          </div>
          <div className='width-2'>
            <h3>You have {user.orders.edges.length} pending Orders</h3>
            <div className='orders-list'>{user.orders.edges.map(createOrder)}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Profile, {
  //can't query for orders cause they do not have an id in the database...
  fragments: {
    user: () => Relay.QL`
    fragment on Root {
      user {
        ${UserMutation.getFragment('user')}
        id,
        userID,
        name,
        mail,
        profilePicture,
        restaurants(first: 10) {
          edges {
            node {
              id,
              name
            }
          }
        }
        orders(first:9999, pending: true) {
          edges {
            node {
              id,
              price,
              date,
              restaurantID,
              restaurantName,
              items {
                id,
                parent,
                name
              }
            }
          }
        }
      }
    }
    `
  }
});
