import * as React from 'react';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';

import './Timer.css';

type TimerProps = GameContext & ISocketContext;

interface TimerState {
  minutes: number;
  seconds: number;
}

class TimerComponent extends React.PureComponent<TimerProps, TimerState> {
  state: TimerState = {
    seconds: 0,
    minutes: 0,
  };

  componentDidMount() {
    this.setTime(this.props.game.timeRemaining);
    this.props.socket.on('timeRemaining', this.setTime);
  }

  componentWillUnmount() {
    this.props.socket.off('timeRemaining', this.setTime);
  }

  private setTime = (secondsRemaining: number) => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining - minutes * 60;
    this.setState({ minutes, seconds });
  };

  render() {
    const { minutes, seconds } = this.state;

    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    const secondsText = seconds < 10 ? `0${seconds}` : seconds;

    return (
      <div className="game-timer">
        {minutesText}:{secondsText}
      </div>
    );
  }
}

export const Timer = withSocket(withGame(TimerComponent));
