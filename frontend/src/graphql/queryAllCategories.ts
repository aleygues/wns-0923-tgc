import { gql } from "@apollo/client";

export const queryAllCategories = gql`
  query categories {
    items: allCategories {
      id
      name
    }
  }
`;
