import { gql } from "@apollo/client";

export const mutationCreateCategory = gql`
  mutation createCategory($data: CategoryCreateInput!) {
    item: createCategory(data: $data) {
      id
    }
  }
`;
