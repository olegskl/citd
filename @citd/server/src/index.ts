import { Action, Game, GameStatus, INITIAL_GAME, reducer } from "@citd/shared";
import * as WebSocket from "ws";

const wss = new WebSocket.WebSocketServer({ port: 3000, path: "/ws" });

const history: Action[] = [{ type: "reset" }];
let game = INITIAL_GAME;

function onMessage(message: WebSocket.RawData, isBinary: boolean) {
  const actions: Action | Action[] = JSON.parse(message.toString());
  if (Array.isArray(actions)) {
    actions.forEach((action) => {
      history.push(action);
      game = reducer(game, action);
    });
  } else {
    history.push(actions);
    game = reducer(game, actions);
  }
  broadcast(wss, message, isBinary);
}

setInterval(() => {
  if (game.status === GameStatus.PLAYING) {
    wss.emit("message");
    onMessage(Buffer.from(JSON.stringify({ type: "tick" })), false);
  }
}, 1000);

wss.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", onMessage);
  ws.send(JSON.stringify(history));
});

function broadcast(
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
