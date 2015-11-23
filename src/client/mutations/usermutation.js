import Relay from 'react-relay';

export default class UserMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        userID
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{User}`;
  }

  getVariables() {
    return {
      id: this.props.user.id,
      userID: this.props.user.userID,
      name: this.props.update.name,
      mail: this.props.update.mail,
      profilePicture: this.props.update.profilePicture
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
      user: {
        id: this.props.user.id,
        name: this.props.update.name || this.props.user.name || '',
        mail: this.props.update.name || this.props.user.name,
        profilePicture: this.props.update.profilePicture || this.props.user.profilePicture || null
      }
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UserMutationPayload {
      user {
        id,
        userID,
        name,
        mail,
        profilePicture
      }
    }
    `;
  }
}
