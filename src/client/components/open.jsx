import React from 'react';
import Relay from '../../relay.jsx';

var Open = React.createClass({
  register: function() {

  }
  render: function () {
    <form onSubmit={this.register}>
      <input id='name' type='text' key='input-name'/>
      <input type='submit' value='register' form='login'/>
    </form>
  }
})
