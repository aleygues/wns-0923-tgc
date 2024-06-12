import { createPubSub } from "graphql-yoga";
import { Message } from "./entities/Message";

export const pubSub = createPubSub<{
  MESSAGES: [Message];
}>();
