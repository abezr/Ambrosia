import Relay from 'react-relay';

export default class UpdateCardMutation extends Relay.Mutation {
  static fragments = {
    restaurant: () => Relay.QL`
      fragment on Restaurant {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{UpdateCard}`;
  }

  getVariables() {
    return {
      restaurantID: this.props.restaurant.id,
      card: this.props.card
    };
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        restaurant: this.props.restaurant.id,
      }
    }];
  }
  getOptimisticResponse() {
    return {
      restaurant: {
        id: this.props.restaurant.id,
        name: this.props.card.name,
        description: this.props.card.description,
        foods: this.props.card.foods
      }
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateCardPayload {
      restaurant {
        id,
        name,
        description,
        foods {
          id,
          name,
          description,
          meals {
            id,
            name,
            description,
            price,
            time
          }
        }
      }
    }
    `;
  }
}
