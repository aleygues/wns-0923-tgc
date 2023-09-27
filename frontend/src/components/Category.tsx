export type CategoryType = {
  id: number;
  name: string;
};

// taking the onclick prop is just an example
// of how to extend a type, it does not make
// really sense here
export type CategoryProps = CategoryType & {
  onClick: () => void;
};

export function Category(props: CategoryProps): React.ReactNode {
  return (
    <a onClick={props.onClick} className="category-navigation-link">
      {props.name}
    </a>
  );
}
