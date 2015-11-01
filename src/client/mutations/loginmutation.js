import Relay from 'react-relay';

export default class LoginMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        mail
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{Login}`;
  }

  getVariables() {
    return {
      mail: this.props.credentials.pseudo,
      password: this.props.credentials.password,
      id: this.props.user.id
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getOptimisticResponse() {
    return {
      mail: this.props.credentials.pseudo,
      id: this.props.user.id
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on LoginPayload {
      user {
        userID,
        profilePicture,
        mail,
        name,
        restaurants,
        orders
      }
    }
    `;
  }
}
