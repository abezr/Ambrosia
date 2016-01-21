import React from 'react';

export default function Display(props) {
  var rectangles = (number, i) => {
      return (
        <g>
          <rect x={i * 100/props.array.length} y={0} stroke='black' width = {80 / props.array.length} height= '20'/>
          <rect x={i * 100/props.array.length} y={25} stroke='black' width = {80 / props.array.length} height= '20'/>
          <rect x={i * 100/props.array.length} y={50} stroke='black' width = {80 / props.array.length} height= '20'/>
          <rect x={i * 100/props.array.length} y={75} stroke='black' width = {80 / props.array.length} height= '20'/>
        </g>
      );
  };
  return (
    <svg className='icon-display' viewBox='0 0 100 100' onClick={(e)=>props.onClick(e, props.array)} height={props.size || '1em'} fill='none' width={props.size || '1em'}>
      {props.array.map(rectangles)}
    </svg>
  );

}
