/**
 * @flow
 */
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
  getMutation(): any {
    return Relay.QL`mutation{Login}`;
  }

  getVariables(): any {
    return {
      mail: this.props.credentials.pseudo,
      password: this.props.credentials.password,
      id: this.props.user.id
    };
  }
  getConfigs(): any {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: this.props.user.id,
      }
    }];
  }
  getOptimisticResponse(): any {
    return {
      mail: this.props.credentials.pseudo,
      id: this.props.user.id
    };
  }
  getFatQuery(): any {
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
