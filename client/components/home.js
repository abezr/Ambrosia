import React from 'react';

import Play from './icons/play';

var transitionTime = 500;

export default class Home extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {index: 0};
    this.transition = false;
  }

  _endTransition = () => {
    setTimeout(()=>this.transition = false, transitionTime);
  };

  _playTimeline = () => {
    console.log('playTimeline', this.refs.timeline);
    this.refs.timeline.play();
  };

  _onWheel = (e) => {
    e.preventDefault();
    if(this.transition || (e.deltaY < 10 && e.deltaY > -10)) return;
    this._endTransition();
    this.transition = true;
    e.deltaY > 0 ? this.state.index++ : this.state.index <=0 ? 0 : this.state.index--;
    this.setState({index: this.state.index});
  };
  render () {
    return (
      <div className='home' onWheel={this._onWheel}>
        <div className='home-cursor-list'>
          <div className={'home-cursor' + (this.state.index === 0 ? ' selected' : '')}/>
          <div className={'home-cursor' + (this.state.index === 1 ? ' selected' : '')}/>
          <div className={'home-cursor' + (this.state.index === 2 ? ' selected' : '')}/>
        </div>
        <div className={'home-description' + (this.state.index > 0 ? ' before' : '')}>
          <div className='home-description-wrapper'>
            <h1>Enjoy food in a brand new Way</h1>
            <p>Ambrosia use the last pieces of financial and web technologies and change
             the way professionals and customers interact with each other, your meals won't ever
              taste the same. version 4
            </p>
            <div className='enjoy'>Enjoy as</div>
            <span className='customer'>Customer</span>
            <span className='chief'>Chief</span>
          </div>
        </div>
        <div className={'home-professional' + (this.state.index === 1 ? '' : this.state.index > 1 ? ' before' : ' after')}>
          <span className='left-cursor'/>
          <span className='right-cursor'/>
          <div className='home-professional-wrapper'>
            <div className='picture-timeline selected'>
              <Play size='2em' onClick={this._playTimeline}/>
              <video ref='timeline' width="100%" height="100%" onClick={this._playTimeline}>
                <source src="/stylesheets/videos/timeline.mp4" type="video/mp4"/>
              </video>
              <p>
                The timeline let you track your order:
                - Scroll the timeline to go back and forth through the day.
                - Manage order status, payed or unpayed, treated or not.
                - see only what you need.
                - tell your customer how busy you are.
              </p>
            </div>
            <div className='picture-details'>
              <p>
                Update your Restaurant details in real time:
                - give your opening hours on a week basis.
                - see how customers appreciate your food.
              </p>
            </div>
            <div className='picture-card'>
              <p>
                Manage your card on live:
                - Add or remove recipes as you want.
                - Adjust price and meals-pictures.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
