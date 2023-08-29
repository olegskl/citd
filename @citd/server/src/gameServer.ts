import { Action, GameStatus, createInitialGame, reducer } from "@citd/shared";
import * as WebSocket from "ws";
import { broadcast } from "./broadcast";

export const gameServer = new WebSocket.WebSocketServer({ noServer: true });

const history: Action[] = [{ type: "reset" }];
let game = createInitialGame();

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
  broadcast(gameServer, message, isBinary);
}

setInterval(() => {
  if (game.status === GameStatus.PLAYING) {
    gameServer.emit("message");
    onMessage(Buffer.from(JSON.stringify({ type: "tick" })), false);
  }
}, 1000);

gameServer.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", onMessage);
  ws.send(JSON.stringify(history));
});
