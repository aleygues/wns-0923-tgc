import gql from "graphql-tag";

export const mutationSignin = gql`
  mutation ($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
    }
  }
`;
