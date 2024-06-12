import { gql } from "@apollo/client";

export const queryAllMessages = gql`
  query messages {
    items: allMessages {
      id
      email
      sentAt
    }
  }
`;
