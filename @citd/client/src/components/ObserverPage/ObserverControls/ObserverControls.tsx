import * as React from 'react';

import { GameContext } from '../../../context/game';
import { ISocketContext, withSocket } from '../../../context/socket';

import './ObserverControls.css';

type ObserverLobbyProps = ISocketContext & GameContext;

const ObserverControlsComponent: React.FC<ObserverLobbyProps> = ({ socket, game }) => {
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
    socket.emit('pauseGame');
  };

  const startGame = () => {
    socket.emit('startGame');
  };

  const resetGame = () => {
    socket.emit('resetGame');
  };

  const renderTitle = () => {
    if (game.status === 'playing') {
      return <div className="text-glitchy-medium">Time is running out!</div>;
    }
    if (game.status === 'paused') {
      return <div className="text-glitchy-medium">Game is paused...</div>;
    }
    if (game.status === 'ended') {
      return <div className="text-glitchy-medium">Game has ended</div>;
    }

    return null;
  };

  if (!areControlsDisplayed) {
    return null;
  }

  return (
    <div className="observer-controls">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      {renderTitle()}
      {game.status === 'playing' && (
        <button className="button-glitchy-yellow" onClick={pauseGame}>
          Pause the game
        </button>
      )}
      {game.status === 'paused' && (
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

export const ObserverControls = withSocket(React.memo(ObserverControlsComponent));
