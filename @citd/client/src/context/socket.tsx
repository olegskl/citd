import * as React from 'react';

interface Api {
  emit: (...args: any[]) => void;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  off: (eventName: string, callback: (...args: any[]) => void) => void;
}

const SocketContext = React.createContext<Api | undefined>(undefined);

export type SocketContextType = {
  socket: Api;
};

export const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = React.useState<WebSocket>();
  const [status, setStatus] = React.useState<'connect' | 'reconnect' | 'connected'>('connect');

  const messageHandlers = React.useRef<{ [eventName: string]: Array<(...args: any) => void> }>({});

  // Delayed reconnection effect:
  React.useEffect(() => {
    if (status === 'reconnect') {
      console.log('setting up reconnection...');
      const timerId = window.setTimeout(() => {
        console.log('reconnecting...');
        setStatus('connect');
      }, 1000);
      return () => window.clearTimeout(timerId);
    }
  }, [status]);

  // Immediate connection effect:
  React.useEffect(() => {
    console.log('connection effect');
    if (!socket) {
      console.log('connecting...');
      const newSocket = new WebSocket('ws://127.0.0.1:3000/sock');

      const onMessage = (event: MessageEvent) => {
        const [eventName, ...args] = JSON.parse(event.data);
        console.log('received', eventName, args);
        if (messageHandlers.current[eventName]) {
          messageHandlers.current[eventName].forEach((handler) => handler(...args));
        }
      };

      const cleanup = () => {
        console.log('cleaning up...');
        window.removeEventListener('beforeunload', cleanup);
        newSocket.removeEventListener('open', onOpenConnection);
        newSocket.removeEventListener('close', onCloseConnection);
        newSocket.removeEventListener('message', onMessage);
        newSocket.close();
      };

      const onOpenConnection = () => {
        setStatus('connected');
        setSocket(newSocket);
        console.log('connected!');
      };

      const onCloseConnection = () => {
        console.log('closed connection');
        cleanup();
        setSocket(undefined);
        setStatus('reconnect');
      };

      newSocket.addEventListener('open', onOpenConnection);
      newSocket.addEventListener('close', onCloseConnection);
      newSocket.addEventListener('message', onMessage);
      newSocket.addEventListener('error', console.error);

      window.addEventListener('beforeunload', cleanup);
      return cleanup;
    }
  }, [socket]);

  const api = React.useMemo<SocketContextType['socket']>(() => {
    return {
      emit: (...args) => {
        if (!socket) {
          return;
        }
        console.log('sending', args);
        socket.send(JSON.stringify(args));
      },
      on: (eventName, callback) => {
        messageHandlers.current[eventName] = messageHandlers.current[eventName] || [];
        messageHandlers.current[eventName].push(callback);
      },
      off: (eventName, callback) => {
        if (!messageHandlers.current[eventName]) {
          return;
        }
        const index = messageHandlers.current[eventName].indexOf(callback);
        if (index !== -1) {
          messageHandlers.current[eventName].splice(index, 1);
        }
      },
    };
  }, [socket]);

  console.log('render with socket state', socket?.readyState);

  if (socket && socket.readyState === socket.OPEN) {
    return <SocketContext.Provider value={api}>{children}</SocketContext.Provider>;
  }

  return <>Connecting to the server...</>;
};

export const useSocketContext = (): Api => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};

export function withSocket<T extends SocketContextType>(
  Component: React.ComponentType<T>,
): React.FC<Pick<T, Exclude<keyof T, 'socket'>>> {
  return function WrappedComponent(props) {
    return (
      <SocketContext.Consumer>
        {(socket) => <Component {...(props as any)} socket={socket} />}
      </SocketContext.Consumer>
    );
  };
}
