import * as React from 'react';

import { useGameContext } from '../../context/game';

import { ObserverControls } from './ObserverControls';
import { ObserverLobby } from './ObserverLobby';
import { Preview } from './Preview';
import { GameStatus } from '@citd/shared';
import { Viewer } from './Viewer';

import './ObserverPage.css';

type ObserverPageComponentProps = {
  host?: boolean;
};

const ObserverPageComponent: React.VFC<ObserverPageComponentProps> = ({ host }) => {
  const { game } = useGameContext();

  switch (game.status) {
    case GameStatus.PLAYING:
    case GameStatus.PAUSED:
    case GameStatus.ENDED:
      return (
        <div className="viewer-list">
          <Viewer
            player={game.players[0]}
            operations={game.operations
              .filter(({ userId }) => !userId || userId === game.players[0].id)
              .map(({ operation }) => operation)}
          />
          <Preview taskId={game.taskId} />
          <Viewer
            player={game.players[1]}
            operations={game.operations
              .filter(({ userId }) => !userId || userId === game.players[1].id)
              .map(({ operation }) => operation)}
          />
          {host && <ObserverControls />}
        </div>
      );
    case GameStatus.WAITING:
      return <ObserverLobby host={host} />;
  }
};

export const ObserverPage = React.memo(ObserverPageComponent);
