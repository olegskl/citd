import * as React from 'react';

import { useGameContext } from '../../context/game';
import { useSocketContext } from '../../context/socket';

import { ObserverControls } from './ObserverControls';
import { ObserverLobby } from './ObserverLobby';
import { Preview } from './Preview';
import { Viewer } from './Viewer';

import './ObserverPage.css';

const ObserverPageComponent: React.FC = () => {
  const socket = useSocketContext();
  const game = useGameContext();

  React.useEffect(() => {
    socket.emit('joinChannel', 'observers');

    return () => {
      socket.emit('leaveChannel', 'observers');
    };
  }, [socket]);

  if (game.status === 'playing' || game.status === 'paused' || game.status === 'ended') {
    return (
      <div className="viewer-list">
        <Viewer player={game.players[0]} />
        <Preview />
        <Viewer player={game.players[1]} />
        <ObserverControls game={game} />
      </div>
    );
  }

  return <ObserverLobby game={game} />;
};

export const ObserverPage = React.memo(ObserverPageComponent);
