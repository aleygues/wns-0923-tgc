import { gql } from "@apollo/client";

export const mutationCreateAd = gql`
  mutation createAd($data: AdCreateInput!) {
    item: createAd(data: $data) {
      id
    }
  }
`;
