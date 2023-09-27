import { CategoryType } from "@/components/Category";
import { Layout } from "@/components/Layout";
import { API_URL } from "@/config";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

type AdFormData = {
  title: string;
  description: string;
  price: number;
  category: { id: number };
};

export default function NewAd() {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  async function fetchCategories() {
    const result = await axios.get<CategoryType[]>(`${API_URL}/categories`);
    setCategories(result.data);
  }

  useEffect(() => {
    // mounting
    fetchCategories();
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as AdFormData;

    if ("categoryId" in data) {
      data.category = { id: Number(data.categoryId) };
      delete data.categoryId;
    }

    console.log(data);
  }

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <p>Poster une nouvelle offre</p>
        <form onSubmit={onSubmit}>
          <input type="text" name="title" placeholder="Titre de l'annonce" />
          <br />
          <br />
          <input
            type="text"
            name="description"
            placeholder="Description de l'annonce"
          />
          <br />
          <br />
          <input type="number" name="price" placeholder="0,00€" />
          <br />
          <br />
          <select name="categoryId">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button type="submit">Poster l'annonce</button>
        </form>
      </main>
    </Layout>
  );
}
