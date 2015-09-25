import Relay from 'react-relay';

export default class SignupMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        mail
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{Signup}`;
  }
  //SignupMutation require mail and password
  getVariables() {
    return {
      mail: this.props.credentials.mail,
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
      name: this.props.credentials.name,
      mail: this.props.credentials.mail,
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on SignupPayload {
      user {
        id,
        mail
      }
    }
    `;
  }
}
