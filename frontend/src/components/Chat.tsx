import { queryAllMessages } from "@/graphql/queryAllMessages";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { useEffect } from "react";

type Message = {
  sentAt: string;
  id: number;
};

export function Chat() {
  const { data, subscribeToMore } = useQuery<{ items: Message[] }>(
    queryAllMessages
  );
  const messages = data?.items ?? [];

  // this is possible to achieve the pretty same result
  // using useSubscription + useState
  useEffect(() => {
    if (subscribeToMore) {
      subscribeToMore({
        document: gql`
          subscription {
            onMessage(conversationId: 12) {
              email
              sentAt
            }
          }
        `,
        variables: {},
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;

          const data = subscriptionData.data as any;

          return { items: [...prev.items, data.onMessage] };
        },
      });
    }
  }, [subscribeToMore]);

  return (
    <div style={{ marginTop: "200px" }}>
      <h1>Chat conversation n°12</h1>
      {messages.map((message) => (
        <div key={message.id}>
          <p>Sent at: {message.sentAt}</p>
        </div>
      ))}
    </div>
  );
}
