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
    console.log(this.props.order);
    return {
      order: this.props.order,
      restaurantID: this.props.restaurant.id,
      userID: this.props.user.id
    };
  }
  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'restaurant',
        parentID: this.props.restaurant.id,
        connectionName: 'orders',
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
      orderEdge {
        node,
        cursor
      }
    }`;
  }
}
