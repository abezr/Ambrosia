//I assume we do not need a getConfig field for this mutation
import Relay from 'react-relay';

export default class SignupMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{Signup}`;


  }
  getVariables() {
    return {
      credentials: this.props.credentials
    };
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
