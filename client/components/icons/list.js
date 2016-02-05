import React from 'react';

export default class Map extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <svg className='list-icon' viewBox="0 0 500 500" height={this.props.size || "1em"} width={this.props.size || "1em"}>
        <g>
      		<path fill = {this.props.fill || 'black'} d="M36,387c-19,0-36,16-36,35s17,36,36,36s35-17,35-36S55,387,36,387z"/>
      		<path fill = {this.props.fill || 'black'} d="M36,215c-19,0-36,16-36,35s17,35,36,35s35-16,35-35S55,215,36,215z"/>
      		<path fill = {this.props.fill || 'black'} d="M164,110h303c18,0,33-14,33-32s-15-33-33-33H164c-18,0-33,15-33,33S146,110,164,110z"/>
      		<path fill = {this.props.fill || 'black'} d="M36,42C17,42,0,59,0,78s17,35,36,35s35-16,35-35S55,42,36,42z"/>
      		<path fill = {this.props.fill || 'black'} d="M467,217H164c-18,0-33,15-33,33s15,33,33,33h303c18,0,33-15,33-33S485,217,467,217z"/>
      		<path fill = {this.props.fill || 'black'} d="M467,389H164c-18,0-33,15-33,33s15,33,33,33h303c18,0,33-15,33-33S485,389,467,389z"/>
      	</g>
      </svg>
    );
  }
}
