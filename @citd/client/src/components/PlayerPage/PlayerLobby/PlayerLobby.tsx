import * as React from 'react';

import { GameContext } from '../../../context/game';
import { SocketContext } from '../../../context/socket';
import { UserContext } from '../../../context/user';

import './PlayerLobby.css';

const PlayerLobbyComponent: React.FC = () => {
  const socket = React.useContext(SocketContext);
  const game = React.useContext(GameContext);
  const user = React.useContext(UserContext);

  const onJoinGame = () => {
    socket.emit('joinGame', user.id);
  };

  // const onLeaveGame = () => {
  //   socket.emit('leaveGame', user.id);
  // };

  const onReady = () => {
    socket.emit('readyToPlay', user.id, true);
  };

  const onNotReady = () => {
    socket.emit('readyToPlay', user.id, false);
  };

  const userInGame = game.players.find(({ id }) => id === user.id);
  const isReadyToPlay = userInGame && userInGame.readyToPlay;

  return (
    <div className="player-lobby">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      {userInGame ? (
        <>
          <div className="text-glitchy-medium">Are you ready?</div>
          {isReadyToPlay ? (
            <button className="button-glitchy-yellow" onClick={onNotReady}>
              I&apos;m not ready
            </button>
          ) : (
            <button className="button-glitchy-yellow" onClick={onReady}>
              I&apos;m ready
            </button>
          )}
        </>
      ) : (
        <>
          <div className="text-glitchy-medium">Try to join the game...</div>
          <button className="button-glitchy-yellow" onClick={onJoinGame}>
            Join the game
          </button>
        </>
      )}
    </div>
  );
};

export const PlayerLobby = React.memo(PlayerLobbyComponent);
