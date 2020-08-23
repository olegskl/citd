import { User } from '@citd/shared';
import * as React from 'react';

import { useSocketContext } from './socket';
import { LoginPage } from '../components/LoginPage';

const UserContext = React.createContext<User | undefined>(undefined);

export type UserContextType = {
  user: User;
};

export const UserProvider: React.FC = ({ children }) => {
  const socket = useSocketContext();
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
    return <>Fetching user...</>;
  }

  // Login state:
  if (!user) {
    return <LoginPage />;
  }

  // User is available:
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUserContext = (): User => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

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
