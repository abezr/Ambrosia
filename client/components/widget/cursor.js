import React from 'react';

export default class Cursor extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <svg id={this.props.id} height={this.props.size || '1em'} className='cursor' viewBox="0 0 40 20" onClick={this.props.update}>
        <rect x='0' y='0' rx='10' ry='10' width='40' height='20' fill={this.props.on ? 'rgb(42, 195, 4)' : 'rgb(238, 17, 17)'}/>
        <circle cx={this.props.on ? '10' : '30'} cy='10' r='9' fill='black'/>
      </svg>
    );
  }
}
