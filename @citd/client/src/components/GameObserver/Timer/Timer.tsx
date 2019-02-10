import * as React from "react";
import "./Timer.css";
import { ISocketContext, withSocket } from "../../../context/socket";

class SimpleTimer extends React.Component<ISocketContext> {
  secondsRemaining: any;
  intervalHandle: any;

  state = {
    seconds: "00",
    value: 15,
    isClicked: false
  };

  tick = () => {
    const min = Math.floor(this.secondsRemaining / 60);
    const sec = this.secondsRemaining - min * 60;

    this.setState({
      value: min,
      seconds: sec
    });

    if (sec < 10) {
      this.setState({
        seconds: "0" + this.state.seconds
      });
    }

    if (min < 10) {
      this.setState({
        value: "0" + min
      });
    }

    if (min === 0 && sec === 0) {
      clearInterval(this.intervalHandle);
    }

    this.secondsRemaining--;
  }

  startCountDown = () => {
    const { value } = this.state;

    this.intervalHandle = setInterval(this.tick, 1000);
    this.secondsRemaining = value * 60;
    this.setState({
      isClicked: true
    });
  };

  render() {
    const { value, seconds, isClicked } = this.state;

    return (
      <div className="game-timer">
        <div className="game-time">
          {value}:{seconds}
        </div>
        {!isClicked && (
          <button
            className="btn-common btn-success start-game"
            onClick={this.startCountDown}
          >
            GO!
          </button>
        )}
      </div>
    );
  }
}

export const Timer = withSocket(SimpleTimer);
