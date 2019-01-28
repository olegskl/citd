import { IGamePlayer } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../context/socket';

import { Playground } from './Playground';
import './GamePlayer.css';

interface IGamePlayerState {
  player?: IGamePlayer;
  loading: boolean;
  nickname: string;
}

class GamePlayerComponent extends React.PureComponent<ISocketContext, IGamePlayerState> {
  private inputRef = React.createRef<HTMLInputElement>();
  state: IGamePlayerState = {
    loading: true,
    nickname: ''
  };

  componentDidMount() {
    // Does player exist in sessionstorage?:
    const playerId = window.sessionStorage.getItem('citd-player-id');
    if (playerId) {
      // Does player exist on server?:
      this.props.socket.on('player', this.onPlayer);
      this.props.socket.emit('getPlayer', playerId);
    } else {
      this.setState({loading: false});
    }

    this.props.socket.on('gameJoined', this.onGameJoined);
    this.props.socket.on('gameLeft', this.onGameLeft);
  }

  componentWillUnmount() {
    this.props.socket.off('player', this.onPlayer);
    this.props.socket.off('gameJoined', this.onGameJoined);
    this.props.socket.off('gameLeft', this.onGameLeft);
  }

  private onPlayer = (player: IGamePlayer) => {
    if (player) {
      this.setState({player, loading: false});
      window.sessionStorage.setItem('citd-player-id', player.id);
    } else {
      this.setState({loading: false});
    }
  }

  private onGameJoined = (player: IGamePlayer) => {
    this.setState({player});
    window.sessionStorage.setItem('citd-player-id', player.id);
  }

  private onGameLeft = () => {
    this.setState({player: undefined});
    window.sessionStorage.removeItem('citd-player-id');
  }

  private joinGame = () => {
    if (!this.state.nickname) {
      this.inputRef.current!.focus();
      return;
    }
    this.props.socket.emit('joinGame', this.state.nickname);
  }

  private leaveGame = () => {
    if (!this.state.player) { return; }
    this.props.socket.emit('leaveGame', this.state.player.id);
  }

  private onNicknameChange = (e: React.ChangeEvent<any>) => {
    this.setState({nickname: e.currentTarget.value});
  }

  private onNicknameKeyPress = (e: React.KeyboardEvent) => {
    const charCode = e.which || e.keyCode;
    if (charCode === 13) {
      this.joinGame();
    }
  }

  render() {
    const {player, loading, nickname} = this.state;
    if (loading) { return null; }
    return player
      ? <Playground player={player} onLeaveGame={this.leaveGame} />
      : <div className='lobby'>
          <input
            ref={this.inputRef}
            type='text'
            value={nickname}
            onChange={this.onNicknameChange}
            onKeyPress={this.onNicknameKeyPress}
            autoFocus
            className='lobby-nickname'
            placeholder='Enter your name, and...'
          />
          <a onClick={this.joinGame} className='lobby-join'>join</a>
          <a onClick={this.joinGame} className='lobby-the'>the</a>
          <a onClick={this.joinGame} className='lobby-fun'>game</a>
        </div>;
  }
};

export const GamePlayer = withSocket(GamePlayerComponent);
