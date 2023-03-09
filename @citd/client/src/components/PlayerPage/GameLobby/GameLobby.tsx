import * as React from 'react';
import { Link } from 'react-router-dom';

import { useGameContext } from '../../../context/game';

import './GameLobby.css';

const GameLobbyComponent: React.VFC = () => {
  const { player, dispatch } = useGameContext();
  const isReadyToPlay = player?.readyToPlay;

  const onReady = () => {
    if (!player) return;
    dispatch({ type: 'changeReadyToPlayStatus', payload: true });
  };

  const onNotReady = () => {
    if (!player) return;
    dispatch({ type: 'changeReadyToPlayStatus', payload: false });
  };

  const onLeaveGame = () => {
    if (!player) return;
    dispatch({ type: 'kickPlayer', payload: player.id });
  };

  return (
    <div className="game-lobby">
      <h1 className="text-glitchy-large">Code in the Dark</h1>
      <div className="text-glitchy-medium">
        {isReadyToPlay ? (
          <div className="game-lobby-paragraph">
            <p>Waiting for game to start...</p>
            <p>
              Remember to talk to the audience while the game is running. They are the key to your
              victory!
            </p>
            <p>And use emmet shortcuts!</p>
          </div>
        ) : (
          <>Are you ready?</>
        )}
      </div>
      <div className="welcome-buttons">
        <Link to="/" onClick={onLeaveGame} className="button-glitchy-yellow">
          Leave
        </Link>
        {isReadyToPlay ? (
          <button className="button-glitchy-yellow" onClick={onNotReady}>
            Wait, I&apos;m not ready yet
          </button>
        ) : (
          <button className="button-glitchy-yellow" onClick={onReady}>
            I&apos;m ready
          </button>
        )}
      </div>
    </div>
  );
};

export const GameLobby = React.memo(GameLobbyComponent);
