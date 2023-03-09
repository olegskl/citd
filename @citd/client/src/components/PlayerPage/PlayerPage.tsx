import { GameStatus } from '@citd/shared';
import * as React from 'react';

import { useGameContext } from '../../context/game';

import { GameOver } from './GameOver';
import { GameLobby } from './GameLobby';
import { Playground } from './Playground';

// Game Lobby
const PlayerPageComponent: React.VFC = () => {
  const { game } = useGameContext();

  switch (game.status) {
    case GameStatus.WAITING:
      return <GameLobby />;
    case GameStatus.PLAYING:
    case GameStatus.PAUSED:
      return <Playground />;
    case GameStatus.ENDED:
      return <GameOver />;
  }
};

export const PlayerPage = React.memo(PlayerPageComponent);
