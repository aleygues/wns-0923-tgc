import {
  Arg,
  Authorized,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";
import { pubSub } from "../pubsub";
import { Message } from "../entities/Message";

@Resolver()
export class MessagesResolver {
  @Query(() => [Message])
  async allMessages(): Promise<Message[]> {
    const messages = await Message.find();
    return messages;
  }

  @Mutation(() => Message)
  async createMessage(
    @Arg("email") email: string,
    @Arg("conversationId") conversationId: number
  ): Promise<Message> {
    const newMessage = new Message();
    Object.assign(newMessage, {
      email,
      conversationId,
      sentAt: new Date().toISOString(),
    });
    await newMessage.save();
    pubSub.publish("MESSAGES", newMessage);
    return newMessage;
  }

  @Authorized()
  @Subscription(() => Message, {
    topics: "MESSAGES",
    filter: ({ payload, args, context }) => {
      return (
        payload.email === context.user.email &&
        payload.conversationId === args.conversationId
      );
    },
  })
  onMessage(
    @Root() payload: Message,
    @Arg("conversationId") conversationId: number
  ): Message {
    return payload;
  }
}
