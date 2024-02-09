import gql from "graphql-tag";

export const mutationCreateAd = gql`
  mutation ($data: AdCreateInput!) {
    createAd(data: $data) {
      id
    }
  }
`;
