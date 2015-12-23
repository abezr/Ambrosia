import Relay from 'react-relay';

export default class UpdateCardMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation{UpdateOrder}`;
  }

  getVariables() {
    return {
      order: this.props.order
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        order: this.props.order.id
      }
    }];
  }
  getOptimisticResponse() {
    return {
      order: {
        id: this.props.order.id,
        price: this.props.order.price,
        date: this.props.order.date,
        items: this.props.order.items,
        prepayed: this.props.order.prepayed,
        treated: this.props.order.treated,
        payed: this.props.order.payed
      }
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateOrderPayload {
      order {
        id,
        price,
        items,
        prepayed,
        payed,
        treated,
        date
      }
    }
    `;
  }
}
