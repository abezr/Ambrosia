import Relay from 'react-relay';

export default class OrderMutation extends Relay.Mutation {
  static fragments = {
    restaurant: () => Relay.QL `
      fragment on Restaurant {
        id
      }
    `,
    user: () => Relay.QL `
      fragment on User {
        id,
        userID
      }
    `
  };
  getMutation() {
    return Relay.QL `mutation{Order}`;
  }
  getVariables() {
      console.log(this.props.order);
      return {
        order: this.props.order,
        restaurantID: this.props.restaurant.id,
        userID: this.props.user.userID
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
      parentID: this.props.restaurant.id,
      connectionName: 'orders',
      edgeName: 'orderRestaurantEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }, {
      type: 'RANGE_ADD',
      parentName: 'user',
      parentID: this.props.user.id,
      connectionName: 'orders',
      edgeName: 'orderUserEdge',
      rangeBehaviors: {
        '': 'append'
      }
    }];
  }
  getOptimisticResponse() {
    const {order, restaurant, user} = this.props;
    return {
      orderRestaurantEdge: {
        node: {
          order
        }
      },
      restaurant: {
        id: restaurant.id
      },
      orderUserEdge: {
        node: {
          order
        }
      },
      user: {
        id: user.id
      }
    };
  }

}
