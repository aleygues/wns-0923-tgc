import "reflect-metadata";
import { dataSource } from "./datasource";
import { ApolloServer } from "@apollo/server";
import { ContextType } from "./auth";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { getSchema } from "./schema";
import { initializeRoutes } from "./routes";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

async function start() {
  await dataSource.initialize();

  const schema = await getSchema();

  const app = express();
  const httpServer = http.createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    // path: '/subscriptions',
  });

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: (connection) => {
        return {
          req: connection.extra.request,
          res: null,
        };
      },
    },
    wsServer
  );

  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  initializeRoutes(app);

  app.use(
    "/",
    cors<cors.CorsRequest>({
      origin: "http://localhost:3001",
      credentials: true,
    }),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    express.json({ limit: "50mb" }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async (args) => {
        return {
          req: args.req,
          res: args.res,
        };
      },
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 5000 }, resolve)
  );
  console.log(`🚀 Server is running! (see docker-compose to find the port)`);
}

start();
