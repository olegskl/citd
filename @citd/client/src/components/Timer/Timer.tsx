import * as React from 'react';

import './Timer.css';

interface ITimerProps {
  active: boolean;
  secondsRemaining: number;
}

interface ITimerState {
  minutes: number;
  seconds: number;
}

export class Timer extends React.PureComponent<ITimerProps, ITimerState> {
  private intervalId: number | undefined;
  private INTERVAL = 1000;

  state = {
    seconds: 0,
    minutes: 0
  };

  componentDidMount() {
    const { active, secondsRemaining } = this.props;

    this.setTime(secondsRemaining);

    if (active) {
      this.intervalId = window.setInterval(this.tick, this.INTERVAL);
    }
  }

  componentDidUpdate(prevProps: ITimerProps) {
    const { secondsRemaining, active } = this.props;

    if (prevProps.secondsRemaining !== secondsRemaining) {
      this.setTime(secondsRemaining);
    }

    if (!prevProps.active && active) {
      this.intervalId = window.setInterval(this.tick, this.INTERVAL);
    } else if (prevProps.active && !active) {
      window.clearInterval(this.intervalId);
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.intervalId);
  }

  private setTime = (secondsRemaining: number) => {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining - minutes * 60;

    this.setState({
      minutes,
      seconds
    });
  };

  private tick = () => {
    const { minutes, seconds } = this.state;

    const updatedSeconds = seconds === 0 ? 59 : seconds - 1;
    const updatedMinutes = seconds === 0 ? minutes - 1 : minutes;

    if (updatedMinutes < 0) {
      window.clearInterval(this.intervalId);
    } else {
      this.setState({
        minutes: updatedMinutes,
        seconds: updatedSeconds
      });
    }
  };

  render() {
    const { minutes, seconds } = this.state;

    const minutesText = minutes < 10 ? `0${minutes}` : minutes;
    const secondsText = seconds < 10 ? `0${seconds}` : seconds;

    return (
      <div className='game-timer'>
        {minutesText}:{secondsText}
      </div>
    );
  }
}
