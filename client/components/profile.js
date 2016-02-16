
import React from 'react';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import UserMutation from '../mutations/usermutation';
import UpdateOrderMutation from '../mutations/updateordermutation';


import Close from './icons/close';

import Input from './widget/input';
import Modal from './widget/modal';
import Hearts from './widget/hearts';
import Textarea from './widget/textarea';
import Flag from './widget/flag';

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
      <div>
        {(() => {
          if (order.rate) {
            return <Hearts rate={order.rate} size={'1em'}/>;
          } else {
            return (<span>Give it a mark <Hearts size={'1em'}/></span>);
          }
        })()}
      </div>
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
  };

  render() {
    var user = this.props.user.user;
    var createRestaurant = (resto, index) => {
      return <Link to ={'/timeline/'+resto.node.id} className='restaurant' key={resto.node.id}>{resto.node.name}<Hearts rate={Math.round(resto.node.reviews.averageScore)} size={'1em'}/></Link>;
    };
    var createOrder = (order, index) => {
      return <Order order={order}/>
    };
    var treatedOrders = user.orders.edges.filter((order) => {return order.node.treated});
    var untreatedOrders = user.orders.edges.filter((order)=> {return !order.node.treated});
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
          <div className={classnames('profile-data-wrapper', {hidden: !user.restaurants.edges.length})}>
            <h3>Your Restaurants</h3>
            <div className='profile-data-list'>{user.restaurants.edges.map(createRestaurant)}</div>
          </div>
          <div className={classnames('profile-data-wrapper', {hidden: !untreatedOrders.length})}>
            <h3>You have {untreatedOrders.length} pending Orders</h3>
            <div className='profile-data-list'>{untreatedOrders.map(createOrder)}</div>
          </div>
          <div className={classnames('profile-data-wrapper', {hidden: !treatedOrders.length})}>
            <h3>You have {treatedOrders.length} treated Orders</h3>
            <div className='profile-data-list'>{treatedOrders.map(createOrder)}</div>
          </div>
        </div>
      </div>
    );
  }
}

class Order extends React.Component {
  constructor(props ,context) {
    super(props, context);
    this.state = {
      comment: '',
      rate: null,
      expand: false
    };
  }
  _update = (e) => {
    this.setState({[e.target.id]: e.target.value});
  };
  
  _onClick = (e, i) => {
    console.log(e.currentTarget, e.target, i);
    e.stopPropagation();
    this.setState({expand: true, rate: i});
  };

  _setMutation = () => {
    console.log('setmutation');
    var onFailure = () => console.log('failure');
    var onSuccess = () => this.setState({expand: false});
    Relay.Store.commitUpdate(new UpdateOrderMutation({order:{id: this.props.order.node.id, rate: this.state.rate, comment: this.state.comment}}), {onFailure, onSuccess});
  };

  render () {
    const orderNode = this.props.order.node;
    var date = new Date(orderNode.date);
    return (
      <div className='order' key={orderNode.id} onClick={(e)=>_displayModal(orderNode)}>
        <span>Ordered to<Link to ={'/restaurant/'+orderNode.restaurantID}><strong>{orderNode.restaurantName}</strong></Link>the {date.toLocaleDateString()}</span>
        {orderNode.treated ?
        <div className= 'right' onClick={e=>e.stopPropagation()}>
          <Hearts size={'1em'} onClick={this._onClick} rate={Math.round(orderNode.rate) || this.state.rate}/>
          <div className={this.state.expand ? '' : 'hidden'}>
            <Textarea id='comment' placeholder='leave a comment' update={this._update} onValid={this._setMutation} value={this.state.comment}/>
          </div>
        </div>
        : <span className='price'>{orderNode.price} mɃ</span>
        }
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
              name,
              reviews {
                averageScore
              }
            }
          }
        }
        orders(first:9999) {
          edges {
            node {
              id,
              price,
              date,
              treated,
              restaurantID,
              restaurantName,
              rate,
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
