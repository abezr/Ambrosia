import React from 'react';

var Plus = (props) => {
  return (
    <svg className='icon-plus' viewBox='0 0 80 80' onClick={props.onClick} height={props.size || '1em'} width={props.size || '1em'}>
      <path d='M40 10 L40 70' stroke={props.stroke || 'black'} strokeWidth={props.strokeWidth || 3} />
      <path d='M10 40 L70 40' stroke={props.stroke || 'black'} strokeWidth={props.strokeWidth || 3} />
    </svg>
  );
};

export default Plus;
