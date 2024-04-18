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

async function start() {
  await dataSource.initialize();

  const schema = await getSchema();

  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<ContextType>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  initializeRoutes(app);

  app.use(
    "/",
    cors<cors.CorsRequest>({
      origin: "http://localhost:3000",
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
