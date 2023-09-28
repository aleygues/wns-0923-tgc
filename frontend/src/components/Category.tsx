import Link from "next/link";

export type CategoryType = {
  id: number;
  name: string;
};

export type CategoryProps = CategoryType;

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <Link href={`/categories/${props.id}`} className="category-navigation-link">
      {props.name}
    </Link>
  );
}
