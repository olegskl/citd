import { Game } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';
import { LobbyPlayer } from '../LobbyPlayer';

import './ObserverLobby.css';

interface ObserverLobbyProps extends ISocketContext {
  game: Game;
}

class ObserverLobbyComponent extends React.PureComponent<ObserverLobbyProps> {

  private onPlayerKick = (playerId: string) => {
    this.props.socket.emit('kickPlayerFromGame', playerId);
  }

  private startGame = () => {
    this.props.socket.emit('startGame');
  }

  private resetGame = () => {
    this.props.socket.emit('resetGame');
  }

  private renderTitle = () => {
    const {players, status} = this.props.game;
    if (status === 'waiting') {
      const allPlayersReady = players.length === 2 && players.every(player => player.readyToPlay);
      return allPlayersReady
        ? <div className='text-glitchy-medium'>We are ready to start!</div>
        : <div className='text-glitchy-medium'>Waiting for players...</div>
    }
    if (status === 'paused') {
      return <div className='text-glitchy-medium'>Game is paused...</div>;
    }
    if (status === 'ended') {
      return <div className='text-glitchy-medium'>Game has ended</div>;
    }
    return null;
  }

  private renderCallToAction = () => {
    const {players, status} = this.props.game;
    if (status === 'waiting') {
      const allPlayersReady = players.length === 2 && players.every(player => player.readyToPlay);
      const className = allPlayersReady ? 'button-glitchy-yellow' : 'button-glitchy-yellow disabled';
      return (
        <button className={className} onClick={this.startGame}>
          Start the game
        </button>
      );
    }
    if (status === 'paused') {
      return (
        <button className='button-glitchy-yellow' onClick={this.startGame}>
          Unpause the game
        </button>
      );
    }
    if (status === 'ended') {
      return (
        <button className='button-glitchy-yellow' onClick={this.resetGame}>
          Start a new game
        </button>
      );
    }
    return null;
  }

  render() {
    const {players} = this.props.game;
    return (
      <div className='observer-lobby'>
        <h1 className='text-glitchy-large'>Code in the Dark</h1>
        {this.renderTitle()}
        <div className='observer-lobby-player-list'>
          <LobbyPlayer
            player={players[0]}
            namePlaceholder='Player 1'
            onPlayerKick={this.onPlayerKick}
          />
          <LobbyPlayer
            player={players[1]}
            namePlaceholder='Player 2'
            onPlayerKick={this.onPlayerKick}
          />
        </div>
        {this.renderCallToAction()}
      </div>
    );
  }
}

export const ObserverLobby = withSocket(ObserverLobbyComponent);
