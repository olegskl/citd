import * as React from 'react';

import { GameContext, withGame } from '../../context/game';
import { ISocketContext, withSocket } from '../../context/socket';

import { ObserverControls } from './ObserverControls';
import { ObserverLobby } from './ObserverLobby';
import { Preview } from './Preview';
import { Viewer } from './Viewer';

import './ObserverPage.css';

type ObserverPageProps = ISocketContext & GameContext;

class ObserverPageComponent extends React.PureComponent<ObserverPageProps> {

  componentDidMount() {
    this.props.socket.emit('joinChannel', 'observers');
  }

  componentWillUnmount() {
    this.props.socket.emit('leaveChannel', 'observers');
  }

  render() {
    const {game} = this.props;

    if (game.status === 'playing' || game.status === 'paused' || game.status === 'ended') {
      return (
        <div className='viewer-list'>
          <Viewer player={game.players[0]} />
          <Preview />
          <Viewer player={game.players[1]} />
          <ObserverControls game={game} />
        </div>
      );
    }

    return <ObserverLobby game={game} />;
  }
}

export const ObserverPage = withSocket(withGame(ObserverPageComponent));
