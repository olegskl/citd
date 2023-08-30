import * as express from "express";
import { createServer } from "http";
import { parse } from "url";
import { gameServer } from "./gameServer";

const app = express();
const server = createServer(app);

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

app.get(/\..+$/, express.static("public"));
app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

server.listen(3000);
