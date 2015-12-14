import React from 'react';

export default class Loading extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <svg className='loading-icon' viewBox="0 0 500 500" height={this.props.size || "1em"} width={this.props.size || "1em"}>
      <g>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M250,0c14,0,24,10,24,24v94c0,14-10,25-24,25s-25-11-25-25V24C225,10,236,0,250,0z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M137,53l55,76c12,16,0,39-20,39c-8,0-14-3-19-10L98,82c-8-11-6-26,5-34S129,42,137,53z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M28,204c-13-4-20-18-16-31s18-20,31-16l89,29c13,4,20,18,16,31c-3,10-14,17-24,17c-3,0-4-1-7-2 L28,204z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M148,283c4,13-3,27-16,31l-89,29c-3,1-5,1-8,1c-10,0-20-7-23-17c-4-13,3-27,16-31l89-29 C130,263,144,270,148,283z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M187,337c11,8,13,23,5,34l-55,76c-5,7-12,10-20,10c-20,0-31-23-19-39l55-76C161,331,176,329,187,337 z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M250,357c14,0,24,11,24,25v93c0,14-10,25-24,25s-25-11-25-25v-93C225,368,236,357,250,357z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M347,342l55,76c12,16,0,39-20,39c-8,0-14-3-19-10l-55-76c-8-11-6-26,5-34S339,331,347,342z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M472,296c13,4,20,18,16,31c-3,10-14,17-24,17c-3,0-4,0-7-1l-89-29c-13-4-20-18-16-31s18-20,31-16 L472,296z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M352,217c-4-13,3-27,16-31l89-29c13-4,27,3,31,16s-3,27-16,31l-89,28c-3,1-5,2-8,2 C365,234,355,227,352,217z"/>
      	<path fill = {this.props.fill || 'black'} stroke={this.props.stroke || 'black'} d="M327,168c-20,0-31-23-19-39l55-76c8-11,23-13,34-5s13,23,5,34l-55,76C342,165,335,168,327,168z"/>
      </g>
      </svg>
    );
  }
}