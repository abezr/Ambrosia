import React from 'react';

export default class Score extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <svg className='score-icon' viewBox="0 0 50 5" height={this.props.size/10||'1em'} width={this.props.size || "10em"}>
      <g>
        <rect x='0' y='0' rx='2.5' ry='2.5' width='50' height='5' fill = 'red'/>
      	<path style={{'stroke-linecap': 'round'}} stroke='green' strokeWidth='5' d={`M0,2.5 H${this.props.score * 10}`}/>
      </g>
      </svg>
    );
  }
}
