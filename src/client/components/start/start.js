import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import Relay from 'react-relay';
import {Link} from 'react-router';
import RestaurantMutation from '../../mutations/restaurantmutation';

var route = {card: {name:{left:'', right:'settings'}, path:{left:'', right:'/start/settings'}}, settings: {name:{left:'card', right:'map'}, path:{left:'/start/card', right:'/start/map'}}, map: {name:{left:'settings', right:''}, path:{left:'/start/settings', right:''}}};

export default class Start extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._submit = (name, value) => {
      console.log('submit');
      this.setState({name: value});
    }
  }
  componentDidMount () {
    if(!this.props.user.user.userID) {console.log('Start:ComponentDidMount', this.props.user.user.userID);
      this.props.history.pushState({
        previousPath: '/start'
      }, '/register');}
  }

  componentWillReceiveProps (newProps) {
    console.log('Start:componentWillReceiveProps', newProps.user.user.userID);
    if (!newProps.user.user.userID) {this.props.history.pushState({
        previousPath: '/start'
      }, '/register');}
  }

  _findLocation = () => {
    var match = this.props.location.pathname.match(/card|settings|map/);
    console.log(match);
    if(match === null) return route['card'];
    return route[match[0]];
  }

  renderChildren = () => {
    return React.Children.map(this.props.children, (child) => {
        return cloneWithProps(child, {
          submit: this._submit
        });
    });
  }

  render() {
    var location = this._findLocation();
    var pathName = this.props.location.pathname.match(/card|settings|map/)[0];
    return (
      <div className='start-index'>
        {this.renderChildren()}
        <svg className='circles' viewBox='0 0 100 40'>
          <circle cx="10" cy="20" r="10" stroke={pathName === 'card' ? 'black' : 'black'} sbluetrokeWidth="2" fill={pathName === 'card' ? 'black' : 'white'} />
          <circle cx="50" cy="20" r="10" stroke={pathName === 'settings' ? 'black' : 'black'} strokeWidth="2" fill={pathName === 'settings' ? 'black' : 'white'} />
          <circle cx="90" cy="20" r="10" stroke={pathName === 'map' ? 'black' : 'black'} strokeWidth="2" fill={pathName === 'map' ? 'black' : 'white'} />
        </svg>
        <Link to={location.path.right} className='link-right'>
          {location.name.right}
        </Link>
        <Link to={location.path.left} className='link-left'>
          {location.name.left}
        </Link>
      </div>
    )
  }
}

export default Relay.createContainer(Start, {
  fragments: {
    //Question: Is fragment on mutation available on the component himself? no it's not
    //and you use a mutation you have to call mutation fragment if not you get a warning
    user: () => Relay.QL `
    fragment on Root {
      user {
        id,
        userID,
        ${RestaurantMutation.getFragment('user')}
      }
    }
    `
  }
});
