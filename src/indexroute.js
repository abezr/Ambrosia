import Relay from 'react-relay';

export default class extends Relay.Route {
  static path = '/';
  static paramDefinitions = {
    userID: {required: true},
  };
  static queries = {
    user: (Component) => Relay.QL`
     query UserQuery{
       user(id: $userID) {
         ${Component.getFragment('user')},
       }
     }
     `
  };
  static routeName = 'HomeRoute';
}

// var HomeQueries = function (id) {
//   var userID = id;
//   return {
//     user: (Component, variables) => Relay.QL`
//     query{
//       user (id: $variables.userID) {
//         ${Component.getFragment('user')},
//       },
//     }
//   `,
// };
// };
//
// export default HomeQueries;
