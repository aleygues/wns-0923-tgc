/* eslint-disable react/no-unescaped-entities */
import { AdType } from "@/components/AdCard";
import AdForm from "@/components/AdForm";
import { Layout } from "@/components/Layout";
import { API_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditAd() {
  const [ad, setAd] = useState<AdType>();

  const router = useRouter();
  const adId = router.query.id;

  async function fetchAd() {
    const result = await axios.get<AdType>(`${API_URL}/ads/${adId}`);
    setAd(result.data);
  }

  useEffect(() => {
    // mounting
    if (typeof adId === "string") {
      fetchAd();
    }
  }, [adId]);

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">{ad && <AdForm ad={ad} />}</main>
    </Layout>
  );
}
