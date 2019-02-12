import { IGamePlayer } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../context/socket';

import { Viewer } from './Viewer';
import { Timer } from '../Timer';
import './GameObserver.css';

import * as taskImg from '../../assets/task.png';

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
      <div className='game-panels'>
        <div className='game-player-panel game-player-one'>
          {players[0] ? (
            <Viewer player={players[0]} />
          ) : (
            <div className='game-player-placeholder' />
          )}
        </div>
        <div className='game-info-panel'>
          <Timer active={false} secondsRemaining={15*60} />
          <img src={taskImg} className='game-info-image' />
        </div>
        <div className='game-player-panel game-player-two'>
          {players[1] ? (
            <Viewer player={players[1]} />
          ) : (
            <div className='game-player-placeholder' />
          )}
        </div>
      </div>
    );
  }
}

export const GameObserver = withSocket(GameObserverComponent);
