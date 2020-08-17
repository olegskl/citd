import * as React from 'react';
import { GameStatuses } from '@citd/shared';

import { GameContext } from '../../../context/game';
import { ISocketContext, withSocket } from '../../../context/socket';
import { LobbyPlayer } from '../LobbyPlayer';

import './ObserverLobby.css';

type ObserverLobbyProps = ISocketContext & GameContext;

const ObserverLobbyComponent: React.FC<ObserverLobbyProps> = ({ socket, game }) => {
  const { players, status } = game;

  const onPlayerKick = (playerId: string) => {
    socket.emit('kickPlayerFromGame', playerId);
  };

  const startGame = () => {
    socket.emit('startGame');
  };

  const resetGame = () => {
    socket.emit('resetGame');
  };

  const renderTitle = () => {
    if (status === GameStatuses.WAITING) {
      const allPlayersReady = players.length === 2 && players.every((player) => player.readyToPlay);
      return allPlayersReady ? (
        <div className="text-glitchy-medium">We are ready to start!</div>
      ) : (
        <div className="text-glitchy-medium">Waiting for players...</div>
      );
    }
    if (status === GameStatuses.PAUSED) {
      return <div className="text-glitchy-medium">Game is paused...</div>;
    }
    if (status === GameStatuses.ENDED) {
      return <div className="text-glitchy-medium">Game has ended</div>;
    }
    return null;
  };

  const renderCallToAction = () => {
    if (status === GameStatuses.WAITING) {
      const allPlayersReady = players.length === 2 && players.every((player) => player.readyToPlay);
      const className = allPlayersReady
        ? 'button-glitchy-yellow'
        : 'button-glitchy-yellow disabled';
      return (
        <button className={className} onClick={startGame}>
          Start the game
        </button>
      );
    }
    if (status === GameStatuses.PAUSED) {
      return (
        <button className="button-glitchy-yellow" onClick={startGame}>
          Unpause the game
        </button>
      );
    }
    if (status === GameStatuses.ENDED) {
      return (
        <button className="button-glitchy-yellow" onClick={resetGame}>
          Start a new game
        </button>
      );
    }
    return null;
  };

  return (
    <div className="observer-lobby">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      {renderTitle()}
      <div className="observer-lobby-player-list">
        <LobbyPlayer player={players[0]} namePlaceholder="Player 1" onPlayerKick={onPlayerKick} />
        <LobbyPlayer player={players[1]} namePlaceholder="Player 2" onPlayerKick={onPlayerKick} />
      </div>
      {renderCallToAction()}
    </div>
  );
};

export const ObserverLobby = withSocket(React.memo(ObserverLobbyComponent));
