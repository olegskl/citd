import { useEffect, useState } from 'react';

export type SocketMessage = { type: 'string'; payload: any };

export const useSocket = (address: string): WebSocket | undefined => {
  const [rcAttempt, setRcAttempt] = useState(0);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const newSocket = new WebSocket(address);
    const onSocketOpen = () => {
      newSocket.removeEventListener('open', onSocketOpen);
      setSocket(newSocket);
    };
    const onSocketClose = () => {
      setSocket(undefined);
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

  useEffect(() => {
    if (socket) return;
    const rcTimerId = window.setTimeout(() => {
      setRcAttempt((currentRcAttempt) => currentRcAttempt + 1);
    }, 1000);
    return () => window.clearTimeout(rcTimerId);
  }, [socket]);

  return socket;
};
