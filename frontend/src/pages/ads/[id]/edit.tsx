/* eslint-disable react/no-unescaped-entities */
import { AdType } from "@/components/AdCard";
import AdForm from "@/components/AdForm";
import { Layout } from "@/components/Layout";
import { queryAd } from "@/graphql/queryAd";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

export default function EditAd() {
  const router = useRouter();
  const adId = router.query.id;

  const { data } = useQuery<{ item: AdType }>(queryAd, {
    variables: {
      id: adId,
    },
    skip: adId === undefined,
  });
  const ad = data ? data.item : null;

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">{ad && <AdForm ad={ad} />}</main>
    </Layout>
  );
}
