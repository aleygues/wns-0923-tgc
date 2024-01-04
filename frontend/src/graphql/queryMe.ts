import { gql } from "@apollo/client";

export const queryMe = gql`
  query me {
    item: me {
      id
      email
    }
  }
`;
