import React from 'react';

export default class Close extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <svg className='close-icon' viewBox='0 0 80 80' height={this.props.size || '1em'} width={this.props.size || '1em'}>
        <path d='M10 10 L70 70' stroke={this.props.stroke || 'black'} strokeWidth={this.props.strokeWidth || 3} />
        <path d='M70 10 L10 70' stroke={this.props.stroke || 'black'} strokeWidth={this.props.strokeWidth || 3} />
      </svg>
    );
  }
}
