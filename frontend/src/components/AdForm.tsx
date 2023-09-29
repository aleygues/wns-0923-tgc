/* eslint-disable react/no-unescaped-entities */
import { AdType } from "@/components/AdCard";
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

type AdFormProps = {
  ad?: AdType;
};

export default function AdForm(props: AdFormProps) {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [error, setError] = useState<"title" | "price">();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<null | number>(null);

  async function fetchCategories() {
    const result = await axios.get<CategoryType[]>(`${API_URL}/categories`);
    setCategories(result.data);
  }

  useEffect(() => {
    // mounting
    fetchCategories();
  }, []);

  const router = useRouter();

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
      if (!props.ad) {
        const result = await axios.post(`${API_URL}/ads`, data);
        if ("id" in result.data) {
          router.replace(`/ads/${result.data.id}`);
        }
      } else {
        const result = await axios.patch(`${API_URL}/ads/${props.ad.id}`, data);
        if (result.status >= 200 && result.status < 300) {
          router.replace(`/ads/${props.ad.id}`);
        }
      }
    }
  }

  useEffect(() => {
    if (props.ad) {
      setTitle(props.ad.title);
      setDescription(props.ad.description);
      setPrice(props.ad.price);
      setImgUrl(props.ad.imgUrl);
      setCategoryId(props.ad.category ? props.ad.category.id : null);
    }
  }, [props.ad]);

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <p>{props.ad ? "Modifier l'offre" : "Nouvelle offre"}</p>
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
          <button type="submit">{props.ad ? "Modifier" : "Créer"}</button>
        </form>
      </main>
    </Layout>
  );
}
