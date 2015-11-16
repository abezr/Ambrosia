import Relay from 'react-relay';

export default class UpdateSettingsMutation extends Relay.Mutation {
  static fragments = {
    restaurant: () => Relay.QL`
      fragment on Restaurant {
        id
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{UpdateSettings}`;
  }

  getVariables() {
    return {
      restaurantID: this.props.restaurant.id,
      scorable: this.props.scorable,
      open: this.props.open,
      schedule: this.props.schedule
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
        scorable: this.props.scorable,
        open: this.props.open,
        schedule: this.props.schedule
      }
    };
  }
  getFatQuery() {
    return Relay.QL`
    fragment on UpdateSettingsPayload {
      restaurant {
        id,
        open,
        scorable,
        score,
        schedule {
          day,
          openHours {
            from,
            to
          }
        }
      }
    }
    `;
  }
}
