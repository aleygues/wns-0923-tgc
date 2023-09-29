import { API_URL } from "@/config";
import axios from "axios";
import { CategoryType } from "./Category";

export type AdType = {
  id: number;
  link: string;
  imgUrl: string;
  title: string;
  price: number;
  description: string;
  category: CategoryType | null;
};

export type AdCardProps = AdType & {
  onDelete?: () => void;
};

export function AdCard(props: AdCardProps): React.ReactNode {
  async function deleteAd() {
    await axios.delete(`${API_URL}/ads/${props.id}`);
    if (props.onDelete) {
      props.onDelete();
    }
    // props.onDelete?.();
  }

  return (
    <div className="ad-card-container">
      <a className="ad-card-link" href={props.link}>
        <img className="ad-card-image" src={props.imgUrl} />
        <div className="ad-card-text">
          <div className="ad-card-title">{props.title}</div>
          <div className="ad-card-price">{props.price} €</div>
        </div>
      </a>
      {props.onDelete && <button onClick={deleteAd}>Supprimer</button>}
    </div>
  );
}
