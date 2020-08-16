import { Game } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from './socket';

const GameContext = React.createContext<Game | undefined>(undefined);

export type GameContext = {
  game: Game;
};

const GameProviderComponent: React.FC<ISocketContext> = ({ socket, children }) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [game, setGame] = React.useState<Game>();

  const onGame = (game: Game) => {
    setLoading(false);
    setGame(game);
  };

  React.useEffect(() => {
    socket.on('game', onGame);
    socket.emit('getGame');

    return () => {
      socket.off('game', onGame);
    };
  }, [socket]);

  // Loading state:
  if (loading) {
    return <span>Fetching game...</span>;
  }

  // User is available:
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export const GameProvider = withSocket(GameProviderComponent);

export function withGame<T extends GameContext>(
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
