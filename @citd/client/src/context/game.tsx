import { Action, DistributiveOmit, Game, Player, createInitialGame, reducer } from '@citd/shared';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { useSocket } from './socket';

const GameContext = React.createContext<GameContextType | undefined>(undefined);

export type GameContextType = {
  game: Game;
  dispatch: React.Dispatch<DistributiveOmit<Action, 'userId'>>;
  playerId: string;
  player?: Player;
};

const playerId =
  window.sessionStorage.getItem('citd-user-id') ||
  Date.now().toString(36) + Math.random().toString(36).slice(2);
window.sessionStorage.setItem('citd-user-id', playerId);

export const GameProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [game, dispatch] = React.useReducer(reducer, createInitialGame());
  const messageHandler = React.useCallback(
    (actions: Action | Action[]) => {
      if (Array.isArray(actions)) {
        ReactDOM.unstable_batchedUpdates(() => {
          actions.forEach((action) => {
            dispatch(action);
          });
        });
      } else {
        dispatch(actions);
      }
    },
    [dispatch],
  );

  const socket = useSocket<Action | Action[]>('/ws/game', messageHandler);
  const contextDispatch = React.useCallback(
    (action: DistributiveOmit<Action, 'userId'>) =>
      socket?.send(JSON.stringify({ ...action, userId: playerId })),
    [socket],
  );
  const context = React.useMemo(
    () => ({
      game,
      dispatch: contextDispatch,
      playerId,
      player: game.players.find((player) => player.id === playerId),
    }),
    [game, contextDispatch],
  );

  if (!socket) return <>Connecting...</>;
  if (!context) return <>Loading game...</>;

  // User is available:
  return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export const useGameContext = (): GameContextType => {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
