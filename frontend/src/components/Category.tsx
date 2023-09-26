export type CategoryProps = {
  link: string;
  name: string;
};

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <a href={props.link} className="category-navigation-link">
      {props.name}
    </a>
  );
}
