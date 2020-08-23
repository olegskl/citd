import * as React from 'react';

import { GameContextType } from '../../../context/game';
import { useSocketContext } from '../../../context/socket';
import { LobbyPlayer } from '../LobbyPlayer';

import './ObserverLobby.css';

const ObserverLobbyComponent: React.FC<GameContextType> = ({ game }) => {
  const socket = useSocketContext();
  const { players, status } = game;
  const allPlayersReady = players.length === 2 && players.every((player) => player.readyToPlay);

  const onPlayerKick = (playerId: string) => {
    socket.emit('kickPlayerFromGame', playerId);
  };

  const startGame = () => {
    if (allPlayersReady) {
      socket.emit('startGame');
    }
  };

  const resetGame = () => {
    socket.emit('resetGame');
  };

  const renderTitle = () => {
    if (status === 'waiting') {
      return allPlayersReady ? (
        <div className="text-glitchy-medium">We are ready to start!</div>
      ) : (
        <div className="text-glitchy-medium">Waiting for players...</div>
      );
    }
    if (status === 'paused') {
      return <div className="text-glitchy-medium">Game is paused...</div>;
    }
    if (status === 'ended') {
      return <div className="text-glitchy-medium">Game has ended</div>;
    }
    return null;
  };

  const renderCallToAction = () => {
    if (status === 'waiting') {
      const className = allPlayersReady
        ? 'button-glitchy-yellow'
        : 'button-glitchy-yellow disabled';
      return (
        <button className={className} onClick={startGame}>
          Start the game
        </button>
      );
    }
    if (status === 'paused') {
      return (
        <button className="button-glitchy-yellow" onClick={startGame}>
          Unpause the game
        </button>
      );
    }
    if (status === 'ended') {
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

export const ObserverLobby = React.memo(ObserverLobbyComponent);
