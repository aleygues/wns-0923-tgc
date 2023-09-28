import { Layout } from "@/components/Layout";
import { RecentAds } from "@/components/RecentAds";
import { useRouter } from "next/router";

export default function Category() {
  const router = useRouter();
  const categoryId = Number(router.query.id);

  return (
    <Layout title="Category">
      <RecentAds categoryId={categoryId} />
    </Layout>
  );
}
