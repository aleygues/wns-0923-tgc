import { gql } from "@apollo/client";

export const mutationSignin = gql`
  mutation signin($password: String!, $email: String!) {
    item: signin(password: $password, email: $email) {
      id
    }
  }
`;
