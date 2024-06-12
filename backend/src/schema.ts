import { buildSchema } from "type-graphql";
import { AdsResolver } from "./resolvers/Ads";
import { TagsResolver } from "./resolvers/Tags";
import { CategoriesResolver } from "./resolvers/Categories";
import { UsersResolver } from "./resolvers/Users";
import { customAuthChecker } from "./auth";
import { ImagesResolver } from "./resolvers/Images";
import { pubSub } from "./pubsub";
import { MessagesResolver } from "./resolvers/Messages";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      TagsResolver,
      CategoriesResolver,
      AdsResolver,
      UsersResolver,
      ImagesResolver,
      MessagesResolver,
    ],
    authChecker: customAuthChecker,
    pubSub: pubSub as any,
  });
  return schema;
}
