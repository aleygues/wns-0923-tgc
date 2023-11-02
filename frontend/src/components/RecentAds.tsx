import { useEffect, useState } from "react";
import { AdCard, AdType } from "./AdCard";
import { gql, useQuery } from "@apollo/client";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export const queryAllAds = gql`
  query ads($where: AdsWhere) {
    items: allAds(where: $where) {
      id
      title
      price
      imgUrl
    }
  }
`;

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  const { data } = useQuery<{ items: AdType[] }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
    },
  });
  const ads = data ? data.items : [];

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      <section className="recent-ads">
        {ads.map((item) => (
          <div key={item.id}>
            <AdCard
              id={item.id}
              title={item.title}
              price={item.price}
              imgUrl={item.imgUrl}
              link={`/ads/${item.id}`}
              description={item.description}
              category={item.category}
            />
            <button
              onClick={() => {
                addToTotal(item.price);
              }}
            >
              Ajouter {item.price}€ au total
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}
