import React from 'react';
import Flag from './flag';

var Heart = (props) => {
  return (
  <svg className= {"heart " + props.className} onClick={(e)=> props.onClick(e, props.i)} fill='rgba(255, 255, 255, 0)' stroke='black' x={props.x} y='0' viewBox="0 0 23.217 23.217" width='100' height='100'>
    <path d="M11.608,21.997c-22.647-12.354-6.268-27.713,0-17.369C17.877-5.716,34.257,9.643,11.608,21.997z"/>
  </svg>
  );
};

var Hearts = (props) => {
  var hearts = [];
  for (var i = 0; i < 5; i++) {
    hearts.push(<Heart x={400 - i*100} className = {props.rate === 5-i ? 'rated' : ''} i={5-i} onClick={props.onClick} stroke={props.stroke || 'black'} stroke-width={props.strokeWidth || '10'}/>);
  }
  if(props.rate) {
    return  (
      <svg className={"widget-hearts" + (props.rate ? "-rated" : "")} viewBox="0 0 500 100" height={props.size}>
        {hearts}
      </svg>
    );
  } else {
    return (
      <svg className={"widget-hearts"} viewBox="0 0 500 100" height={props.size}>
        {hearts}
      </svg>
    );
  }
};

export default Hearts;
