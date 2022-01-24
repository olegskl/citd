import * as React from 'react';

import { useGameContext } from '../../context/game';
import { useSocketContext } from '../../context/socket';
import { useChannel } from '../../hooks/useChannel';

import './Timer.css';

type Time = {
  minutes: number;
  seconds: number;
};

const TimerC = () => {
  const timeRemaining = useChannel('timeRemaining');

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining - minutes * 60;

  return (
    <div className="game-timer">
      {minutes}:{seconds}
    </div>
  );
};

const TimerComponent: React.FC = () => {
  const socket = useSocketContext();
  const game = useGameContext();

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

export const Timer = React.memo(TimerComponent);
