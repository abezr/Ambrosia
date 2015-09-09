import React from 'react';
import Relay from 'react-relay';

class Index extends React.Component {
  render() {
    console.log('rendereeeed',this.props, this.props.name);
    return (
      <div>
      Hello World
      </div>
    );
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      name,
      id
    }
    `
  }
});
