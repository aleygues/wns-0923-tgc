import { gql } from "@apollo/client";

export const mutationUpdateCategory = gql`
  mutation updateCategory($id: ID!, $data: CategoryUpdateInput!) {
    updateCategory(id: $id, data: $data) {
      id
    }
  }
`;
