import * as React from 'react';

export function useSocket<T>(
  path: string,
  messageHandler: (data: T) => void,
): WebSocket | undefined {
  const url = `ws://${window.location.hostname}:3000${path}`;
  const [reconnectAttempt, setReconnectAttempt] = React.useState(0);
  const [socket, setSocket] = React.useState<WebSocket | undefined>();

  React.useEffect(() => {
    const newSocket = new WebSocket(url);
    let reconnectionTimeoutId: number | undefined;

    function onOpenConnection() {
      setSocket(newSocket);
    }
    function onCloseConnection() {
      setSocket(undefined);
      reconnectionTimeoutId = window.setTimeout(() => {
        setReconnectAttempt((attempt) => attempt + 1);
      }, 1000);
    }
    function onMessage(event: MessageEvent) {
      messageHandler(JSON.parse(event.data));
    }

    newSocket.addEventListener('open', onOpenConnection);
    newSocket.addEventListener('close', onCloseConnection);
    newSocket.addEventListener('message', onMessage);

    return () => {
      window.clearTimeout(reconnectionTimeoutId);
      newSocket.removeEventListener('open', onOpenConnection);
      newSocket.removeEventListener('close', onCloseConnection);
      newSocket.removeEventListener('message', onMessage);
      newSocket.close();
    };
  }, [url, messageHandler, reconnectAttempt]);

  return socket?.readyState === WebSocket.OPEN ? socket : undefined;
}
