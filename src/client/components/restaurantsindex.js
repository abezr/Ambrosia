import React from 'react';
import cloneWithProps from 'react-addons-clone-with-props';
import Relay from 'react-relay';
import classnames from 'classnames';
import {Link} from 'react-router';

export class RestaurantsIndexComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {search: '', loading: false};
    if(!window.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
      window.geolocation = [position.coords.longitude, position.coords.latitude];
      this.props.relay.setVariables({location: window.geolocation});
      });
    }
    window.onContentScrollEnd = () => {
      if(this.props.restaurant.restaurants.pageInfo.hasNextPage){
        this.props.relay.setVariables({count: this.props.relay.variables.count + 10}, (readyState) => {
          this.state.loading = !readyState.ready;
        });
      }
    }
  }

  _submit = () => {
    console.log('submit');
    window.restaurantName = this.refs.name.value;
    this.props.relay.forceFetch({name: this.refs.name.value}, (readyState) => {
      if(readyState.done) console.log('readyState', this.props.restaurant.restaurants.edges);
    });
  }

  _onChange = (e) => {
    this.setState({search: e.target.value});
  }

  renderChildren = () => {
    return React.Children.map(this.props.children, (child) => {
        return cloneWithProps(child, {
          restaurants: this.props.restaurant.restaurants,
          loading: this.state.loading,
          geolocation: window.geolocation || null
        });
    });
  }

  render() {
    console.log('render', this.props.restaurant.restaurants.edges);
    return (
      <div className = 'restaurants-index'>
        <nav className= 'nav flex-center'>
          <Link to= '/restaurants/map' className= {classnames('flex-item-2', {selected: (this.props.location.pathname.search('map') !== -1)})}>Map</Link>
          <Link to= '/restaurants/list' className= {classnames('flex-item-2', {selected: (this.props.location.pathname.search('list') !== -1)})}>List</Link>
        </nav>
        <nav className='nav'>
          <div className='search-container'>
            <input type='text' ref='name' className='search-input' value={this.state.search} onChange={this._onChange}/>
            <span className='search-icon' onClick={this._submit}/>
          </div>
        </nav>
        {this.renderChildren()}
      </div>
    )
  }
}

export default Relay.createContainer(RestaurantsIndexComponent, {
  initialVariables: {
    location: window.geolocation || null,
    name: window.restaurantName || null,
    count: 20
  },
  prepareVariables: (prev) => {
    return {location: window.geolocation || null, count: prev.count, name: window.restaurantName || null};
  },
  fragments: {
    restaurant: () => Relay.QL`
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
