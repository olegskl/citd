import * as React from 'react';
import { SocketMessage, useSocket } from './useSocket';

export const useChannel = <S>(key: string): S => {
  const socket = useSocket('ws://127.0.0.1:3000/sock');
  const [value, setValue] = React.useState<S>();
  React.useEffect(() => {
    if (!socket) return;
    const onMessage = (event: MessageEvent) => {
      if (event.data.type !== key) return;
      setValue(event.data.payload);
    };
    socket.addEventListener('message', onMessage);
    return () => {
      socket.removeEventListener('message', onMessage);
    };
  }, socket);
  return value;
};
