import { useEffect, useState } from "react";
import { AdCard, AdCardProps, AdType } from "./AdCard";
import axios from "axios";
import { API_URL } from "@/config";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [ads, setAds] = useState([] as AdCardProps[]);
  const [totalPrice, setTotalPrice] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  async function fetchAds() {
    // be careful here, I'm injected a category ID filter
    // but it depends on how you implement your filter on your API
    let url = `${API_URL}/ads?`;

    if (props.categoryId) {
      url += `categoryIn=${props.categoryId}&`;
    }

    if (props.searchWord) {
      url += `searchTitle=${props.searchWord}&`;
    }

    const result = await axios.get(url);
    setAds(result.data);
  }

  useEffect(() => {
    // mounting
    fetchAds();
  }, [props.categoryId, props.searchWord]);

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
              onDelete={fetchAds}
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
