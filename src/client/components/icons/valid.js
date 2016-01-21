import React from 'react';

export default function Valid(props) {
  return (
    <svg className='icon-valid' viewBox='0 0 80 80' onClick={props.onClick} height={props.size || '1em'} fill='none' width={props.size || '1em'}>
      <path d='M20 30 L40 70 L70 10' stroke={props.stroke || 'black'} strokeWidth={props.strokeWidth || 8} strokeLineJoin='round' strokeLinecap='round'/>
    </svg>
  );
}
