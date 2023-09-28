/* eslint-disable react/no-unescaped-entities */
import { CategoryType } from "@/components/Category";
import { Layout } from "@/components/Layout";
import { API_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

type AdFormData = {
  title: string;
  description: string;
  imgUrl: string;
  price: number;
  category: { id: number } | null;
};

export default function NewAd() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<"title" | "price">();
  const [hasBeenSent, setHasBeenSent] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<null | number>(null);

  const router = useRouter();

  async function fetchCategories() {
    const result = await axios.get<CategoryType[]>(`${API_URL}/categories`);
    setCategories(result.data);
  }

  useEffect(() => {
    // mounting
    fetchCategories();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const data: AdFormData = {
      title,
      description,
      imgUrl,
      price,
      category: categoryId ? { id: Number(categoryId) } : null,
    };

    if (data.title.trim().length < 3) {
      setError("title");
    } else if (data.price < 0) {
      setError("price");
    } else {
      const result = await axios.post(`${API_URL}/ads`, data);
      if ("id" in result.data) {
        setTitle("");
        setDescription("");
        setPrice(0);
        setImgUrl("");
        setCategoryId(null);

        setHasBeenSent(true);
        // redirect to /ads/result.data.id
        // https://nextjs.org/docs/pages/api-reference/functions/use-router
        setTimeout(() => {
          router.push(`/ads/${result.data.id}`);
        }, 5000);
      }
    }
  }

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        {hasBeenSent ? (
          <p>C'est OK</p>
        ) : (
          <>
            <p>Poster une nouvelle offre</p>
            {error === "price" && <p>Le prix doit être positif</p>}
            {error === "title" && (
              <p>Le titre est requis et doit faire plus de 3 caractères</p>
            )}
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Titre de l'annonce"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <br />
              <br />
              <input
                type="text"
                name="description"
                placeholder="Description de l'annonce"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <br />
              <br />
              <input
                type="text"
                name="imgUrl"
                placeholder="Lien de l'image"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
              <br />
              <br />
              <input
                type="number"
                name="price"
                placeholder="0,00€"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <br />
              <br />
              <select
                name="categoryId"
                value={categoryId + ""}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
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
          </>
        )}
      </main>
    </Layout>
  );
}
