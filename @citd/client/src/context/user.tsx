import { User } from '@citd/shared';
import * as React from 'react';

import { ISocketContext, withSocket } from './socket';
import { Credentials } from '../components/Credentials';

const UserContext = React.createContext<User | undefined>(undefined);

export interface UserContext {
  user: User;
}

interface UserProviderState {
  loading: boolean;
  user?: User;
}

class UserProviderComponent extends React.Component<ISocketContext, UserProviderState> {
  state: UserProviderState = {
    loading: true
  };

  componentDidMount() {
    this.props.socket.on('user', this.onUser);
    const userId = window.sessionStorage.getItem('citd-user-id');
    if (userId) {
      this.props.socket.emit('getUser', userId);
    } else {
      this.setState({loading: false});
    }
  }

  componentWillUnmount() {
    this.props.socket.off('user', this.onUser);
  }

  private onUser = (user: User) => {
    if (user) {
      this.setState({loading: false, user});
      window.sessionStorage.setItem('citd-user-id', user.id);
    } else {
      this.setState({loading: false});
    }
  }

  render() {
    const {loading, user} = this.state;

    // Loading state:
    if (loading) {
      return 'Fetching user...';
    }

    // Credentials state:
    if (!user) {
      return <Credentials />;
    }

    // User is available:
    return (
      <UserContext.Provider value={user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const UserProvider = withSocket(UserProviderComponent);

export function withUser<T extends UserContext>(
  Component: React.ComponentType<T>
): React.FC<Pick<T, Exclude<keyof T, 'user'>>> {
  return function WrappedComponent(props) {
    return (
      <UserContext.Consumer>
        {user => <Component {...props as any} user={user} />}
      </UserContext.Consumer>
    );
  };
};

