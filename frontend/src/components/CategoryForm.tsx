/* eslint-disable react/no-unescaped-entities */
import { CategoryType } from "@/components/Category";
import { Layout } from "@/components/Layout";
import { queryAllCategories } from "@/graphql/queryAllCategories";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useRef, useState } from "react";
import { mutationCreateCategory } from "@/graphql/mutationCreateCategory";
import { mutationUpdateCategory } from "@/graphql/mutationUpdateCategory";
import axios from "axios";

type CategoryFormData = {
  name: string;
  image: { id: number } | null;
};

type CategoryFormProps = {
  category?: CategoryType;
};

export default function CategoryForm(props: CategoryFormProps) {
  const [error, setError] = useState<"name">();

  const [name, setName] = useState("");
  const [image, setImage] = useState<CategoryType["image"]>();

  const router = useRouter();

  const [doCreate, { loading: createLoading }] = useMutation(
    mutationCreateCategory,
    {
      refetchQueries: [queryAllCategories],
    }
  );
  const [doUpdate, { loading: updateLoading }] = useMutation(
    mutationUpdateCategory,
    {
      refetchQueries: [queryAllCategories],
    }
  );
  const loading = createLoading || updateLoading;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const data: CategoryFormData = {
      name,
      image: image ? { id: Number(image.id) } : null,
    };

    if (data.name.trim().length < 3) {
      setError("name");
    } else {
      if (!props.category) {
        const result = await doCreate({
          variables: {
            data: data,
          },
        });
        if ("id" in result.data?.item) {
          router.replace(`/categories/${result.data.item.id}`);
        }
      } else {
        const result = await doUpdate({
          variables: {
            id: props.category?.id,
            data: data,
          },
        });
        if (!result.errors?.length) {
          router.replace(`/categories/${props.category.id}`);
        }
      }
    }
  }

  useEffect(() => {
    if (props.category) {
      setName(props.category.name);
      setImage(props.category.image);
    }
  }, [props.category]);

  const fileInput = useRef<HTMLInputElement>(null);
  function pickFile() {
    fileInput.current?.click();
  }
  async function onSelectFile(file?: File) {
    if (file) {
      // we may check file type and size before upload
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await axios.post(
        "http://localhost:5000/api/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.image) {
        setImage(data?.image);
      } else {
        // should handle upload failed
      }
    } else {
      // should handle if no file has been selected?
    }
  }

  return (
    <Layout title="Nouvelle offre">
      <main className="main-content">
        <p>{props.category ? "Modifier la catégorie" : "Nouvelle catégorie"}</p>
        {error === "name" && <p>Le nom doit être plus long</p>}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Nom de la catégorie"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <br />
          {image && <img src={`http://localhost:5000${image?.uri}`} />}
          <input
            type="file"
            ref={fileInput}
            onChange={(e) => onSelectFile(e.target?.files?.[0])}
            style={{ display: "none" }}
          />
          <button onClick={() => pickFile()}>Sélectionner un fichier</button>
          <br />
          <br />

          <br />
          <br />
          <button type="submit" disabled={loading}>
            {props.category ? "Modifier" : "Créer"}
          </button>
        </form>
      </main>
    </Layout>
  );
}
