import { AdCard, AdCardProps } from "./AdCard";

export const ads: AdCardProps[] = [
  {
    title: "Table",
    price: 120,
    link: "/ads/table",
    imgUrl: "/images/table.webp",
  },
  {
    title: "Dame-jeanne",
    price: 75,
    link: "/ads/dame-jeanne",
    imgUrl: "/images/dame-jeanne.webp",
  },
];

export function RecentAds(): React.ReactNode {
  return (
    <main className="main-content">
      <h2>Annonces récentes</h2>
      <section className="recent-ads">
        {ads.map((item) => (
          <AdCard
            key={item.title}
            title={item.title}
            price={item.price}
            imgUrl={item.imgUrl}
            link={item.link}
          />
        ))}
      </section>
    </main>
  );
}
