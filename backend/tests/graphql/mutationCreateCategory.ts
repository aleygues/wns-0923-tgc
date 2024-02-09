import gql from "graphql-tag";

export const mutationCreateCategory = gql`
  mutation ($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
    }
  }
`;
