import * as React from 'react';

import { useGameContext } from '../../context/game';

import './Timer.css';

const TimerComponent: React.VFC = () => {
  const { game } = useGameContext();

  const minutes = Math.floor(game.timeRemaining / 60);
  const seconds = game.timeRemaining - minutes * 60;
  const minutesText = minutes.toString().padStart(2, '0');
  const secondsText = seconds.toString().padStart(2, '0');

  return (
    <div className="game-timer">
      {minutesText}:{secondsText}
    </div>
  );
};

export const Timer = React.memo(TimerComponent);
