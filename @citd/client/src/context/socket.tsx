import * as React from 'react';

interface IApi {
  emit: (...args: any[]) => void;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  off: (eventName: string, callback: (...args: any[]) => void) => void;
}

const SocketContext = React.createContext<IApi | undefined>(undefined);

export interface ISocketContext {
  socket: IApi;
}

interface ISocketProviderState {
  connected: boolean;
}

export class SocketProvider extends React.PureComponent<unknown, ISocketProviderState> {
  private socket?: WebSocket;
  private reconnectTimer?: number;
  state: ISocketProviderState = {
    connected: false,
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.componentWillUnmount);
    this.openConnection();
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.componentWillUnmount);
    if (this.socket) {
      this.removeConnectionListeners();
      this.socket.close();
    }
  }

  private openConnection = () => {
    this.socket = new WebSocket('ws://127.0.0.1:3000/sock');
    this.socket.addEventListener('open', this.onOpenConnection);
    this.socket.addEventListener('close', this.onCloseConnection);
    this.socket.addEventListener('message', this.onMessage);
  };

  private removeConnectionListeners = () => {
    if (!this.socket) {
      return;
    }
    this.socket.removeEventListener('open', this.onOpenConnection);
    this.socket.removeEventListener('close', this.onCloseConnection);
    this.socket.removeEventListener('message', this.onMessage);
  };

  private onOpenConnection = () => {
    this.setState({ connected: true });
  };

  private onCloseConnection = () => {
    this.removeConnectionListeners();
    if (!this.reconnectTimer) {
      this.reconnectTimer = window.setTimeout(() => {
        this.reconnectTimer = undefined;
        this.openConnection();
      }, 1000);
    }
    this.setState({ connected: false });
  };

  private messageHandlers: { [eventName: string]: Array<(...args: any) => void> } = {};

  private onMessage = (event: MessageEvent) => {
    const [eventName, ...args] = JSON.parse(event.data);
    if (this.messageHandlers[eventName]) {
      this.messageHandlers[eventName].forEach((handler) => handler(...args));
    }
  };

  private readonly api: ISocketContext['socket'] = {
    emit: (...args) => {
      if (!this.socket) {
        return;
      }
      this.socket.send(JSON.stringify(args));
    },
    on: (eventName, callback) => {
      this.messageHandlers[eventName] = this.messageHandlers[eventName] || [];
      this.messageHandlers[eventName].push(callback);
    },
    off: (eventName, callback) => {
      if (!this.messageHandlers[eventName]) {
        return;
      }
      const index = this.messageHandlers[eventName].indexOf(callback);
      if (index !== -1) {
        this.messageHandlers[eventName].splice(index, 1);
      }
    },
  };

  render() {
    if (!this.socket || !this.state.connected) {
      return 'Connecting to the server...';
    }
    return <SocketContext.Provider value={this.api}>{this.props.children}</SocketContext.Provider>;
  }
}

export function withSocket<T extends ISocketContext>(
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
