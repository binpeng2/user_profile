import React, { Component } from 'react';
import './countdown.css'
/**
 * Note :
 * If you're using react v 15.4 or less
 * You can directly import PropTypes from react instead.
 * Refer to this : https://reactjs.org/warnings/dont-call-proptypes.html
 */

class Countdown extends Component {
  constructor(props) {
    super(props);
    let diff = (this.props.date - Date.now())/ 100;
    let sec = Math.floor(diff/10);
    let microsec = Math.floor(diff%10);

    this.state = {
      sec: sec,
      microsec:microsec
    }


  }

  componentDidMount() {
    // update every second
      this.interval = setInterval(() => {
      const date = this.calculateCountdown(this.props.date);
      date ? this.setState(date) : this.stop();
      }, 100);

  }

  componentWillUnmount() {
    this.stop();
  }

  calculateCountdown(endDate) {

    if(isNaN(endDate)){
      endDate = 0
    }

    let diff =  (endDate - Date.now())/ 100;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      sec: 0,
      microsec:0
    };


    timeLeft.sec = Math.floor(diff/10);
    timeLeft.microsec = Math.floor(diff%10);
    return timeLeft;
  }

  stop() {
    clearInterval(this.interval);
  }

  addLeadingZeros(value) {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  render() {

    const countDown = this.state;

    return (
      <div className="Countdown">

        <span className="Countdown-col-2">
          <span className="Countdown-col-element-2">
            <strong>{this.addLeadingZeros(countDown.sec)} .</strong>
          </span>
        </span>

        <span className="Countdown-col">
          <span className="Countdown-col-element-2">
            <strong>{countDown.microsec} s</strong>
          </span>
        </span>
      </div>
    );
  }
}



Countdown.defaultProps = {
  date: new Date()
};

export default Countdown;
