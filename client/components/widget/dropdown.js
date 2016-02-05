import React from 'react';
import classnames from 'classnames';
import Valid from '../icons/valid';

/**
 * A dropdown component
 * @param  {object} props  {update: function,
 *                         items: array<string>,
 *                         selected: string,
 *                         name: string
 *                         }
 *
 * @return {[type]}       [description]
 */
class DropDownButton extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {expand: false};
  }
  render() {
    return (
      <div className="widget-dropdown" onClick={(e)=> this.setState({expand: !this.state.expand})}>
        <i>{this.props.name}</i>:
        <span className="widget-dropdown-selected"> <strong>{this.props.selected}</strong></span>
        <div className={classnames('widget-dropdown-content', {hidden: !this.state.expand})}>
          {this.props.items.map(item => {
            return <div id={item} onClick={this.props.update} className={classnames('widget-dropdown-item', {selected: this.props.selected === item})}><Valid/>{item}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default DropDownButton;
