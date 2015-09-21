//I assume we do not need a getConfig field for this mutation
import Relay from 'react-relay';

export default class SignupMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{Signup}`;
  }
  //SignupMutation require name, mail and password
  getVariables() {
    return {
      name: this.props.credentials.name,
      mail: this.props.credentials.mail,
      password: this.props.credentials.password
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
        name,
        mail
      }
    }
    `;
  }
}
