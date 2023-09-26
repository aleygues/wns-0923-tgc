import { Layout } from "@/components/Layout";
/* import { ads } from "@/components/RecentAds"; */
import { useRouter } from "next/router";

export default function Ad() {
  const router = useRouter();

  const adId = router.query.id as string;
  let foundAd = null;
  /* for (const ad of ads) {
    if (ad.link.endsWith(adId)) {
      foundAd = ad;
      break;
    }
  } */
  // const foundAd = ads.find(ad => ad.link.endsWith(adId));

  return (
    <Layout title="Ad">
      <main className="main-content">
        <p>Offre ID: {router.query.id}</p>
        {/*         {foundAd && (
          <>
            <h2>{foundAd.title}</h2>
            <p>{foundAd.price} €</p>
          </>
        )} */}
      </main>
    </Layout>
  );
}
