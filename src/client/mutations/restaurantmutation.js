import Relay from 'react-relay';

export default class RestaurantMutation extends Relay.Mutation {
  static fragments = {
    user: () => Relay.QL`
      fragment on User {
        id,
        userID,
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{Restaurant}`;
  }

  getVariables() {
    return {
      restaurant: this.props.restaurant,
      userID: this.props.user.userID
    };
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.user.id
        }
      },
      {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'restaurants',
      edgeName: 'restaurantEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];
  }
  getOptimisticResponse() {
    const {user} = this.props;
    return {
      user: {
        id: user.id,
      },
      restaurantEdge: user.restaurant
    };
  }
  //Note Relay will throw back restaurants and restaurantEdge only if you need it meaning if you only ask for first 4 restaurants and relay got them in memory, restaurants and restaurantsedge payload will be missing
  getFatQuery() {
    return Relay.QL`
    fragment on RestaurantPayload {
      restaurantEdge {
        node,
        cursor
      }
      user {
        id,
        restaurants
      }
    }
    `;
  }
}
