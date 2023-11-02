import { gql } from "@apollo/client";

export const mutationUpdateAd = gql`
  mutation updateAd($id: ID!, $data: AdUpdateInput!) {
    updateAd(id: $id, data: $data) {
      id
    }
  }
`;
