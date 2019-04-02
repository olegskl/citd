import * as React from 'react';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';
import { UserContext, withUser } from '../../context/user';

import { GameOver } from './GameOver';
import { PlayerLobby } from './PlayerLobby';
import { Playground } from './Playground';

type GamePlayerProps = ISocketContext & UserContext & GameContext;

class GamePlayerComponent extends React.PureComponent<GamePlayerProps> {

  componentDidMount() {
    this.props.socket.emit('joinChannel', 'players');
    this.props.socket.emit('joinGame', this.props.user.id);
  }

  componentWillUnmount() {
    this.props.socket.emit('leaveChannel', 'players');
  }

  render() {
    const {game, user} = this.props;

    // Waiting state:
    const isPlayerInGame = game.players.some(player => player.id === user.id);
    if (game.status === 'waiting' || !isPlayerInGame) {
      return <PlayerLobby />;
    }
    // Ended state:
    if (game.status === 'ended') {
      return <GameOver />;
    }
    // Playing (and paused as overlay) state:
    return <Playground />;
  }
};

export const GamePlayer = withSocket(withUser(withGame(GamePlayerComponent)));
