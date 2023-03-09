import { GameStatus } from '@citd/shared';
import * as React from 'react';

import { useGameContext } from '../../../context/game';
import { LobbyPlayer } from '../LobbyPlayer';

import './ObserverLobby.css';

type ObserverLobbyComponent = {
  host?: boolean;
};

const ObserverLobbyComponent: React.VFC<ObserverLobbyComponent> = ({ host }) => {
  const { game, dispatch } = useGameContext();
  const { players, status } = game;
  const allPlayersReady = players.length === 2 && players.every((player) => player.readyToPlay);

  const onPlayerKick = (userId: string) => {
    if (!host) return;
    dispatch({ type: 'kickPlayer', payload: userId });
  };

  const startGame = () => {
    if (!host || !allPlayersReady) return;
    dispatch({ type: 'start' });
  };

  const resetGame = () => {
    if (!host) return;
    dispatch({ type: 'reset' });
  };

  const renderTitle = () => {
    switch (status) {
      case GameStatus.WAITING:
        return allPlayersReady ? (
          <div className="text-glitchy-medium">We are ready to start!</div>
        ) : (
          <div className="text-glitchy-medium">Waiting for players...</div>
        );
      case GameStatus.PAUSED:
        return <div className="text-glitchy-medium">Game is paused...</div>;
      case GameStatus.ENDED:
        return <div className="text-glitchy-medium">Game has ended</div>;
      case GameStatus.PLAYING:
        return null;
    }
  };

  const renderCallToAction = () => {
    switch (status) {
      case GameStatus.WAITING: {
        const className = allPlayersReady
          ? 'button-glitchy-yellow'
          : 'button-glitchy-yellow disabled';
        return (
          <button className={className} onClick={startGame}>
            Start the game
          </button>
        );
      }
      case GameStatus.PAUSED:
        return (
          <button className="button-glitchy-yellow" onClick={startGame}>
            Unpause the game
          </button>
        );
      case GameStatus.ENDED:
        return (
          <button className="button-glitchy-yellow" onClick={resetGame}>
            Start a new game
          </button>
        );
      case GameStatus.PLAYING:
        return null;
    }
  };

  return (
    <div className="observer-lobby">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      {renderTitle()}
      <div className="observer-lobby-player-list">
        <LobbyPlayer player={players[0]} namePlaceholder="Player 1" onPlayerKick={onPlayerKick} />
        <LobbyPlayer player={players[1]} namePlaceholder="Player 2" onPlayerKick={onPlayerKick} />
      </div>
      {host && renderCallToAction()}
    </div>
  );
};

export const ObserverLobby = React.memo(ObserverLobbyComponent);
