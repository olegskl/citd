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
    const { players } = this.state;

    if (players.length === 0) {
      return (
        <div className='observer-waiting'>
          Waiting for players to join
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      );
    }
    return (
      <div className='viewer-list'>
        {players.map(player => (
          <Viewer key={player.id} size={1/players.length} player={player} />
        ))}
      </div>
    );
  }
}

export const GameObserver = withSocket(GameObserverComponent);
