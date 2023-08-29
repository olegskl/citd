import * as WebSocket from "ws";

export function broadcast(
  wss: WebSocket.WebSocketServer,
  message: WebSocket.RawData,
  binary: boolean
): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message, { binary });
    }
  });
}
