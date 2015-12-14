import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';
import List from './icons/list';
import Map from './icons/map';

var orderByScore = (list) => {
  var averageScore = (restaurant) => {
    if(!restaurant.scorable) return 0;
    var stamp = 0;
    restaurant.score.map(mark => {
      stamp += mark;
    });
    return stamp /= restaurant.score.length;
  };
  return list.sort((a, b) => {
    return averageScore(b.node)-averageScore(a.node);
  });
};

var orderByDistance = (list) => {
  return list.sort((a, b) => {
    return a.node.distance - b.node.distance;
  });
}

export class RestaurantsIndexComponent extends React.Component {

  constructor (props, context) {
    super(props, context);
    this.state = {
      search: '',
      orderByScore: false,
      loading: false
    };
    if (!localStorage.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.geolocation = JSON.stringify([position.coords.longitude, position.coords.latitude]);
        this.props.relay.setVariables({
          location: JSON.parse(localStorage.geolocation)
        });
      });
    }
    window.onContentScrollEnd = () => {
      if (this.props.restaurant.restaurants.pageInfo.hasNextPage) {
        this.props.relay.setVariables({
          count: this.props.relay.variables.count + 10
        }, (readyState) => {
          this.state.loading = !readyState.ready;
        });
      }
    }
  }

  _submit = () => {
    console.log('submit');
    window.restaurantName = this.refs.name.value;
    this.props.relay.forceFetch({
      name: this.refs.name.value
    }, (readyState) => {
      if (readyState.done)
        console.log('readyState', this.props.restaurant.restaurants.edges);
      }
    );
  }

  _onKeyDown = (e) => {
    console.log(e.keyCode);
    if(e.keyCode === 13) this._submit();
  }

  _onSelect = (e) => {
    var e = e.target;
    console.log(e.options[e.selectedIndex].value);
    this.setState({
      orderByScore: e.options[e.selectedIndex].value === '2' ? true : false
    });
  }

  renderChildren = () => {
    console.log('renderChildren', this.state.orderByScore);
    return React.Children.map(this.props.children, (child) => {
      return cloneWithProps(child, {
        restaurants: this.state.orderByScore ? orderByScore(this.props.restaurant.restaurants.edges) : orderByDistance(this.props.restaurant.restaurants.edges),
        loading: this.state.loading,
        geolocation: localStorage.geolocation
          ? JSON.parse(localStorage.geolocation)
          : null
      });
    });
  }

  render () {
    console.log('render', this.props.restaurant.restaurants.edges);
    return (
      <div className='restaurants-index'>
        <nav className='nav nav-tools'>
          {this.props.location.pathname.match(/list/) ? <Link className='nav-item' to='/restaurants/map'><Map size = {'2em'}/></Link> : <Link className='nav-item' to='/restaurants/list'><List size = {'2em'}/></Link>}
          <div className='search-container nav-item'>
            <input type='text' ref='name' className='search-input' onKeyDown={this._onKeyDown}/>
            <button className='search-icon-wrapper'>
              <span className='search-icon' onClick={this._submit}/>
            </button>
          </div>
          <div className='order-by nav-item'>
            order-by:
            <select ref = 'orderBy' onChange={this._onSelect}>
              <option value='1' onClick={this._onSelect}>distance</option>
              <option value='2' onClick={this._onSelect}>score</option>
            </select>
          </div>
        </nav>
        {this.renderChildren()}
      </div>
    )
  }
}

export default Relay.createContainer(RestaurantsIndexComponent, {
  initialVariables: {
    location: localStorage.geolocation
      ? JSON.parse(localStorage.geolocation)
      : null,
    name: window.restaurantName || null,
    score: false,
    count: 20
  },
  prepareVariables: (prev) => {
    return {
      location: localStorage.geolocation
        ? JSON.parse(localStorage.geolocation)
        : null,
      count: prev.count,
      score: prev.score,
      name: window.restaurantName || null
    };
  },
  fragments: {
    restaurant: () => Relay.QL `
    fragment on Root {
      restaurants(first: $count, location: $location, name: $name) {
          edges {
            node {
              id,
              name,
              description,
              distance,
              score,
              scorable,
              location {
                coordinates,
                type
              }
              foods {
                name,
                description
                meals {
                  name,
                  description
                }
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }`
  }
})
