import { Layout } from "@/components/Layout";
import { queryMe } from "@/graphql/queryMe";
import { UserType } from "@/types";
import { useQuery } from "@apollo/client";

export default function Me(): React.ReactNode {
  // to use to get current user
  const { data: meData } = useQuery<{ item: UserType | null }>(queryMe);
  const me = meData?.item;

  return (
    <Layout title="Mon profile">
      <main className="main-content">
        <p>Mon adresse est : {me?.email}</p>
      </main>
    </Layout>
  );
}
