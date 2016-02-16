/**
 * @flow
 */

import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
import classnames from 'classnames';
import UpdateRestaurantMutation from '../../mutations/updaterestaurantmutation';

import Settings from '../icons/settings';
import Valid from '../icons/valid';

import Cursor from '../widget/cursor';
import DropDownButton from '../widget/dropdown';
import Hearts from '../widget/hearts';

/// make a board component to go through card and dashboard order
class Board extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      active: this.props.location.pathname,
      currency: 'mB',
      settings: false
    }
  }
  componentWillReceiveProps (newProps) {
    if (!newProps.user.user.userID) {
      console.log('ChiefIndex:componentWillReceiveProps', newProps.user.user.userID);
      this.context.router.pushState({
        previousPath: this.props.location.pathname
      }, '/register');
    }
  }
  
  componentWillMount () {
    console.log('board:componentWillMount', this.props);
    if (this.props.user.user.userID !== this.props.restaurant.restaurant.userID) {
      console.log('ChiefIndex:ComponentWillMount', this.props.user.user.userID);
      this.props.history.pushState({}, '/');
    }
  }

  _select = (e) => {
    for (var i in this.refs) {
      this.refs[i].getDOMNode().className = 'item';
    }
    e.target.className = 'item selected';
  };

  _switchExpand = () => {
    this.setState({
      settings: !this.state.settings,
    });
  };

  _switch = (e) => {
    var resto = {
      id: this.props.id,
      [e.currentTarget.id]: !this.props.restaurant.restaurant[e.currentTarget.id]
    };
    var onFailure = () => {
      console.log('onFailure');
    };
    var onSuccess = () => {
      console.log('onSuccess');
      this.setState({save: false});
    };
    Relay.Store.commitUpdate(new UpdateRestaurantMutation({restaurant: resto}), {onFailure, onSuccess});
  };

  render () {
    var restaurant = this.props.restaurant.restaurant;
    var turnover = () => {
      var amount = 0;
      restaurant.orders.edges.map(order => {
        amount += order.node.price;
      });
      return amount;
    };
    return (
      <div className='chief-index'>
        <nav className='nav-list'>
          <Settings size='1.5em' onClick={this._switchExpand}/>
          <ul className='center'>
            <li><Link to= {'/card/edit/'+this.props.id} className ={classnames('item', {
              selected: (this.props.location.pathname.search('card') !== -1)
            })} ref='card' onClick={this._select}>Card</Link></li>
            <li><Link to= {'/timeline/'+this.props.id} className={classnames('item', {
              selected: (this.props.location.pathname.search('timeline') !== -1)
            })} ref='board' onClick={this._select}>Orders</Link></li>
            <li><Link to= {'/settings/'+this.props.id} className={classnames('item', {
              selected: (this.props.location.pathname.search('settings') !== -1)
            })} ref='settings' onClick={this._select}>Settings</Link></li>
          </ul>
          <div className='open'><Cursor id={'open'} size={'1em'} on={restaurant.open} update={this._switch}/> Open</div>
        </nav>
        <section>
          <div className={'settings'+(this.state.settings ? ' expand' : '')}>
            <div className={'settings-cursor'+(this.state.settings ? ' expand' : '')}>
              <div>Today Turnover: <strong>{turnover()} {this.state.currency}</strong></div>
              <div>Orders Today: <strong>{restaurant.orders.edges.length}</strong></div>
              <div><Hearts rate={Math.round(restaurant.reviews.averageScore)} size={'1em'}/> {restaurant.reviews.comments.length} reviews</div>
              <div><DropDownButton name={'Currency'} items={['mB', 'dollar', 'euro']} update={(e)=> this.setState({currency: e.currentTarget.id})} selected={this.state.currency} /></div>
              <div><Cursor id={'open'} size={'1em'} on={restaurant.open} update={this._switch}/> open</div>
              <div><Cursor id={'scorable'} size={'1em'} on={restaurant.scorable} update={this._switch}/> scorable</div>
            </div>
          </div>
          <div className={'children-container'+(this.state.settings ? ' expand' : '')}>
            {this.props.children}
          </div>
        </section>
      </div>
    );
  }
}

export default Relay.createContainer(Board, {
  initialVariables: {
    midnightTime: new Date().setHours( 0, 0, 0, 0),
  },
  fragments: {
    restaurant: () => Relay.QL `
      fragment on Root {
        restaurant {
          reviews {
            averageScore,
            comments
          },
          scorable,
          orders(first: 9000, midnightTime: $midnightTime) {
            edges {
              node {
                id,
                price
              }
            }
          }
          open,
          id,
          userID
        }
      }
    `,
    user: () => Relay.QL `
    fragment on Root {
      user {
        userID
      }
    }`
  }
});
