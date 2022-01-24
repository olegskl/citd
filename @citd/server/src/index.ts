import { createFastifyServer } from "./server";
import { createWebSocketServer } from "./socket";

const fastifyServer = createFastifyServer({ logger: true });
const webSocketServer = createWebSocketServer({
  server: fastifyServer.server,
  path: "/sock",
});

fastifyServer.listen(3000, "127.0.0.1").catch((err) => {
  fastifyServer.log.error(err);
  process.exit(1);
});
