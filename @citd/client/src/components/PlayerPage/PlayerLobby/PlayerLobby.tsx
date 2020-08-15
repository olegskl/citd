import * as React from 'react';

import { GameContext, withGame } from '../../../context/game';
import { ISocketContext, withSocket } from '../../../context/socket';
import { UserContext, withUser } from '../../../context/user';

import './PlayerLobby.css';

type LobbyProps = ISocketContext & UserContext & GameContext;

class PlayerLobbyComponent extends React.PureComponent<LobbyProps> {
  private onJoinGame = () => {
    this.props.socket.emit('joinGame', this.props.user.id);
  };

  private onLeaveGame = () => {
    this.props.socket.emit('leaveGame', this.props.user.id);
  };

  private onReady = () => {
    this.props.socket.emit('readyToPlay', this.props.user.id, true);
  };

  private onNotReady = () => {
    this.props.socket.emit('readyToPlay', this.props.user.id, false);
  };

  render() {
    const { user, game } = this.props;
    const userInGame = game.players.find(({ id }) => id === user.id);
    const isReadyToPlay = userInGame && userInGame.readyToPlay;
    return (
      <div className="player-lobby">
        <h1 className="text-glitchy-large">Code in the Dark</h1>
        {userInGame ? (
          <>
            <div className="text-glitchy-medium">Are you ready?</div>
            {isReadyToPlay ? (
              <button className="button-glitchy-yellow" onClick={this.onNotReady}>
                I&apos;m not ready
              </button>
            ) : (
              <button className="button-glitchy-yellow" onClick={this.onReady}>
                I&apos;m ready
              </button>
            )}
          </>
        ) : (
          <>
            <div className="text-glitchy-medium">Try to join the game...</div>
            <button className="button-glitchy-yellow" onClick={this.onJoinGame}>
              Join the game
            </button>
          </>
        )}
      </div>
    );
  }
}

export const PlayerLobby = withSocket(withUser(withGame(PlayerLobbyComponent)));
