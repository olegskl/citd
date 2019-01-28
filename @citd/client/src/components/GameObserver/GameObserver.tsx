import { IGamePlayer } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../context/socket';

import { Viewer } from './Viewer';
import './GameObserver.css';

interface IGameObserverState {
  players: IGamePlayer[];
}

class GameObserverComponent extends React.PureComponent<ISocketContext, IGameObserverState> {
  state: IGameObserverState = {players: []};

  componentDidMount() {
    this.props.socket.emit('startGame');
    this.props.socket.emit('getPlayerList', this.updatePlayerList);
    this.props.socket.on('playerList', this.updatePlayerList);
  }

  componentWillUnmount() {
    this.props.socket.off('playerList', this.updatePlayerList);
  }

  private updatePlayerList = (players: IGamePlayer[]) => {
    this.setState({players});
  }

  render() {
    if (this.state.players.length === 0) {
      return (
        <div className='observer-waiting'>Waiting for players to join...</div>
      );
    }
    return (
      <div className='viewer-list'>
        {this.state.players.map(player => (
          <Viewer key={player.id} size={1/this.state.players.length} player={player} />
        ))}
      </div>
    );
  }
}

export const GameObserver = withSocket(GameObserverComponent);
