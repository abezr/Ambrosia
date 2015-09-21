import React from 'react';
import Relay from 'react-relay';
import {Link} from 'react-router';
class Index extends React.Component {
  render() {
    console.log('rendereeeed',this.props);
    return (
      <div>
      <Link to={`/Login`}>Login</Link>
      Hello World
      </div>
    );
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      id
    }
    `
  }
});
