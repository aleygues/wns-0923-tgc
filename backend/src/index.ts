import "reflect-metadata";
import { dataSource } from "./datasource";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { AdsResolver } from "./resolvers/Ads";
import { TagsResolver } from "./resolvers/Tags";
import { CategoriesResolver } from "./resolvers/Categories";

async function start() {
  const schema = await buildSchema({
    resolvers: [TagsResolver, CategoriesResolver, AdsResolver],
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
