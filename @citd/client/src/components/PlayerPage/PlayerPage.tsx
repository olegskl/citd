import * as React from 'react';

import { useGameContext } from '../../context/game';
import { useSocketContext } from '../../context/socket';
import { useUserContext } from '../../context/user';

import { GameOver } from './GameOver';
import { PlayerLobby } from './PlayerLobby';
import { Playground } from './Playground';

const PlayerPageComponent: React.FC = () => {
  const socket = useSocketContext();
  const game = useGameContext();
  const user = useUserContext();

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
