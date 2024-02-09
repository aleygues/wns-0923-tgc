import gql from "graphql-tag";

export const queryAd = gql`
  query ($id: ID!) {
    ad(id: $id) {
      id
      title
      createdBy {
        id
      }
    }
  }
`;
