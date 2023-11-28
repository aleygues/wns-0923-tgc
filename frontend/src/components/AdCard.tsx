import { CategoryType } from "./Category";
import { gql, useMutation } from "@apollo/client";
import { queryAllAds } from "./RecentAds";
import Link from "next/link";

export type AdType = {
  id: number;
  link: string;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
  category: CategoryType | null;
};

const mutationDeleteAd = gql`
  mutation deleteAd($id: ID!) {
    deleteAd(id: $id) {
      id
      title
    }
  }
`;

export type AdCardProps = AdType & {
  onDelete?: () => void;
};

export function AdCard(props: AdCardProps): React.ReactNode {
  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAllAds],
  });


  async function deleteAd() {
    await doDelete({
      variables: {
        id: props.id,
      },
    });

    if (props.onDelete) {
      props.onDelete();
    }
    // props.onDelete?.();
  }

  return (
    <div className="ad-card-container">
      <Link className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </Link>
      {props.onDelete && <button onClick={deleteAd}>Supprimer</button>}
    </div>
  );
}
