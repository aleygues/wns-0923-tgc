import { gql } from "@apollo/client";

export const mutationSignup = gql`
  mutation signup($data: UserCreateInput!) {
    item: signup(data: $data) {
      id
    }
  }
`;
