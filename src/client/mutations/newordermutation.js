import Relay from 'react-relay';

export default class OrderMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL `mutation{Order}`;
  }
  getVariables() {
      return {
        order: this.props.order
      };
    }
    //remember that the fat query return only allready used field
    //what do we need from the mutation...??
    //ToFind there is a bug when orders have been called by relay allready...
    //try by returning the whole restaurant objecct with his orders
  getFatQuery() {
    return Relay.QL `
      fragment on OrderPayload {
        restaurant {
          orders
        }
        user {
          orders
        }
        orderRestaurantEdge
        orderUserEdge
      }`;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'restaurant',
      parentID: this.props.order.restaurantID,
      connectionName: 'orders',
      edgeName: 'orderRestaurantEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.order.userID,
      connectionName: 'orders',
      edgeName: 'orderUserEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];
  }
  getOptimisticResponse() {
    const {order} = this.props;
    return {
      orderRestaurantEdge: {
        node: {
          order
        }
      },
      restaurant: {
        id: order.restaurantID
      },
      orderUserEdge: {
        node: {
          order
        }
      },
      user: {
        id: order.userID
      }
    };
  }

}
