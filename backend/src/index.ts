import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { TagsResolver } from "./resolvers/Tags";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./resolvers/Ads";

async function start() {
  const schema = await buildSchema({
    resolvers: [TagsResolver, AdsResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  await dataSource.initialize();
  await startStandaloneServer(server, {
    listen: {
      port: 5000,
    },
  });

  console.log("🚀 Server started!");
}

start();
