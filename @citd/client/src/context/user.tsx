import { User } from '@citd/shared';
import * as React from 'react';

import { SocketContext } from './socket';
import { LoginPage } from '../components/LoginPage';

export const UserContext = React.createContext<User>({} as User);

export type UserContextType = {
  user: User;
};

const UserProviderComponent: React.FC = ({ children }) => {
  const socket = React.useContext(SocketContext);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<User>();

  const onUser = (user: User) => {
    if (user) {
      setUser(user);
      setLoading(false);
      window.sessionStorage.setItem('citd-user-id', user.id);
    } else {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    socket.on('user', onUser);
    const userId = window.sessionStorage.getItem('citd-user-id');
    if (userId) {
      socket.emit('getUser', userId);
    } else {
      setLoading(false);
    }

    return () => {
      socket.off('user', onUser);
    };
  }, [socket]);

  // Loading state:
  if (loading) {
    return <span>Fetching user...</span>;
  }

  // Login state:
  if (!user) {
    return <LoginPage />;
  }

  // User is available:
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const UserProvider = UserProviderComponent;

export function withUser<T extends UserContextType>(
  Component: React.ComponentType<T>,
): React.FC<Pick<T, Exclude<keyof T, 'user'>>> {
  return function WrappedComponent(props) {
    return (
      <UserContext.Consumer>
        {(user) => <Component {...(props as any)} user={user} />}
      </UserContext.Consumer>
    );
  };
}
