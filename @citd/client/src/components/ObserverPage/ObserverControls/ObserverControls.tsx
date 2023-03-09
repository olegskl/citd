import { GameStatus } from '@citd/shared';
import * as React from 'react';
import { useGameContext } from '../../../context/game';

import './ObserverControls.css';

const ObserverControlsComponent: React.VFC = () => {
  const { game, dispatch } = useGameContext();
  const [areControlsDisplayed, setControlsDisplayed] = React.useState<boolean>(false);

  React.useEffect(() => {
    const toggleControlsOnEsc = (event: KeyboardEvent) => {
      if (event.which === 27) {
        setControlsDisplayed(!areControlsDisplayed);
      }
    };

    window.addEventListener('keydown', toggleControlsOnEsc);

    return () => {
      window.removeEventListener('keydown', toggleControlsOnEsc);
    };
  }, [areControlsDisplayed]);

  const pauseGame = () => {
    dispatch({ type: 'pause' });
  };

  const startGame = () => {
    dispatch({ type: 'start' });
  };

  const resetGame = () => {
    dispatch({ type: 'reset' });
  };

  const renderTitle = () => {
    switch (game.status) {
      case GameStatus.PLAYING:
        return <div className="text-glitchy-medium">Time is running out!</div>;
      case GameStatus.PAUSED:
        return <div className="text-glitchy-medium">Game is paused...</div>;
      case GameStatus.ENDED:
        return <div className="text-glitchy-medium">Game has ended</div>;
      case GameStatus.WAITING:
        return null;
    }
  };

  if (!areControlsDisplayed) {
    return null;
  }

  return (
    <div className="observer-controls">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      {renderTitle()}
      {game.status === GameStatus.PLAYING && (
        <button className="button-glitchy-yellow" onClick={pauseGame}>
          Pause the game
        </button>
      )}
      {game.status === GameStatus.PAUSED && (
        <button className="button-glitchy-yellow" onClick={startGame}>
          Unpause the game
        </button>
      )}
      <button className="button-glitchy-yellow" onClick={resetGame}>
        Reset the game
      </button>
    </div>
  );
};

export const ObserverControls = React.memo(ObserverControlsComponent);
