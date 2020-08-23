import * as React from 'react';

import { GameContext } from '../../context/game';
import { SocketContext } from '../../context/socket';
import { UserContext } from '../../context/user';

import { GameOver } from './GameOver';
import { PlayerLobby } from './PlayerLobby';
import { Playground } from './Playground';

const PlayerPageComponent: React.FC = () => {
  const socket = React.useContext(SocketContext);
  const game = React.useContext(GameContext);
  const user = React.useContext(UserContext);

  React.useEffect(() => {
    socket.emit('joinChannel', 'players');
    socket.emit('joinGame', user.id);

    return () => {
      socket.emit('leaveChannel', 'players');
    };
  }, [socket, user.id]);

  // Waiting state:
  const isPlayerInGame = game.players.some((player) => player.id === user.id);

  if (game.status === 'waiting' || !isPlayerInGame) {
    return <PlayerLobby />;
  }
  // Ended state:
  if (game.status === 'ended') {
    return <GameOver />;
  }
  // Playing (and paused as overlay) state:
  return <Playground />;
};

export const PlayerPage = React.memo(PlayerPageComponent);
