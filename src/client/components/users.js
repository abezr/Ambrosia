import React from 'react';
import Relay from 'react-relay';

class Users extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    console.log(this.props);
    var createUser = function (user) {
      console.log(user);
      return (
            <div>
              {user.node.mail}
              {user.node.name}
              {user.node.friends}
              {user.node.id}
            </div>
          );
    };
    return (
      <div>
        <h1>List of all users</h1>
        <div>{this.props.user.friends.edges.map(createUser)}</div>
      </div>
    );
  }
}

export default Relay.createContainer(Users, {
  fragments: {
    user: () => Relay.QL`
    fragment on User {
      friends(first: 900000) {
        edges {
          node {
            id,
            name,
            mail
          }
        }
      }
    }
    `
  }
});
