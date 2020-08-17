import * as React from 'react';
import { GameStatuses } from '@citd/shared';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';
import { UserContext, withUser } from '../../context/user';

import { GameOver } from './GameOver';
import { PlayerLobby } from './PlayerLobby';
import { Playground } from './Playground';

type PlayerPageProps = ISocketContext & UserContext & GameContext;

const PlayerPageComponent: React.FC<PlayerPageProps> = ({ socket, user, game }) => {
  React.useEffect(() => {
    socket.emit('joinChannel', 'players');
    socket.emit('joinGame', user.id);

    return () => {
      socket.emit('leaveChannel', 'players');
    };
  }, [socket, user.id]);

  // Waiting state:
  const isPlayerInGame = game.players.some((player) => player.id === user.id);

  if (game.status === GameStatuses.WAITING || !isPlayerInGame) {
    return <PlayerLobby />;
  }
  // Ended state:
  if (game.status === GameStatuses.ENDED) {
    return <GameOver />;
  }
  // Playing (and paused as overlay) state:
  return <Playground />;
};

export const PlayerPage = withSocket(withUser(withGame(React.memo(PlayerPageComponent))));
