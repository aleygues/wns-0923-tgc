import { Layout } from "@/components/Layout";
import { RecentAds } from "@/components/RecentAds";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  // check if we got query.searchWord (check useRouter)
  const router = useRouter();
  const [searchWord, setSearchWord] = useState<string>();

  useEffect(() => {
    if (typeof router.query.searchWord === "string") {
      setSearchWord(router.query.searchWord);
    }
  }, [router.query]);

  return (
    <Layout title="Home">
      <RecentAds searchWord={searchWord} />
    </Layout>
  );
}
