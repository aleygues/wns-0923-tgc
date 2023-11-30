import { useState } from "react";
import { AdCard, AdType } from "./AdCard";
import { gql, useQuery } from "@apollo/client";

type RecentAdsProps = {
  categoryId?: number;
  searchWord?: string;
};

export const queryAllAds = gql`
  query AllAds($skip: Int, $take: Int, $where: AdsWhere) {
    items: allAds(skip: $skip, take: $take, where: $where) {
      id
      imgUrl
      price
      title
    }
    count: allAdsCount(where: $where)
  }
`;

export function RecentAds(props: RecentAdsProps): React.ReactNode {
  const [totalPrice, setTotalPrice] = useState(0);

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  function addToTotal(price: number) {
    const newTotalPrice = price + totalPrice;
    setTotalPrice(newTotalPrice);
  }

  const { data } = useQuery<{ items: AdType[]; count: number }>(queryAllAds, {
    variables: {
      where: {
        ...(props.categoryId ? { categoryIn: [props.categoryId] } : {}),
        ...(props.searchWord ? { searchTitle: props.searchWord } : {}),
      },
      skip: page * pageSize,
      take: pageSize,
    },
  });
  const ads = data ? data.items : [];
  const count = data ? data.count : 0;

  const pagesCount = Math.ceil(count / pageSize);

  // this function ensure that we do not stay blocked on an empty page due
  // to a page size change
  function onPageSizeChange(newValue: number) {
    const newPagesCount = Math.ceil(count / newValue);
    if (page >= newPagesCount) {
      setPage(Math.max(newPagesCount - 1, 0));
    }
    setPageSize(newValue);
  }

  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <p>Prix total des offres sélectionnées : {totalPrice}€</p>
      <p>Nombre de résultats par page ?</p>
      <button onClick={() => onPageSizeChange(5)}>5</button>
      <button onClick={() => onPageSizeChange(10)}>10</button>
      <button onClick={() => onPageSizeChange(20)}>20</button>
      <br />
      <br />
      <p>
        Page actuelle : {page + 1} ; nombre total éléments : {count}
      </p>
      <button
        disabled={page === 0}
        onClick={() => setPage(Math.max(page - 1, 0))}
      >
        Précédent
      </button>
      <button
        disabled={page === pagesCount - 1}
        onClick={() => setPage(Math.min(page + 1, pagesCount))}
      >
        Suivant
      </button>
      <br />
      <br />
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
