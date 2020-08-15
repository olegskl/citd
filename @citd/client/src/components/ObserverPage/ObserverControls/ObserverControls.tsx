import { Game } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from '../../../context/socket';

import './ObserverControls.css';

interface ObserverLobbyProps extends ISocketContext {
  game: Game;
}

interface ObserverLobbyState {
  areControlsDisplayed: boolean;
}

class ObserverControlsComponent extends React.PureComponent<
  ObserverLobbyProps,
  ObserverLobbyState
> {
  state: ObserverLobbyState = {
    areControlsDisplayed: false,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.toggleControlsOnEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.toggleControlsOnEsc);
  }

  private toggleControlsOnEsc = (event: KeyboardEvent) => {
    if (event.which === 27) {
      this.setState(({ areControlsDisplayed }) => ({
        areControlsDisplayed: !areControlsDisplayed,
      }));
    }
  };

  private pauseGame = () => {
    this.props.socket.emit('pauseGame');
  };

  private startGame = () => {
    this.props.socket.emit('startGame');
  };

  private resetGame = () => {
    this.props.socket.emit('resetGame');
  };

  private renderTitle = () => {
    const { status } = this.props.game;
    if (status === 'playing') {
      return <div className="text-glitchy-medium">Time is running out!</div>;
    }
    if (status === 'paused') {
      return <div className="text-glitchy-medium">Game is paused...</div>;
    }
    if (status === 'ended') {
      return <div className="text-glitchy-medium">Game has ended</div>;
    }
    return null;
  };

  render() {
    const { game } = this.props;
    if (!this.state.areControlsDisplayed) {
      return null;
    }
    return (
      <div className="observer-controls">
        <h1 className="text-glitchy-large">Code in the Dark</h1>
        {this.renderTitle()}
        {game.status === 'playing' && (
          <button className="button-glitchy-yellow" onClick={this.pauseGame}>
            Pause the game
          </button>
        )}
        {game.status === 'paused' && (
          <button className="button-glitchy-yellow" onClick={this.startGame}>
            Unpause the game
          </button>
        )}
        <button className="button-glitchy-yellow" onClick={this.resetGame}>
          Reset the game
        </button>
      </div>
    );
  }
}

export const ObserverControls = withSocket(ObserverControlsComponent);
