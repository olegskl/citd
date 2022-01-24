import type { FastifyServerOptions } from "fastify";
import fastify from "fastify";
import cors from "fastify-cors";

export const createFastifyServer = (options: FastifyServerOptions) => {
  const server = fastify(options);

  server.get("/games", async (request) => {
    return [];
  });
  server.post("/games", async (request) => {
    const gameOptions = request.body;
    return {};
  });

  return server;
};
