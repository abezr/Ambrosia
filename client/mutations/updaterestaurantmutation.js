import Relay from 'react-relay';

export default class UpdateRestaurantMutation extends Relay.Mutation {

  getMutation() {
    return Relay.QL`mutation{UpdateRestaurant}`;
  }

  getVariables() {
    return {
      restaurant: this.props.restaurant
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
        name: this.props.restaurant.name,
        description: this.props.restaurant.description,
        busy: this.props.restaurant.busy,
        scorable: this.props.restaurant.scorable,
        open: this.props.restaurant.open,
        schedule: this.props.restaurant.schedule,
        orders: this.props.restaurant.orders,
        foods: this.props.restaurant.foods
      }
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateRestaurantPayload {
      restaurant {
        id,
        name,
        description,
        scorable,
        reviews {
          averageScore,
          comments
        },
        busy,
        open,
        schedule {
          day,
          openHours {
            from,
            to
          }
        }
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
