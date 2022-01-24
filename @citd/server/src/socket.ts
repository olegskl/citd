import * as http from "http";
import * as WebSocket from "ws";

import { reducer, game, players } from "@citd/shared";
import { createStore, createAction } from "@reduxjs/toolkit";

import { uid } from "./helpers/uid";

export const createWebSocketServer = (options: WebSocket.ServerOptions) => {
  const ws = new WebSocket.Server(options);

  const store = createStore(reducer);

  ws.on("connection", (client) => {
    const userId = uid();
    store.dispatch(players.actions.addPlayer({ id: userId, name: "foo" }));

    client.on("message", (message) => {
      if (typeof message !== "string") return;
      const action = JSON.parse(message); // TODO: validate action
      // Update server-side store:
      store.dispatch(action);
      // Notify all clients about this action:
      // TODO: not every client should be notified!
      ws.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(message);
        }
      });
    });
  });

  return ws;
};
