/* eslint-disable react/no-unescaped-entities */
import CategoryForm from "@/components/CategoryForm";
import { Layout } from "@/components/Layout";

export default function NewCategory() {
  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <CategoryForm />
      </main>
    </Layout>
  );
}
