import * as React from 'react';
import { GameStatuses } from '@citd/shared';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';

import { ObserverControls } from './ObserverControls';
import { ObserverLobby } from './ObserverLobby';
import { Preview } from './Preview';
import { Viewer } from './Viewer';

import './ObserverPage.css';

type ObserverPageProps = ISocketContext & GameContext;

const ObserverPageComponent: React.FC<ObserverPageProps> = ({ socket, game }) => {
  React.useEffect(() => {
    socket.emit('joinChannel', 'observers');

    return () => {
      socket.emit('leaveChannel', 'observers');
    };
  }, [socket]);

  if (
    game.status === GameStatuses.PLAYING ||
    game.status === GameStatuses.PAUSED ||
    game.status === GameStatuses.ENDED
  ) {
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

export const ObserverPage = withSocket(withGame(React.memo(ObserverPageComponent)));
