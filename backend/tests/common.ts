import { serialize, parse } from "cookie";
import { GraphQLSchema } from "graphql";
import { DataSource } from "typeorm";

export function mockContext(token?: string) {
  const value: { context: any; token?: string } = {
    token,
    context: {
      req: {
        headers: {
          cookie: token ? serialize("token", token) : undefined,
        },
        connection: { encrypted: false },
      },
      res: {
        getHeader: () => "",
        setHeader: (key: string, cookieValue: string | string[]) => {
          if (key === "Set-Cookie") {
            const parsedValue = parse(
              Array.isArray(cookieValue) ? cookieValue[0] : cookieValue
            );
            if (parsedValue.token) {
              value.token = parsedValue.token;
            }
          }
        },
        headers: {},
      },
    },
  };
  return value;
}

export type TestArgs = {
  schema: GraphQLSchema;
  dataSource: DataSource;
  data: any;
};
export type RunFunction = (args: TestArgs) => void;
