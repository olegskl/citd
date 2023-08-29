import { createServer } from "http";
import { parse } from "url";
import { gameServer } from "./gameServer";

const server = createServer();

server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url!);

  if (pathname === "/ws/game") {
    gameServer.handleUpgrade(request, socket, head, function done(ws) {
      gameServer.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3000);
