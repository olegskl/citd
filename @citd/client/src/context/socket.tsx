// import * as React from 'react';

// import '../hooks/useSocket';

// interface IApi {
//   emit: (...args: any[]) => void;
//   on: (eventName: string, callback: (...args: any[]) => void) => void;
//   off: (eventName: string, callback: (...args: any[]) => void) => void;
// }

// const SocketContext = React.createContext<IApi | undefined>(undefined);

// export type SocketContextType = {
//   socket: IApi;
// };

// interface ISocketProviderState {
//   connected: boolean;
// }

// export class SocketProvider extends React.PureComponent<unknown, ISocketProviderState> {
//   private socket?: WebSocket;
//   private reconnectTimer?: number;
//   state: ISocketProviderState = {
//     connected: false,
//   };

//   componentDidMount() {
//     window.addEventListener('beforeunload', this.componentWillUnmount);
//     this.openConnection();
//   }

//   componentWillUnmount() {
//     window.removeEventListener('beforeunload', this.componentWillUnmount);
//     if (this.socket) {
//       this.removeConnectionListeners();
//       this.socket.close();
//     }
//   }

//   private openConnection = () => {
//     this.socket = new WebSocket('ws://127.0.0.1:3000/sock');
//     this.socket.addEventListener('open', this.onOpenConnection);
//     this.socket.addEventListener('close', this.onCloseConnection);
//     this.socket.addEventListener('message', this.onMessage);
//   };

//   private removeConnectionListeners = () => {
//     if (!this.socket) {
//       return;
//     }
//     this.socket.removeEventListener('open', this.onOpenConnection);
//     this.socket.removeEventListener('close', this.onCloseConnection);
//     this.socket.removeEventListener('message', this.onMessage);
//   };

//   private onOpenConnection = () => {
//     this.setState({ connected: true });
//   };

//   private onCloseConnection = () => {
//     this.removeConnectionListeners();
//     if (!this.reconnectTimer) {
//       this.reconnectTimer = window.setTimeout(() => {
//         this.reconnectTimer = undefined;
//         this.openConnection();
//       }, 1000);
//     }
//     this.setState({ connected: false });
//   };

//   private messageHandlers: { [eventName: string]: Array<(...args: any) => void> } = {};

//   private onMessage = (event: MessageEvent) => {
//     const [eventName, ...args] = JSON.parse(event.data);
//     if (this.messageHandlers[eventName]) {
//       this.messageHandlers[eventName].forEach((handler) => handler(...args));
//     }
//   };

//   private readonly api: SocketContextType['socket'] = {
//     emit: (...args) => {
//       if (!this.socket) {
//         return;
//       }
//       this.socket.send(JSON.stringify(args));
//     },
//     on: (eventName, callback) => {
//       this.messageHandlers[eventName] = this.messageHandlers[eventName] || [];
//       this.messageHandlers[eventName].push(callback);
//     },
//     off: (eventName, callback) => {
//       if (!this.messageHandlers[eventName]) {
//         return;
//       }
//       const index = this.messageHandlers[eventName].indexOf(callback);
//       if (index !== -1) {
//         this.messageHandlers[eventName].splice(index, 1);
//       }
//     },
//   };

//   render() {
//     if (!this.socket || !this.state.connected) {
//       return 'Connecting to the server...';
//     }
//     return <SocketContext.Provider value={this.api}>{this.props.children}</SocketContext.Provider>;
//   }
// }

// export const useSocketContext = (): IApi => {
//   const context = React.useContext(SocketContext);
//   if (context === undefined) {
//     throw new Error('useSocketContext must be used within a SocketProvider');
//   }
//   return context;
// };

// export function withSocket<T extends SocketContextType>(
//   Component: React.ComponentType<T>,
// ): React.FC<Pick<T, Exclude<keyof T, 'socket'>>> {
//   return function WrappedComponent(props) {
//     return (
//       <SocketContext.Consumer>
//         {(socket) => <Component {...(props as any)} socket={socket} />}
//       </SocketContext.Consumer>
//     );
//   };
// }

import * as React from 'react';

export type SocketContextType = WebSocket | null;
export type SocketProviderProps = { address: string };

export const SocketContext = React.createContext<SocketContextType>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ address, children }) => {
  const [rcAttempt, setRcAttempt] = React.useState(0);
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  React.useEffect(() => {
    const newSocket = new WebSocket(address);
    const onSocketOpen = () => {
      newSocket.removeEventListener('open', onSocketOpen);
      setSocket(newSocket);
    };
    const onSocketClose = () => {
      setSocket(null);
    };
    // const onPageUnload = () => {
    //   newSocket.close();
    // };
    newSocket.addEventListener('open', onSocketOpen);
    newSocket.addEventListener('error', console.error);
    newSocket.addEventListener('close', onSocketClose);
    // window.addEventListener('beforeunload', onPageUnload);
    // window.addEventListener('pagehide', onPageUnload);
    return () => {
      newSocket.removeEventListener('open', onSocketOpen);
      newSocket.removeEventListener('error', console.error);
      newSocket.removeEventListener('close', onSocketClose);
      // window.removeEventListener('beforeunload', onPageUnload);
      // window.removeEventListener('pagehide', onPageUnload);
      newSocket.close();
    };
  }, [address, rcAttempt]);

  React.useEffect(() => {
    if (socket) return;
    const rcTimerId = window.setTimeout(() => {
      setRcAttempt((currentRcAttempt) => currentRcAttempt + 1);
    }, 1000);
    return () => window.clearTimeout(rcTimerId);
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = (): WebSocket | null => {
  const socket = React.useContext(SocketContext);
  if (socket === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return socket;
};
