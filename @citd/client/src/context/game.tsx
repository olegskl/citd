import { Game } from '@citd/shared';
import * as React from 'react';

import { useSocketContext } from './socket';

const GameContext = React.createContext<Game | undefined>(undefined);

export type GameContextType = {
  game: Game;
};

export const GameProvider: React.FC = ({ children }) => {
  const socket = useSocketContext();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [game, setGame] = React.useState<Game>();

  const onGame = (game: Game) => {
    setGame(game);
    setLoading(false);
  };

  React.useEffect(() => {
    socket.on('game', onGame);
    socket.emit('getGame');

    return () => {
      socket.off('game', onGame);
    };
  }, [socket]);

  // Loading state:
  if (loading || !game) {
    return <span>Fetching game...</span>;
  }

  // User is available:
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const useGameContext = (): Game => {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export function withGame<T extends GameContextType>(
  Component: React.ComponentType<T>,
): React.FC<Pick<T, Exclude<keyof T, 'game'>>> {
  return function WrappedComponent(props) {
    return (
      <GameContext.Consumer>
        {(game) => <Component {...(props as T)} game={game} />}
      </GameContext.Consumer>
    );
  };
}
