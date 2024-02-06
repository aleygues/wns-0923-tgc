import gql from "graphql-tag";

export const mutationSignup = gql`
  mutation ($data: UserCreateInput!) {
    signup(data: $data) {
      id
    }
  }
`;
