//I assume we do not need a getConfig field for this mutation

export default class SignupMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{signup}`;
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
    }
  }
  getFatQuery() {
    return Relay.QL`
    fragment on signupPayload {
      name,
      mail,
      id
    }
    `;
  }
}
