import * as React from 'react';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';

import './Timer.css';

type TimerProps = GameContext & ISocketContext;

type Time = {
  minutes: number;
  seconds: number;
};

const TimerComponent: React.FC<TimerProps> = ({ socket, game }) => {
  const [{ seconds, minutes }, setTime] = React.useState<Time>({
    seconds: 0,
    minutes: 0,
  });

  React.useEffect(() => {
    const setActualTime = (secondsRemaining: number) => {
      const minutes = Math.floor(secondsRemaining / 60);
      const seconds = secondsRemaining - minutes * 60;
      setTime({ minutes, seconds });
    };

    setActualTime(game.timeRemaining);
    socket.on('timeRemaining', setActualTime);

    return () => {
      socket.off('timeRemaining', setActualTime);
    };
  }, [socket, game]);

  const minutesText = minutes < 10 ? `0${minutes}` : minutes;
  const secondsText = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div className="game-timer">
      {minutesText}:{secondsText}
    </div>
  );
};

export const Timer = withSocket(withGame(React.memo(TimerComponent)));
