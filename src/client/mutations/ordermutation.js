import Relay from 'react-relay';

export default class OrderMutation extends Relay.Mutation {
  static fragments = {
    restaurant: () => Relay.QL`
      fragment on Restaurant {
        id
      }
    `,
    user: () => Relay.QL`
      fragment on User {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`mutation{Order}`;
  }
  getVariables() {
    return {
      userID: this.props.user.id,
      restaurantID: this.props.restaurant.id,
      order: this.props.order
    }
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          restaurant: this.props.restaurant.id
        }
      },
      {
        type: 'RANGE_ADD',
        parentName: 'restaurant',
        parentID: this.props.restaurant.id,
        connectionNAme: 'orders',
        edgeName: 'orderEdge',
        rangeBehaviors: {
          '': 'append'
        }
      }
    ];
  }
  getOptimisticResponse() {
    return {
      order: this.props.order
    };
  }
  //remember that the fat query return only allready used field
  //what do we need from the mutation...??
  getFatQuery() {
    return Relay.QL`
    fragment on OrderPayload {

    }`;
  }
}
