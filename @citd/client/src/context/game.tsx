import { Game } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from './socket';

const GameContext = React.createContext<Game | undefined>(undefined);

export interface GameContext {
  game: Game;
}

interface GameProviderState {
  loading: boolean;
  game?: Game;
}

class GameProviderComponent extends React.Component<ISocketContext, GameProviderState> {
  state: GameProviderState = {
    loading: true,
  };

  componentDidMount() {
    this.props.socket.on('game', this.onGame);
    this.props.socket.emit('getGame');
  }

  componentWillUnmount() {
    this.props.socket.off('game', this.onGame);
  }

  private onGame = (game: Game) => {
    this.setState({ loading: false, game });
  };

  render() {
    const { loading, game } = this.state;

    // Loading state:
    if (loading) {
      return 'Fetching game...';
    }

    // User is available:
    return <GameContext.Provider value={game}>{this.props.children}</GameContext.Provider>;
  }
}

export const GameProvider = withSocket(GameProviderComponent);

export function withGame<T extends GameContext>(
  Component: React.ComponentType<T>,
): React.FC<Pick<T, Exclude<keyof T, 'game'>>> {
  return function WrappedComponent(props) {
    return (
      <GameContext.Consumer>
        {(game) => <Component {...(props as T)} game={game} />}
      </GameContext.Consumer>
    );
  };
}
