import React from 'react';
import classnames from 'classnames';

var Flag = (props) => {

  return (
    <div className="widget-dropdown" onClick={props.onClick}>
      <span>{props.children}</span>
      <div className="widget-dropdown-content">
        {props.dropdown}
      </div>
    </div>
  );
};

export default Flag;
